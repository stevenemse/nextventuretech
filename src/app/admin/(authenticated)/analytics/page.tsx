import type { Metadata } from 'next'
import Link from 'next/link'
import { Eye, Users, TrendingUp, Smartphone, AlertTriangle } from 'lucide-react'
import { getAnalytics } from '@/services/analytics.service'
import { PageHeader } from '@/components/admin/page-header'
import { TrafficChart } from './traffic-chart'
import { cn } from '@/lib/utils/cn'

export const metadata: Metadata = { title: 'Trafic' }

const PERIODS = [7, 30, 90] as const
type Period = (typeof PERIODS)[number]

interface Props {
  searchParams: Promise<{ periode?: string }>
}

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Eye
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function Ranking({
  title,
  items,
  emptyLabel,
}: {
  title: string
  items: { label: string; views: number }[]
  emptyLabel: string
}) {
  const max = Math.max(1, ...items.map((i) => i.views))
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.label}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-slate-700">{item.label}</span>
                <span className="shrink-0 tabular-nums text-xs text-slate-500">
                  {item.views.toLocaleString('fr-FR')}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.round((item.views / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const params = await searchParams
  const requested = Number(params.periode)
  const period: Period = PERIODS.includes(requested as Period)
    ? (requested as Period)
    : 7

  const analytics = await getAnalytics(period)

  return (
    <div>
      <PageHeader
        title="Trafic"
        description="Mesure first-party, sans cookie ni service tiers."
        action={
          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/admin/analytics?periode=${p}`}
                aria-current={p === period ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  p === period
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {p} j
              </Link>
            ))}
          </div>
        }
      />

      {analytics.missingTable && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            La table <code className="font-mono">page_views</code> n&apos;existe pas encore.
            Exécutez <code className="font-mono">supabase/migrations/006_analytics.sql</code>{' '}
            dans le SQL Editor Supabase pour activer la mesure.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Eye}
          label="Pages vues"
          value={analytics.views.toLocaleString('fr-FR')}
          hint={`sur ${period} jours`}
        />
        <KpiCard
          icon={Users}
          label="Visiteurs uniques"
          value={analytics.visitors.toLocaleString('fr-FR')}
          hint="empreintes anonymes distinctes"
        />
        <KpiCard
          icon={TrendingUp}
          label="Aujourd'hui"
          value={analytics.today.toLocaleString('fr-FR')}
          hint={`${analytics.todayVisitors} visiteur${analytics.todayVisitors > 1 ? 's' : ''}`}
        />
        <KpiCard
          icon={Smartphone}
          label="Part mobile"
          value={`${analytics.mobileShare} %`}
          hint="des pages vues"
        />
      </div>

      {analytics.views === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-medium text-slate-700">Aucune visite enregistrée sur cette période.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            La mesure démarre dès qu&apos;un visiteur ouvre une page publique. Vos propres
            visites depuis le dashboard ne sont pas comptées.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <TrafficChart data={analytics.daily} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Ranking
                title="Pages les plus vues"
                items={analytics.topPages}
                emptyLabel="Aucune page mesurée."
              />
            </div>
            <div className="flex flex-col gap-5">
              <Ranking
                title="Sources de trafic"
                items={analytics.referrers}
                emptyLabel="Aucune source mesurée."
              />
              <Ranking
                title="Appareils"
                items={analytics.devices}
                emptyLabel="Aucun appareil mesuré."
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
