import Script from 'next/script'
import { getSiteSettings } from '@/services/settings.service'
import type { SiteSettings } from '@/types/database'
import { cn } from '@/lib/utils/cn'

/**
 * Espace publicitaire près des articles (activable depuis
 * le dashboard admin → Paramètres → Publicité).
 *
 * Priorité d'affichage :
 * 1. Code HTML personnalisé (AdSense <ins>, autre réseau…)
 * 2. Sinon bannière image (+ lien optionnel)
 * Chargé en douceur : si la migration 005 n'est pas appliquée,
 * rien ne s'affiche (dégradation silencieuse).
 */
export async function AdSlot({ className }: { className?: string }) {
  let settings: SiteSettings | null = null
  try {
    settings = await getSiteSettings()
  } catch {
    return null
  }

  const enabled = settings?.ads_enabled === true
  const code = settings?.ads_code?.trim()
  const imageUrl = settings?.ads_image_url?.trim()

  if (!enabled || (!code && !imageUrl)) return null

  const publisher = settings?.adsense_publisher_id?.trim()
  const link = settings?.ads_image_link?.trim()

  return (
    <aside
      className={cn(
        'overflow-hidden rounded-[1.75rem] border border-border bg-surface p-5 shadow-soft',
        className,
      )}
      aria-label="Publicité"
    >
      <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-muted">
        Publicité
      </p>

      {/* Script AdSense (chargé une seule fois par page) */}
      {publisher && (
        <Script
          id="adsense-loader"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisher)}`}
        />
      )}

      {/* 1) Code HTML personnalisé */}
      {code && (
        <div
          className="ad-slot-code"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      )}

      {/* Sécurité AdSense : pousser la carte si code AdSense détecté et pas déjà poussé */}
      {code && publisher && (
        <Script
          id="adsense-push"
          strategy="afterInteractive"
        >
          {'try{(adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}'}
        </Script>
      )}

      {/* 2) Bannière image — <img> natif : n'importe quel domaine publicitaire
          fonctionne sans toucher à l'allowlist next/image ni à la CSP. */}
      {imageUrl && (
        <a
          href={link || '#'}
          target={link ? '_blank' : undefined}
          rel={link ? 'noopener noreferrer sponsored' : undefined}
          className="block overflow-hidden rounded-2xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Publicité"
            width={300}
            height={250}
            loading="lazy"
            className="h-auto w-full object-cover"
          />
        </a>
      )}
    </aside>
  )
}
