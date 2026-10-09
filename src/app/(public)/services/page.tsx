import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, MessageCircle, Globe, Palette, BrainCircuit, Clapperboard, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { JsonLd } from '@/components/seo/json-ld'
import { Reveal } from '@/components/public/reveal'
import { siteConfig } from '@/config/site'
import { getT } from '@/lib/i18n/server'
import { localizeService } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: 'Services',
    description: t.services.metaDescription,
    alternates: { canonical: '/services' },
  }
}

const ICON_MAP: Record<string, LucideIcon> = {
  Globe: Globe,
  Palette: Palette,
  Brain: BrainCircuit,
  Video: Clapperboard,
  Sparkles: Sparkles,
}

const VISUAL_GRADIENTS = [
  'from-blue-600 via-blue-700 to-indigo-800',
  'from-violet-600 via-purple-700 to-fuchsia-800',
  'from-sky-500 via-blue-600 to-indigo-700',
  'from-fuchsia-600 via-pink-700 to-rose-800',
  'from-emerald-500 via-teal-600 to-cyan-700',
]

/**
 * Construit une URL WhatsApp avec un message prérempli.
 * Le message vient du dictionnaire (FR/EN) — parcours direct : clic → message rédigé.
 */
function buildServiceWhatsAppUrl(message: string): string {
  const number = siteConfig.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export default async function ServicesPage() {
  const { t } = await getT()
  const services = (await getPublishedServices()).map((svc) => localizeService(svc, t))

  // ── SEO : données structurées Service ──
  const base = siteConfig.url.replace(/\/$/, '')
  const servicesLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((svc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: svc.title,
        ...(svc.description ? { description: svc.description } : {}),
        url: `${base}/services#${svc.slug}`,
        provider: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: base,
        },
        areaServed: {
          '@type': 'Place',
          name: siteConfig.location,
        },
      },
    })),
  }

  return (
    <>
      <JsonLd data={servicesLd} />
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
            {t.services.badge}
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            {t.services.title1}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{t.services.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            {t.services.sub}
          </p>
        </div>
      </section>

      {/* Rangées de services */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-28">
            {services.map((svc, i) => {
              const Icon = ICON_MAP[svc.icon ?? ''] ?? Sparkles
              const isEven = i % 2 === 0

              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className="scroll-mt-28"
                >
                  <Reveal
                    className={`flex flex-col items-center gap-14 md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`}
                    delay={i % 2 ? 100 : 0}
                  >
                    {/* Visuel */}
                  <div className="w-full flex-1">
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${VISUAL_GRADIENTS[i % VISUAL_GRADIENTS.length]} p-8 shadow-glow`}
                    >
                      <div
                        className="absolute inset-0 opacity-[0.14]"
                        style={{
                          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                          backgroundSize: '26px 26px',
                        }}
                        aria-hidden="true"
                      />
                      <div className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                      <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
                      <div className="relative flex h-full items-center justify-center">
                        <span className="flex h-28 w-28 items-center justify-center rounded-3xl border border-white/25 bg-white/15 backdrop-blur">
                          <Icon className="h-14 w-14 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <span className="absolute bottom-6 right-6 text-6xl font-extrabold text-white/15">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                      {t.services.numberBadge(i + 1)}
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-ink">{svc.title}</h2>
                    {svc.description && (
                      <p className="mt-5 leading-relaxed text-muted">{svc.description}</p>
                    )}
                    {svc.key_points.length > 0 && (
                      <ul className="mt-7 flex flex-col gap-3">
                        {svc.key_points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/10">
                              <Check className="h-3 w-3 text-blue-600" aria-hidden="true" />
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-9 flex flex-wrap gap-3">
                      <Link
                        href={`/tarifs#${svc.slug}`}
                        className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-card"
                      >
                        {t.services.pricingCta}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href={`/contact?service=${encodeURIComponent(svc.title)}`}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200"
                      >
                        {t.services.requestCta}
                      </Link>
                      <a
                        href={buildServiceWhatsAppUrl(t.services.waMessage(svc.title))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-6 py-3 text-sm font-bold text-green-700 shadow-soft transition-all hover:bg-green-50"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-16 text-center shadow-glow">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t.services.ctaTitle1} <span className="text-blue-200">{t.services.ctaTitle2}</span>{' '}
                {t.services.ctaTitle3}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-blue-100">
                {t.services.ctaSub}
              </p>
              <Link
                href="/reserver"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                {t.common.bookCall}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
