import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getWorkRequestById } from '@/services/requests.service'
import { PageHeader } from '@/components/admin/page-header'
import { StatusBadge } from '@/components/admin/status-badge'
import { StatusSelect } from '../status-select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils/format'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const req = await getWorkRequestById(id)
  return { title: req ? `Demande — ${req.name}` : 'Demande introuvable' }
}

export default async function DemandeDetailPage({ params }: Props) {
  const { id } = await params
  const req = await getWorkRequestById(id)
  if (!req) notFound()

  const fields = [
    { label: 'Nom',        value: req.name },
    { label: 'Email',      value: req.email },
    { label: 'Téléphone',  value: req.phone },
    { label: 'Société',    value: req.company },
    { label: 'Service',    value: req.services?.title },
    { label: 'Budget',     value: req.budget },
    { label: 'Reçu le',   value: formatDateTime(req.created_at) },
    { label: 'Modifié le', value: formatDateTime(req.updated_at) },
  ]

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Demande — ${req.name}`}
        backHref="/admin/demandes"
        backLabel="← Toutes les demandes"
      />

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Informations</CardTitle>
              <div className="flex items-center gap-3">
                <StatusBadge status={req.status} />
                <StatusSelect requestId={req.id} currentStatus={req.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {fields.map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-medium text-slate-500">{label}</dt>
                  <dd className="mt-0.5 text-slate-900">{value ?? <span className="text-slate-400">—</span>}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Message</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{req.message}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
