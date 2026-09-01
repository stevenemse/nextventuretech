import type { Metadata } from 'next'
import { getSiteSettings, getAllStats } from '@/services/settings.service'
import { PageHeader } from '@/components/admin/page-header'
import { SettingsForm } from './settings-form'
import { StatsManager } from './stats-manager'

export const metadata: Metadata = { title: 'Paramètres' }

export default async function AdminParametresPage() {
  const [settings, stats] = await Promise.all([getSiteSettings(), getAllStats()])

  return (
    <div className="max-w-2xl">
      <PageHeader title="Paramètres du site" />

      <div className="flex flex-col gap-8">
        {/* Settings du site */}
        <section>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <SettingsForm settings={settings ?? undefined} />
          </div>
        </section>

        {/* Statistiques */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Statistiques affichées</h2>
          <StatsManager stats={stats} />
        </section>
      </div>
    </div>
  )
}
