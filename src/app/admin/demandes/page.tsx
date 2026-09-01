import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllWorkRequests } from '@/services/requests.service'
import { PageHeader } from '@/components/admin/page-header'
import { StatusBadge } from '@/components/admin/status-badge'
import { StatusSelect } from './status-select'
import { formatDateTime } from '@/lib/utils/format'
import type { WorkRequestStatus } from '@/types/database'

export const metadata: Metadata = { title: 'Demandes' }

interface Props {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>
}

const PAGE_SIZE = 20

export default async function DemandesPage({ searchParams }: Props) {
  const params = await searchParams
  const status = (params.status ?? 'all') as WorkRequestStatus | 'all'
  const page = Math.max(1, Number(params.page ?? 1))
  const search = params.q ?? ''

  const { data: requests, count } = await getAllWorkRequests({ page, pageSize: PAGE_SIZE, status, search })
  const totalPages = Math.ceil(count / PAGE_SIZE)

  return (
    <div>
      <PageHeader
        title="Demandes"
        description={`${count} demande${count > 1 ? 's' : ''} au total`}
      />

      {/* Filtres */}
      <form method="GET" className="mb-4 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Rechercher (nom, email, société…)"
          className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="accepted">Accepté</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="refused">Refusé</option>
        </select>
        <button
          type="submit"
          className="h-9 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          Filtrer
        </button>
      </form>

      {/* Tableau */}
      {requests.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Aucune demande trouvée.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Contact</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Budget</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{req.name}</div>
                    <div className="text-slate-500">{req.email}</div>
                    {req.company && (
                      <div className="text-xs text-slate-400">{req.company}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.services?.title ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {req.budget ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {formatDateTime(req.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <StatusSelect requestId={req.id} currentStatus={req.status} />
                      <Link
                        href={`/admin/demandes/${req.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Détail
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} sur {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?status=${status}&q=${search}&page=${page - 1}`}
                className="rounded border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
              >
                ← Précédent
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?status=${status}&q=${search}&page=${page + 1}`}
                className="rounded border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
              >
                Suivant →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
