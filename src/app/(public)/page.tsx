import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getPublishedWorks } from '@/services/works.service'
import { getActiveStats } from '@/services/settings.service'
import { StatsBar } from '@/components/public/stats-bar'
import { ServicesMarquee } from '@/components/public/services-marquee'
import { ServiceCard } from '@/components/public/service-card'
import { WorkCard } from '@/components/public/work-card'
import { FaqSection } from '@/components/public/faq-section'
import { siteConfig } from '@/config/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.slogan}`,
  description: siteConfig.description,
}

const TRUST_POINTS = [
  'Livraison dans les délais convenus',
  'Support réactif et disponible',
  'Technologies modernes et évolutives',
  'Prix transparents sans surprises',
]

export default async function HomePage() {
  const [services, works, stats] = await Promise.all([
    getPublishedServices(),
    getPublishedWorks(),
    getActiveStats(),
  ])

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen bg-[#0a0f1e] flex items-center overflow-hidden pt-16"
        aria-label="Hero"
      >
        {/* Décorations de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-blue-800/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          {/* Grille */}
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Texte */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-1.5 text-sm text-blue-400 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                Agence Digitale — Douala, Cameroun
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Transformer vos{' '}
                <span className="text-blue-400">idées</span>{' '}
                en{' '}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  réalité
                </span>
              </h1>

              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg">
                NextVenture Tech conçoit des sites web, des identités visuelles et des solutions IA
                pour propulser votre activité au niveau supérieur.
              </p>

              <ul className="mt-6 flex flex-col gap-2" aria-label="Avantages">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/reserver"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Réserver un Appel
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/realisations"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Voir nos réalisations
                </Link>
              </div>
            </div>

            {/* Carte flottante */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Card principale */}
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 w-80">
                  <p className="text-xs text-slate-400 mb-4 uppercase tracking-wide">Nos services</p>
                  <div className="flex flex-col gap-3">
                    {['🌐 Web Design', '🎨 Graphic Design', '🤖 Intelligence Artificielle', '🎬 Montage Vidéo', '✨ Motion Design'].map((s) => (
                      <div key={s} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-sm text-white">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Badge flottant */}
                <div className="absolute -top-4 -right-4 rounded-xl bg-blue-600 px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold text-white">50+ Projets</p>
                </div>
                <div className="absolute -bottom-4 -left-4 rounded-xl bg-green-500 px-4 py-2 shadow-lg">
                  <p className="text-xs font-bold text-white flex items-center gap-1">
                    <Phone className="h-3 w-3" aria-hidden="true" /> Disponible 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ───────────────────────────────────────────── */}
      <ServicesMarquee />

      {/* ─── STATS ─────────────────────────────────────────────── */}
      <StatsBar stats={stats} />

      {/* ─── SERVICES ALTERNÉS ──────────────────────────────────── */}
      {services.length > 0 && (
        <section className="py-20 bg-white" aria-labelledby="services-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2"><span aria-hidden="true">&#47;&#47;</span> Nos Services</p>
              <h2 id="services-heading" className="text-3xl font-extrabold text-slate-900">
                Ce que nous <span className="text-blue-600">faisons</span>
              </h2>
            </div>
            <div className="flex flex-col gap-20">
              {services.slice(0, 4).map((svc, i) => (
                <ServiceCard key={svc.id} service={svc} variant="alternate" index={i} />
              ))}
            </div>
            {services.length > 4 && (
              <div className="mt-12 text-center">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Voir tous les services <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── RÉALISATIONS ──────────────────────────────────────── */}
      {works.length > 0 && (
        <section className="py-20 bg-slate-50" aria-labelledby="works-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2"><span aria-hidden="true">&#47;&#47;</span> Nos Derniers Projets</p>
              <h2 id="works-heading" className="text-3xl font-extrabold text-slate-900">
                Explorez notre <span className="text-blue-600">Showcase</span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {works.slice(0, 4).map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/realisations"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Voir tous les projets <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQ ───────────────────────────────────────────────── */}
      <FaqSection />

      {/* ─── CTA FINAL ────────────────────────────────────────── */}
      <section className="bg-[#0a0f1e] py-20" aria-label="Appel à l'action">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Prêt à lancer votre <span className="text-blue-400">projet</span> ?
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Réservez un appel gratuit de 30 minutes et discutons de vos besoins.
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
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
