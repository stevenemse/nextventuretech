import type { Metadata } from 'next'
import { getAllServices } from '@/services/services.service'
import { PageHeader } from '@/components/admin/page-header'
import { PricingForm } from '../pricing-form'

export const metadata: Metadata = { title: 'Nouveau plan tarifaire' }

export default async function NouveauTarifPage() {
  const services = await getAllServices()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Nouveau plan tarifaire" backHref="/admin/tarifs" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <PricingForm services={services} />
      </div>
    </div>
  )
}
