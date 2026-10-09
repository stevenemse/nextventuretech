import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Check, ChevronRight, Compass, Globe, Palette,
  BrainCircuit, Clapperboard, Sparkles, Play, Rocket,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getPublishedWorks } from '@/services/works.service'
import { getActiveStats } from '@/services/settings.service'
import { ServicesMarquee } from '@/components/public/services-marquee'
import { WorkCard } from '@/components/public/work-card'
import { FaqSection } from '@/components/public/faq-section'
import { JsonLd } from '@/components/seo/json-ld'
import { Reveal } from '@/components/public/reveal'
import { CountUp } from '@/components/public/count-up'
import { siteConfig } from '@/config/site'
import { getT } from '@/lib/i18n/server'
import { localizeService } from '@/lib/i18n'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: `${siteConfig.name} — ${t.home.metaTitle}`,
    description: t.home.metaDescription,
  }
}

const ICON_MAP: Record<string, LucideIcon> = {
  Globe: Globe,
  Palette: Palette,
  Brain: BrainCircuit,
  Video: Clapperboard,
  Sparkles: Sparkles,
}

const TILE_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-violet-500 to-purple-600',
  'from-sky-400 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-emerald-400 to-teal-600',
]

/** Icônes des cartes valeurs (ordre = ordre du dictionnaire). */
const VALUE_ICONS = [Globe, Palette, BrainCircuit, Rocket]

export default async function HomePage() {
  const { t } = await getT()

  const [rawServices, works, stats] = await Promise.all([
    getPublishedServices(),
    getPublishedWorks(),
    getActiveStats(),
  ])
  const services = rawServices.map((svc) => localizeService(svc, t))

  // ── SEO : données structurées Organization ──
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url.replace(/\/$/, '')}/logo/nextventure-logo-light.svg`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Douala',
      addressCountry: 'CM',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      availableLanguage: ['fr', 'en'],
    },
  }

  return (
    <>
      <JsonLd data={organizationLd} />
      {/* ─── HERO ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] via-background to-background pb-20 pt-40 lg:pb-28"
        aria-label="Hero"
      >
        {/* Halos lumineux */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-blue-400/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-300/25 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(rgb(43 92 246 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(43 92 246 / 0.05) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* ── Texte gauche ── */}
            <div className="animate-fade-in-up">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" aria-hidden="true" />
                {t.home.badge}
              </div>

              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
                {t.home.h1Pre}{' '}
                <span className="relative inline-block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {t.home.h1Highlight}
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 120 8"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6 Q 60 -2 118 5"
                      className="stroke-[var(--color-primary)]"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      opacity="0.35"
                    />
                  </svg>
                </span>
                .
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
                {t.home.heroSub}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/reserver"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-card"
                >
                  {t.common.bookCall}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/realisations"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-card"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/10">
                    <Play className="h-3 w-3 fill-blue-600 text-blue-600" aria-hidden="true" />
                  </span>
                  {t.home.seeProjects}
                </Link>
              </div>

              {/* Stats — style NovaWave avec séparateurs */}
              {stats.length > 0 && (
                <dl className="mt-14 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
                  {stats.slice(0, 4).map((stat, i) => (
                    <div key={stat.id} className={i > 0 ? 'sm:border-l sm:border-border sm:pl-6' : ''}>
                      <dd className="text-3xl font-extrabold tabular-nums tracking-tight text-ink sm:text-4xl">
                        <CountUp value={stat.value} />
                      </dd>
                      <dt className="mt-1 text-xs font-medium text-muted">
                        {t.stats.labels[stat.label] ?? stat.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* ── Visuel droite — cartes superposées ── */}
            <div className="relative hidden lg:block" aria-hidden="true">
              {/* Couches arrière */}
              <div className="absolute -right-8 -top-10 h-full w-full rotate-6 rounded-2xl bg-gradient-to-br from-blue-200 to-indigo-200" />
              <div className="absolute -left-5 -top-4 h-full w-full -rotate-3 rounded-2xl bg-gradient-to-br from-indigo-100 to-white shadow-soft" />

              {/* Carte principale */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-9 shadow-glow">
                <div
                  className="absolute inset-0 opacity-[0.14]"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                    backgroundSize: '26px 26px',
                  }}
                />
                <p className="relative max-w-[15rem] text-3xl font-extrabold leading-tight text-white">
                  {t.home.cardTextPre}{' '}
                  <span className="text-blue-200">{t.home.cardTextHighlight}</span>
                </p>
                <div className="absolute right-8 top-8 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {t.home.cardBadge}
                </div>
                <div className="absolute bottom-8 left-8 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur transition-transform hover:scale-105">
                  <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
                </div>
              </div>

              {/* Carte flottante sombre — 01 Stratégie */}
              <div className="absolute -bottom-10 -left-12 w-60 rounded-3xl bg-ink p-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-white">01</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/25 text-blue-300">
                    <Compass className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-white">{t.home.strategy}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {t.home.strategyDesc}
                </p>
              </div>

              {/* Badge flottant clair */}
              <div className="absolute -right-4 bottom-20 flex items-center gap-3 rounded-3xl border border-border bg-white/95 p-4 shadow-soft backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Rocket className="h-5 w-5 text-white" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-ink">
                    <CountUp value={stats[0]?.value ?? t.home.cardStatValue} />
                  </p>
                  <p className="text-xs text-muted">
                    {t.stats.labels[stats[0]?.label ?? ''] ?? stats[0]?.label ?? t.home.cardStatLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ───────────────────────────────────────── */}
      <ServicesMarquee />

      {/* ─── SERVICES ──────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-24" aria-labelledby="services-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                  {t.home.servicesBadge}
                </p>
                <h2 id="services-heading" className="text-4xl font-extrabold tracking-tight text-ink">
                  {t.home.servicesTitle1}{' '}
                  <span className="text-blue-600">{t.home.servicesTitle2}</span>
                </h2>
              </div>
              <Link
                href="/services"
                className="group hidden items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors hover:text-blue-700 sm:inline-flex"
              >
                {t.home.seeAllServices}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc, i) => {
                const Icon = ICON_MAP[svc.icon ?? ''] ?? Sparkles
                const gradient = TILE_GRADIENTS[i % TILE_GRADIENTS.length]
                return (
                  <Reveal
                    key={svc.id}
                    delay={(i % 3) * 100}
                    className="group flex flex-col rounded-3xl border border-border bg-surface p-7 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
                  >
                    <span
                      className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} p-3.5 text-white shadow-soft`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight text-ink">{svc.title}</h3>
                    {svc.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                        {svc.description}
                      </p>
                    )}
                    <Link
                      href={`/services#${svc.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors group-hover:text-blue-700"
                      aria-label={t.common.learnAbout(svc.title)}
                    >
                      {t.common.seeMore}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT ─────────────────────────────────────────── */}
      <section className="bg-surface py-24" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Texte gauche */}
            <Reveal>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                {t.home.aboutBadge}
              </p>
              <h2 id="about-heading" className="text-4xl font-extrabold tracking-tight text-ink">
                {t.home.aboutTitle1}{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                  {t.home.aboutTitle2}
                </span>
              </h2>
              <p className="mt-5 leading-relaxed text-muted">{t.home.aboutText}</p>

              {/* Cartes valeurs */}
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {t.home.values.map(({ title, desc }, idx) => {
                  const Icon = VALUE_ICONS[idx % VALUE_ICONS.length] ?? Sparkles
                  return (
                    <div
                      key={title}
                      className="flex items-start gap-3.5 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-blue-200"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-soft">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-extrabold text-ink">{title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-card"
              >
                  {t.home.contactLink}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
            </Reveal>

            {/* Visuel droite */}
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-ink p-10 shadow-soft">
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/25 blur-[80px]" aria-hidden="true" />

                <div className="relative flex aspect-[5/4] items-center justify-center">
                  {/* Ondes concentriques animées autour de la fusée */}
                  <span
                    className="rocket-wave absolute h-44 w-44 rounded-full border border-blue-400/40 bg-blue-500/15"
                    aria-hidden="true"
                  />
                  <span
                    className="rocket-wave absolute h-44 w-44 rounded-full border border-blue-400/40 bg-blue-500/15"
                    style={{ animationDelay: '0.9s' }}
                    aria-hidden="true"
                  />
                  <span
                    className="rocket-wave absolute h-44 w-44 rounded-full border border-blue-400/40 bg-blue-500/15"
                    style={{ animationDelay: '1.8s' }}
                    aria-hidden="true"
                  />
                  <div className="rocket-float relative flex h-44 w-44 items-center justify-center rounded-full bg-blue-600/15 ring-1 ring-white/10">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-glow">
                      <Rocket className="h-14 w-14 text-white" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini-stats flottantes issues de la base */}
              {stats.length > 1 && (
                <div className="absolute -bottom-6 left-8 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-card">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <Check className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold text-ink">
                      <CountUp value={stats[1]?.value ?? ''} />
                    </p>
                    <p className="text-xs text-muted">
                      {stats[1] && (t.stats.labels[stats[1].label] ?? stats[1].label)}
                    </p>
                  </div>
                </div>
              )}
              {stats.length > 2 && (
                <div className="absolute -top-6 right-8 rounded-2xl border border-border bg-white px-5 py-3 text-center shadow-card">
                  <p className="text-lg font-extrabold text-blue-600">
                    <CountUp value={stats[2]?.value ?? ''} />
                  </p>
                  <p className="text-xs text-muted">
                    {stats[2] && (t.stats.labels[stats[2].label] ?? stats[2].label)}
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── RÉALISATIONS ──────────────────────────────────── */}
      {works.length > 0 && (
        <section className="py-24" aria-labelledby="works-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-14 text-center">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                {t.home.worksBadge}
              </p>
              <h2 id="works-heading" className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-ink">
                {t.home.worksTitle1}{' '}
                <span className="text-blue-600">{t.home.worksTitle2}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted">{t.home.worksIntro}</p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {works.slice(0, 4).map((work, i) => (
                <Reveal key={work.id} delay={(i % 2) * 120}>
                  <WorkCard work={work} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 text-center">
              <Link
                href="/realisations"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-card"
              >
                {t.home.seeAllWorks}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <FaqSection />

      {/* ─── CTA FINAL ─────────────────────────────────────── */}
      <section className="pb-28 pt-4" aria-label={t.home.ctaSectionLabel}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-16 text-center shadow-glow sm:px-12">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-[80px]" aria-hidden="true" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/20 blur-[80px]" aria-hidden="true" />

            <div className="relative mx-auto max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-100 backdrop-blur">
                {t.home.ctaBadge}
              </p>
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {t.home.ctaTitle1}{' '}
                <span className="text-blue-200">{t.home.ctaTitle2}</span>
                {t.home.ctaTitle3}
              </h2>
              <p className="mt-5 text-lg text-blue-100">{t.home.ctaSub}</p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/reserver"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  {t.common.bookCall}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  {t.common.writeUs}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
