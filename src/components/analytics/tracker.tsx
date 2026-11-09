'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Enregistre une vue de page à chaque navigation, sans cookie ni identifiant
 * persistant. Utilise `sendBeacon` pour ne jamais retarder le rendu, avec
 * `fetch(keepalive)` en repli.
 *
 * Les routes /admin et /api sont ignorées côté client *et* côté serveur.
 */
export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastSent = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return
    // Évite le double envoi en React StrictMode (dev)
    if (lastSent.current === pathname) return
    lastSent.current = pathname

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || '',
      lang: document.documentElement.lang || 'fr',
    })

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' })
        navigator.sendBeacon('/api/analytics', blob)
        return
      }
    } catch {
      // repli ci-dessous
    }

    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // la mesure ne doit jamais casser la navigation
    })
  }, [pathname])

  return null
}
