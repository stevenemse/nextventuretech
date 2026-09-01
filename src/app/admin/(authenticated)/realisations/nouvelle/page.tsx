import type { Metadata } from 'next'
import { PageHeader } from '@/components/admin/page-header'
import { WorkForm } from '../work-form'

export const metadata: Metadata = { title: 'Nouvelle réalisation' }

export default function NouvelleRealisationPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Nouvelle réalisation" backHref="/admin/realisations" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <WorkForm />
      </div>
    </div>
  )
}
