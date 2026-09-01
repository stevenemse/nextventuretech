import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getPublishedWorks } from '@/services/works.service'
import { getActiveStats } from '@/services/settings.service'
import { ServicesMarquee } from '@/components/public/services-marquee'
import { WorkCard } from '@/components/public/work-card'
import { FaqSection } from '@/components/public/faq-section'
import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.slogan}`,
  description: siteConfig.description,
}

const ICON_MAP: Record<string, string> = {
  Globe: '🌐', Palette: '🎨', Brain: '🤖', Video: '🎬', Sparkles: '✨',
}

export default async function HomePage() {
  const [services, works, stats] = await Promise.all([
    getPublishedServices(),
    getPublishedWorks(),
    getActiveStats(),
  ])

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen bg-[#0d1117] flex items-center overflow-hidden pt-16"
        aria-label="Hero"
      >
        {/* Grille de fond style design inspirant */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        {/* Halos lumineux */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-blue-900/20 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* ── Texte gauche ── */}
            <div>
              {/* Badge "Hello There!" */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-600/10 px-4 py-2 text-sm text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                Bonjour ! Bienvenue sur NextVenture Tech
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Transformer vos{' '}
                <span className="relative inline-block">
                  <span className="text-blue-400">idées</span>
                  {/* Soulignement décoratif */}
                  <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0,2 Q50,0 100,2" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="4 2" />
                  </svg>
                </span>{' '}
                en{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent">
                  réalité
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-400 max-w-lg">
                Agence digitale à Douala — nous concevons des sites web, des identités visuelles
                et des solutions IA qui propulsent votre activité.
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2" aria-label="Points forts">
                {[
                  'Sites web sur mesure',
                  'Design professionnel',
                  'Solutions IA',
                  'Support réactif',
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/reserver"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-all"
                >
                  Réserver un Appel Gratuit
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/realisations"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Voir nos projets
                  <ChevronRight className="h-4 w-4 opacity-60" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* ── Visuel droite — cartes flottantes ── */}
            <div className="hidden lg:block relative">
              {/* Carte principale */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
                {/* Badge UX/UI design flottant */}
                <div className="absolute -top-3 right-8 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                  Digital Agency
                </div>

                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-blue-400">Nos expertises</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { icon: '🌐', label: 'Web Design & Développement' },
                    { icon: '🎨', label: 'Graphic Design & Branding' },
                    { icon: '🤖', label: 'Intelligence Artificielle' },
                    { icon: '🎬', label: 'Montage Vidéo' },
                    { icon: '✨', label: 'Motion Design' },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-2.5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-lg" aria-hidden="true">{icon}</span>
                      <span className="text-sm font-medium text-slate-200">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats flottantes */}
              <div className="absolute -bottom-5 -left-5 rounded-xl border border-white/10 bg-[#0d1117]/90 backdrop-blur-sm px-5 py-3 shadow-xl">
                <p className="text-2xl font-extrabold text-white">50+</p>
                <p className="text-xs text-slate-400">Projets réalisés</p>
              </div>
              <div className="absolute -top-5 -right-5 rounded-xl border border-white/10 bg-blue-600/20 backdrop-blur-sm px-5 py-3 shadow-xl">
                <p className="text-2xl font-extrabold text-blue-300">4.8★</p>
                <p className="text-xs text-slate-400">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ───────────────────────────────────────── */}
      <ServicesMarquee />

      {/* ─── STATS ─────────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="bg-[#f7f7f3] py-14 border-b border-slate-200" aria-label="Statistiques">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center text-center">
                  <span className="text-4xl font-extrabold text-blue-600 tabular-nums">{stat.value}</span>
                  <span className="mt-1 text-sm font-medium text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICES — cartes sombres style inspirant ─────── */}
      {services.length > 0 && (
        <section className="py-20 bg-[#f7f7f3]" aria-labelledby="services-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                  — Service
                </p>
                <h2 id="services-heading" className="text-3xl font-extrabold text-slate-900">
                  Ce que nous offrons
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Voir tous les services <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Grille de cartes sombres */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((svc) => {
                const icon = ICON_MAP[svc.icon ?? ''] ?? '⚡'
                return (
                  <div
                    key={svc.id}
                    className="group flex flex-col rounded-2xl bg-[#0d1117] border border-white/10 p-6 hover:border-blue-500/50 transition-all duration-300"
                  >
                    {/* Icône */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-2xl">
                      {icon}
                    </div>
                    <h3 className="mb-2 text-base font-bold text-white">{svc.title}</h3>
                    {svc.description && (
                      <p className="mb-5 text-sm leading-relaxed text-slate-400 flex-1 line-clamp-3">
                        {svc.description}
                      </p>
                    )}
                    <Link
                      href={`/services#${svc.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors"
                    >
                      Read More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT / STATS inline ──────────────────────────── */}
      <section className="bg-[#0d1117] py-20" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Photo / visuel gauche */}
            <div className="relative flex justify-center">
              {/* Cercle décoratif */}
              <div className="relative h-72 w-72 rounded-full bg-blue-600/20 flex items-center justify-center">
                <div className="h-56 w-56 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <span className="text-7xl" aria-hidden="true">🚀</span>
                </div>
              </div>
              {/* Badge flottant */}
              <div className="absolute bottom-4 right-0 rounded-xl border border-white/10 bg-[#0d1117]/90 px-4 py-2 text-center">
                <p className="text-lg font-bold text-white">30+</p>
                <p className="text-xs text-slate-400">Clients satisfaits</p>
              </div>
            </div>

            {/* Texte droite */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
                — About us
              </p>
              <h2 id="about-heading" className="mb-4 text-3xl font-extrabold text-white">
                L&apos;histoire derrière{' '}
                <span className="text-blue-400">NextVenture Tech</span>
              </h2>
              <p className="mb-8 text-slate-400 leading-relaxed">
                NextVenture Tech est né d&apos;une mission simple — transformer les idées
                en solutions digitales impactantes. Aujourd&apos;hui, nous aidons les entreprises
                à croître grâce au design, à l&apos;innovation et à une approche centrée sur les résultats.
              </p>

              {/* Stats inline */}
              <div className="flex flex-wrap gap-8">
                {stats.slice(0, 3).map((stat) => (
                  <div key={stat.id}>
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Nous contacter <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RÉALISATIONS ──────────────────────────────────── */}
      {works.length > 0 && (
        <section className="py-20 bg-[#f7f7f3]" aria-labelledby="works-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                  — Nos Derniers Projets
                </p>
                <h2 id="works-heading" className="text-3xl font-extrabold text-slate-900">
                  Explorez notre <span className="text-blue-600">Showcase</span>
                </h2>
              </div>
              <Link
                href="/realisations"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Voir tous les projets <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {works.slice(0, 4).map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <FaqSection />

      {/* ─── CTA FINAL ─────────────────────────────────────── */}
      <section className="bg-[#0d1117] py-24 relative overflow-hidden" aria-label="Appel à l'action">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            — Démarrez maintenant
          </p>
          <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
            Prêt pour votre{' '}
            <span className="text-blue-400">prochain projet</span> ?
          </h2>
          <p className="mt-5 text-lg text-slate-400">
            Réservez un appel gratuit de 30 minutes. Pas d&apos;engagement, juste une conversation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/reserver"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              Réserver un Appel Gratuit
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
