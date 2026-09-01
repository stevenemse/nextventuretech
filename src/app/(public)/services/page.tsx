import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Découvrez nos services : Web Design, Graphic Design, Intelligence Artificielle, Montage Vidéo et Motion Design.',
}

const ICON_MAP: Record<string, string> = {
  Globe: '🌐', Palette: '🎨', Brain: '🤖', Video: '🎬', Sparkles: '✨',
}

export default async function ServicesPage() {
  const services = await getPublishedServices()

  return (
    <>
      <section className="bg-[#0a0f1e] pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3"><span aria-hidden="true">&#47;&#47;</span> Nos Services</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Des solutions <span className="text-blue-400">sur mesure</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            De la conception à la livraison, nous transformons vos idées en produits digitaux
            qui font la différence.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-24">
            {services.map((svc, i) => {
              const icon = ICON_MAP[svc.icon ?? ''] ?? '⚡'
              const isEven = i % 2 === 0

              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className={`flex flex-col gap-12 items-center md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 aspect-video flex items-center justify-center">
                      <span className="text-9xl" aria-hidden="true">{icon}</span>
                      <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-blue-400/20" />
                      <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
                      {icon} Service {String(i + 1).padStart(2, '0')}
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{svc.title}</h2>
                    {svc.description && (
                      <p className="text-slate-600 mb-6 leading-relaxed">{svc.description}</p>
                    )}
                    {svc.key_points.length > 0 && (
                      <ul className="flex flex-col gap-2.5 mb-8">
                        {svc.key_points.map((point) => (
                          <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                            <Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-3">
                      <Link
                        href={`/tarifs#${svc.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        Voir les tarifs <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Vous avez un projet en tête ?</h2>
          <p className="text-slate-500 mb-6">Réservez un appel gratuit et parlons-en.</p>
          <Link
            href="/reserver"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Réserver un Appel Gratuit <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
