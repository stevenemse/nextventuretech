import { requireAdmin } from '@/lib/auth/guards'
import { countPendingRequests } from '@/services/requests.service'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

/**
 * Layout des routes admin protégées.
 * requireAdmin() redirige vers /admin/login si non connecté.
 * Ce layout N'englobe PAS /admin/login → pas de boucle de redirection.
 */
export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()
  const pendingCount = await countPendingRequests()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AdminSidebar pendingCount={pendingCount} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 pt-16 sm:p-6 sm:pt-6 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
