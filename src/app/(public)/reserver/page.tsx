import type { Metadata } from 'next'
import { getSiteSettings } from '@/services/settings.service'
import { siteConfig } from '@/config/site'
import { CalendlyWidget, CalendlyFallback } from './calendly-widget'
import { CheckCircle2 } from 'lucide-react'
import { getT } from '@/lib/i18n/server'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: t.nav.links.book,
    description: t.reserver.metaDescription,
  }
}


export default async function ReserverPage() {
  const { t } = await getT()
  const settings = await getSiteSettings()
  const calendlyUrl = settings?.calendly_url ?? ''
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp
  const phone = settings?.phone ?? siteConfig.phone

  return (
    <>
      {/* Hero clair */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] to-background pb-16 pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(43 92 246 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(43 92 246 / 0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
            {t.reserver.badge}
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            {t.reserver.title1}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{t.reserver.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            {t.reserver.sub}
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal grid gap-10 lg:grid-cols-5">
            {/* Avantages */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-ink">
                {t.reserver.benefitsTitle}
              </h2>
              <ul className="mb-8 flex flex-col gap-3">
                {t.reserver.benefits.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-soft"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 shadow-glow">
                <div
                  className="absolute inset-0 opacity-[0.14]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="text-base font-extrabold text-white">{t.reserver.immediateTitle}</p>
                  <p className="mt-1 text-sm leading-relaxed text-blue-100">
                    {t.reserver.immediateText}
                  </p>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t.reserver.waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                  >
                    {t.reserver.openWa}
                  </a>
                </div>
              </div>
            </div>

            {/* Widget Calendly ou fallback */}
            <div className="lg:col-span-3">
              <div className="overflow-hidden rounded-[2rem] border border-border bg-surface p-2 shadow-soft sm:p-4">
                {calendlyUrl ? (
                  <CalendlyWidget url={calendlyUrl} />
                ) : (
                  <div className="p-4 sm:p-8">
                    <CalendlyFallback whatsapp={whatsapp} phone={phone} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
