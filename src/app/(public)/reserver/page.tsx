import type { Metadata } from 'next'
import { getSiteSettings } from '@/services/settings.service'
import { siteConfig } from '@/config/site'
import { CalendlyWidget, CalendlyFallback } from './calendly-widget'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Réserver un Appel',
  description: 'Réservez un appel gratuit de 30 minutes avec notre équipe.',
}

const BENEFITS = [
  'Appel gratuit de 30 minutes',
  'Analyse de votre projet',
  'Devis transparent et sans engagement',
  'Conseils d\'experts',
]

export default async function ReserverPage() {
  const settings = await getSiteSettings()
  const calendlyUrl = settings?.calendly_url ?? ''
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp
  const phone = settings?.phone ?? siteConfig.phone

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3"><span aria-hidden="true">&#47;&#47;</span> Réservation</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Réservez un appel <span className="text-blue-400">gratuit</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            30 minutes pour discuter de votre projet et recevoir nos premiers conseils.
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Avantages */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Ce que vous obtenez</h2>
              <ul className="flex flex-col gap-4 mb-8">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-900 mb-1">Disponibles immédiatement ?</p>
                <p className="text-xs text-blue-700 mb-3">Contactez-nous directement sur WhatsApp pour une réponse instantanée.</p>
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite réserver un appel.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  WhatsApp →
                </a>
              </div>
            </div>

            {/* Widget Calendly ou fallback */}
            <div className="lg:col-span-2">
              {calendlyUrl ? (
                <CalendlyWidget url={calendlyUrl} />
              ) : (
                <CalendlyFallback whatsapp={whatsapp} phone={phone} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
