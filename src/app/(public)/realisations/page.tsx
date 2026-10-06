import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPublishedWorks } from '@/services/works.service'
import { WorkCard } from '@/components/public/work-card'

export const metadata: Metadata = {
  title: 'Réalisations',
  description: 'Découvrez nos projets réalisés pour nos clients à travers le monde.',
}

export default async function RealisationsPage() {
  const works = await getPublishedWorks()

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
            — Nos derniers projets
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Explorez notre <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">showcase</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Des projets concrets pour des clients réels. Chaque réalisation raconte une histoire.
          </p>
        </div>
      </section>

      {/* Grille portfolio */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {works.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface py-20 text-center shadow-soft">
              <p className="mb-4 text-lg font-bold text-ink">Nos réalisations arrivent bientôt.</p>
              <Link href="/contact" className="font-semibold text-blue-600 hover:underline">
                Contactez-nous pour en savoir plus
              </Link>
            </div>
          ) : (
            <div className="reveal grid gap-6 sm:grid-cols-2">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
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
                Votre projet sera <span className="text-blue-200">le prochain</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-blue-100">
                Rejoignez nos clients satisfaits — parlons de votre idée dès aujourd&apos;hui.
              </p>
              <Link
                href="/reserver"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Démarrer votre projet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
