import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWorkById } from '@/services/works.service'
import { PageHeader } from '@/components/admin/page-header'
import { WorkForm } from '../work-form'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const w = await getWorkById(id)
  return { title: w ? `Modifier — ${w.title}` : 'Réalisation introuvable' }
}

export default async function EditWorkPage({ params }: Props) {
  const { id } = await params
  const work = await getWorkById(id)
  if (!work) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title={`Modifier — ${work.title}`} backHref="/admin/realisations" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <WorkForm work={work} />
      </div>
    </div>
  )
}
