import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRateLimiter, getClientIp } from '@/lib/rate-limit'

/** 120 vues par heure et par IP : large pour un humain, borné pour un bot. */
const limiter = createRateLimiter({ max: 120, windowMs: 60 * 60 * 1000 })

function deviceFrom(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) return 'tablet'
  if (/mobi|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

/**
 * POST /api/analytics
 * Enregistre une vue de page. Répond toujours 204 quand la mesure est
 * ignorée, pour ne jamais perturber le visiteur.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers)
  if (!limiter(ip).allowed) {
    return new NextResponse(null, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return new NextResponse(null, { status: 400 })
  }

  const raw = body as { path?: unknown; referrer?: unknown; lang?: unknown }
  const path = typeof raw.path === 'string' ? raw.path.slice(0, 300) : ''

  // Seules les pages publiques sont mesurées
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.startsWith('/admin') ||
    path.startsWith('/api')
  ) {
    return new NextResponse(null, { status: 204 })
  }

  const referrer =
    typeof raw.referrer === 'string' ? raw.referrer.slice(0, 500) : ''
  const lang = raw.lang === 'en' ? 'en' : 'fr'
  const userAgent = request.headers.get('user-agent') ?? ''
  const device = deviceFrom(userAgent)

  // Empreinte anonyme : IP + user-agent + jour, hachée puis tronquée.
  // L'IP n'est jamais écrite en base.
  const day = new Date().toISOString().slice(0, 10)
  const visitorHash = createHash('sha256')
    .update(`${ip}|${userAgent}|${day}`)
    .digest('hex')
    .slice(0, 20)

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('page_views').insert({
      path,
      referrer: referrer || null,
      device,
      lang,
      visitor_hash: visitorHash,
    })
    if (error) console.warn('[analytics] insertion échouée :', error.message)
  } catch (err) {
    // La mesure ne doit jamais renvoyer d'erreur au navigateur
    console.warn('[analytics] erreur insertion :', err)
  }

  return new NextResponse(null, { status: 204 })
}

export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 })
}
