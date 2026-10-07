import { NextRequest, NextResponse } from 'next/server'
import { contactSchema, honeypotSchema } from '@/lib/validations/contact'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { createWorkRequest } from '@/services/requests.service'
import { getPublishedServices } from '@/services/services.service'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'

/**
 * POST /api/contact
 * Route Handler alternatif pour le formulaire contact.
 * Utile pour les clients JS qui préfèrent fetch() aux Server Actions.
 * Applique rate limiting, validation Zod et persistance DB.
 */
export async function POST(request: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────
  const ip = getClientIp(request.headers)
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Trop de tentatives. Réessayez dans ${rateLimit.retryAfter}s.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  // ── Parse JSON ─────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  // ── Honeypot anti-bot ──────────────────────────────────────
  const honeypotRaw = (body as Record<string, unknown>)?.website
  const honeypot = honeypotSchema.safeParse({
    website: typeof honeypotRaw === 'string' ? honeypotRaw : '',
  })
  if (!honeypot.success || honeypot.data.website !== '') {
    // Réponse factice pour ne pas révéler le piège
    return NextResponse.json({ error: 'Données invalides.' }, { status: 422 })
  }

  // ── Validation Zod ─────────────────────────────────────────
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Données invalides.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    )
  }

  const input = parsed.data

  // ── Persistance ────────────────────────────────────────────
  try {
    await createWorkRequest({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      service_id: input.service_id ?? null,
      budget: input.budget ?? null,
      message: input.message,
    })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json(
      { error: 'Erreur serveur. Veuillez réessayer.' },
      { status: 500 },
    )
  }

  // ── Succès ─────────────────────────────────────────────────
  // Récupérer le titre du service pour le message WhatsApp (best-effort).
  let serviceName: string | undefined
  if (input.service_id) {
    try {
      const services = await getPublishedServices()
      serviceName = services.find((s) => s.id === input.service_id)?.title
    } catch {
      // best-effort
    }
  }

  const whatsappUrl = buildWhatsAppUrl({
    name: input.name,
    service: serviceName,
    budget: input.budget ?? undefined,
  })

  return NextResponse.json(
    { success: true, whatsappUrl },
    { status: 201 },
  )
}

// Rejeter explicitement les autres méthodes
export async function GET() {
  return NextResponse.json({ error: 'Méthode non autorisée.' }, { status: 405 })
}
