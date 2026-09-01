import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getServiceById } from '@/services/services.service'
import { PageHeader } from '@/components/admin/page-header'
import { ServiceForm } from '../service-form'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const svc = await getServiceById(id)
  return { title: svc ? `Modifier — ${svc.title}` : 'Service introuvable' }
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params
  const service = await getServiceById(id)
  if (!service) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Modifier — ${service.title}`} backHref="/admin/services" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <ServiceForm service={service} />
      </div>
    </div>
  )
}
