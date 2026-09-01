import type { Metadata } from 'next'
import { PageHeader } from '@/components/admin/page-header'
import { ServiceForm } from '../service-form'

export const metadata: Metadata = { title: 'Nouveau service' }

export default function NouveauServicePage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Nouveau service" backHref="/admin/services" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ServiceForm />
      </div>
    </div>
  )
}
