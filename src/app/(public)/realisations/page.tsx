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
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3"><span aria-hidden="true">&#47;&#47;</span> Nos Derniers Projets</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Explorez notre <span className="text-blue-400">Showcase</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Des projets concrets pour des clients réels. Chaque réalisation raconte une histoire.
          </p>
        </div>
      </section>

      {/* Grid portfolio */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {works.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <p className="text-lg mb-4">Nos réalisations arrivent bientôt.</p>
              <Link href="/contact" className="text-blue-600 hover:underline">Contactez-nous pour en savoir plus</Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {works.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0f1e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Votre projet sera le prochain</h2>
          <Link
            href="/reserver"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Démarrer votre projet <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
