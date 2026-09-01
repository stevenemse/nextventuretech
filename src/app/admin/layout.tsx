import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth/guards'
import { countPendingRequests } from '@/services/requests.service'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata: Metadata = {
  title: { default: 'Dashboard Admin', template: '%s | Admin — NextVenture Tech' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Double protection côté layout (le proxy gère le redirect,
  // mais on vérifie aussi le rôle ici)
  await requireAdmin()
  const pendingCount = await countPendingRequests()

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar pendingCount={pendingCount} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
