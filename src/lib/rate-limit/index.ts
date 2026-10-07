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
// ⚠️ En production serverless (Vercel), chaque instance lambda a son propre
// store — la limite est indicative. Pour du strict, migrer vers Upstash Redis.
const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5

// Purge périodique des entrées expirées pour éviter une fuite mémoire infinie.
// Un intervalle global est sûr : le module est réutilisé entre les requêtes.
const CLEANUP_INTERVAL_MS = 60 * 1000
let cleanupTimer: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of store) {
      if (entry.resetAt < now) store.delete(ip)
    }
    // Éviter la croissance non bornée si beaucoup d'IPs distinctes
    if (store.size > 10_000) {
      // Conserver les 10 000 entrées les plus récentes
      const sorted = [...store.entries()].sort((a, b) => b[1].resetAt - a[1].resetAt)
      store.clear()
      for (const [ip, entry] of sorted.slice(0, 10_000)) {
        store.set(ip, entry)
      }
    }
  }, CLEANUP_INTERVAL_MS)
  // Ne pas empêcher Node de se terminer
  if (typeof cleanupTimer.unref === 'function') cleanupTimer.unref()
}

/**
 * Vérifie si une IP a dépassé la limite de taux.
 * @returns `{ allowed: true }` ou `{ allowed: false, retryAfter: number }`
 */
export function checkRateLimit(
  ip: string,
): { allowed: true } | { allowed: false; retryAfter: number } {
  ensureCleanup()
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
