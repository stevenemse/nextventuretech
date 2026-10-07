import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllServices } from '@/services/services.service'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServiceRowActions } from './service-row-actions'

export const metadata: Metadata = { title: 'Services' }

export default async function AdminServicesPage() {
  const services = await getAllServices()

  return (
    <div>
      <PageHeader
        title="Services"
        description={`${services.length} service${services.length > 1 ? 's' : ''}`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/services/nouveau">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nouveau service
            </Link>
          </Button>
        }
      />

      {services.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Aucun service. <Link href="/admin/services/nouveau" className="text-blue-600 hover:underline">Créer le premier</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Ordre</th>
                <th className="px-4 py-3 text-left font-medium">Titre</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 text-center w-12">{svc.display_order}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{svc.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{svc.slug}</td>
                  <td className="px-4 py-3">
                    <Badge variant={svc.is_published ? 'success' : 'secondary'}>
                      {svc.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ServiceRowActions serviceId={svc.id} isPublished={svc.is_published} />
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
