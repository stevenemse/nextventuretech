/**
 * Rate limiter en mémoire pour les endpoints publics sensibles.
 * Compatible avec l'Edge Runtime de Next.js.
 *
 * Limite : 5 tentatives par fenêtre de 15 minutes par IP.
 * Pour la production à fort trafic, migrer vers Upstash Redis.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Store en mémoire (partagé entre les workers dans un même processus)
const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5

/**
 * Vérifie si une IP a dépassé la limite de taux.
 * @returns `{ allowed: true }` ou `{ allowed: false, retryAfter: number }`
 */
export function checkRateLimit(
  ip: string,
): { allowed: true } | { allowed: false; retryAfter: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || entry.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  entry.count++
  return { allowed: true }
}

/**
 * Extrait l'IP du client depuis les headers de la requête.
 * Respecte les proxies (Vercel, Cloudflare…).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
