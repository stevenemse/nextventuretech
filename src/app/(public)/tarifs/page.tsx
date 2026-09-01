import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getPricingPlansByService } from '@/services/pricing.service'
import { PricingCard } from '@/components/public/pricing-card'

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Consultez nos plans tarifaires transparents pour chaque service.',
}

export default async function TarifsPage() {
  const services = await getPublishedServices()

  const servicesWithPlans = await Promise.all(
    services.map(async (svc) => ({
      service: svc,
      plans: await getPricingPlansByService(svc.id),
    })),
  )

  const filtered = servicesWithPlans.filter((s) => s.plans.length > 0)

  return (
    <>
      <section className="bg-[#0a0f1e] pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3"><span aria-hidden="true">&#47;&#47;</span> Tarification</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Prix <span className="text-blue-400">transparents</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Des plans clairs pour chaque budget. Pas de frais cachés, pas de surprises.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-20">Les tarifs arrivent bientôt.</p>
          ) : (
            <div className="flex flex-col gap-20">
              {filtered.map(({ service, plans }) => (
                <div key={service.id} id={service.slug}>
                  <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2">
                      {service.title}
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">Choisissez votre formule</h2>
                  </div>
                  <div className={`grid gap-8 ${
                    plans.length === 1 ? 'max-w-sm mx-auto' :
                    plans.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' :
                    'sm:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {plans.map((plan) => (
                      <PricingCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Besoin d&apos;un devis personnalisé ?</h2>
          <p className="text-slate-500 mb-6">Décrivez votre projet et nous vous répondrons sous 24h.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
              Demander un devis <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/reserver" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              Réserver un appel
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
