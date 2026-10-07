import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllWorks } from '@/services/works.service'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WorkRowActions } from './work-row-actions'

export const metadata: Metadata = { title: 'Réalisations' }

export default async function AdminRealisationsPage() {
  const { data: works, count } = await getAllWorks()

  return (
    <div>
      <PageHeader
        title="Réalisations"
        description={`${count} réalisation${count > 1 ? 's' : ''}`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/realisations/nouvelle">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nouvelle réalisation
            </Link>
          </Button>
        }
      />

      {works.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Aucune réalisation. <Link href="/admin/realisations/nouvelle" className="text-blue-600 hover:underline">Créer la première</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Titre</th>
                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {works.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{w.title}</td>
                  <td className="px-4 py-3 text-slate-600">{w.category ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{w.partner ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={w.is_published ? 'success' : 'secondary'}>
                      {w.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <WorkRowActions workId={w.id} isPublished={w.is_published} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
