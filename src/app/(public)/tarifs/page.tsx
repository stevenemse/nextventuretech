import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getPricingPlansByService } from '@/services/pricing.service'
import { PricingCard } from '@/components/public/pricing-card'
import { Reveal } from '@/components/public/reveal'
import { getT } from '@/lib/i18n/server'
import { localizeService } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: t.nav.links.pricing,
    description: t.tarifs.metaDescription,
  }
}

export default async function TarifsPage() {
  const { lang, t } = await getT()
  const services = await getPublishedServices()

  const servicesWithPlans = await Promise.all(
    services.map(async (svc) => ({
      service: localizeService(svc, t),
      plans: await getPricingPlansByService(svc.id),
    })),
  )

  const filtered = servicesWithPlans.filter((s) => s.plans.length > 0)

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
            {t.tarifs.badge}
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            {t.tarifs.title1}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">{t.tarifs.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            {t.tarifs.sub}
          </p>
        </div>
      </section>

      {/* Plans par service */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-border bg-surface py-20 text-center shadow-soft">
              <p className="text-lg font-bold text-ink">{t.tarifs.empty}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-24">
              {filtered.map(({ service, plans }) => (
                <div key={service.id} id={service.slug} className="scroll-mt-28">
                  <Reveal>
                  <div className="mb-10 text-center">
                    <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
                      {service.title}
                    </p>
                    <h2 className="text-4xl font-extrabold tracking-tight text-ink">
                      {t.tarifs.choosePlan}
                    </h2>
                  </div>
                  <div className={`grid gap-8 ${
                    plans.length === 1 ? 'mx-auto max-w-sm' :
                    plans.length === 2 ? 'mx-auto max-w-3xl sm:grid-cols-2' :
                    'lg:grid-cols-3'
                  }`}>
                    {plans.map((plan, pi) => (
                      <Reveal key={plan.id} delay={pi * 120}>
                        <PricingCard plan={plan} serviceTitle={service.title} lang={lang} />
                      </Reveal>
                    ))}
                  </div>                  </Reveal>
                </div>
              ))}
            </div>
          )}
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
                {t.tarifs.ctaTitle1}{' '}
                <span className="text-blue-200">{t.tarifs.ctaTitle2}</span>
                {t.tarifs.ctaTitle3}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-blue-100">
                {t.tarifs.ctaSub}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  {t.common.requestQuote}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/reserver"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  {t.common.bookCallShort}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
