import type { SiteStat } from '@/types/database'

interface StatsBarProps {
  stats: SiteStat[]
}

export function StatsBar({ stats }: StatsBarProps) {
  if (stats.length === 0) return null

  return (
    <section className="bg-white py-14 border-b border-slate-100" aria-label="Statistiques">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-blue-600 tabular-nums">
                {stat.value}
              </span>
              <span className="mt-1 text-sm font-medium text-slate-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
