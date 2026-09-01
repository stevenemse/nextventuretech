import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPricingPlanById } from '@/services/pricing.service'
import { getAllServices } from '@/services/services.service'
import { PageHeader } from '@/components/admin/page-header'
import { PricingForm } from '../pricing-form'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const plan = await getPricingPlanById(id)
  return { title: plan ? `Modifier — ${plan.name}` : 'Plan introuvable' }
}

export default async function EditPricingPage({ params }: Props) {
  const { id } = await params
  const [plan, services] = await Promise.all([getPricingPlanById(id), getAllServices()])
  if (!plan) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Modifier — ${plan.name}`} backHref="/admin/tarifs" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <PricingForm plan={plan} services={services} />
      </div>
    </div>
  )
}
