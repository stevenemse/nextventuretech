import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, Globe, Palette, BrainCircuit, Clapperboard, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Découvrez nos services : Web Design, Graphic Design, Intelligence Artificielle, Montage Vidéo et Motion Design.',
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

export default async function ServicesPage() {
  const services = await getPublishedServices()

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
            — Nos services
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Des solutions <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">sur mesure</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            De la conception à la livraison, nous transformons vos idées en produits digitaux
            qui font la différence.
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
                  className={`reveal flex flex-col items-center gap-14 md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Visuel */}
                  <div className="w-full flex-1">
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${VISUAL_GRADIENTS[i % VISUAL_GRADIENTS.length]} p-8 shadow-glow`}
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
                      Service {String(i + 1).padStart(2, '0')}
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
                        Voir les tarifs
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-ink shadow-soft transition-all hover:-translate-y-0.5 hover:border-blue-200"
                      >
                        Nous contacter
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-16 text-center shadow-glow">
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
                Vous avez un <span className="text-blue-200">projet</span> en tête ?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-blue-100">
                Réservez un appel gratuit et parlons-en. Réponse sous 24h.
              </p>
              <Link
                href="/reserver"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Réserver un appel gratuit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
