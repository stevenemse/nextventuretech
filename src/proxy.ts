import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Proxy Next.js 16 — remplace middleware.ts (déprécié).
 * Tourne sur le runtime Node.js (pas Edge).
 *
 * Responsabilités :
 * 1. Rafraîchir le token de session Supabase (obligatoire pour @supabase/ssr).
 * 2. Protéger toutes les routes /admin/* sauf /admin/login.
 * 3. Rediriger /admin → /admin/demandes.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT : getUser() valide le token côté serveur.
  // Ne pas utiliser getSession() (lit uniquement le cookie sans validation).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirection /admin → /admin/demandes
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/demandes', request.url))
  }

  // Protection des routes admin (hors /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Utilisateur connecté tentant d'accéder à /admin/login → dashboard
  if (pathname === '/admin/login' && user) {
    return NextResponse.redirect(new URL('/admin/demandes', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Exécuter sur toutes les routes sauf :
     * - _next/static, _next/image
     * - favicon.ico, sitemap.xml, robots.txt
     * - fichiers statiques avec extension connue
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
