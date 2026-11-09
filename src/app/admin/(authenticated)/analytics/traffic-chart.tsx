import type { DailyPoint } from '@/services/analytics.service'

interface TrafficChartProps {
  data: DailyPoint[]
}

/**
 * Histogramme du trafic quotidien en CSS pur (aucune librairie de graphes).
 * Le titre de chaque barre expose la valeur exacte au survol et aux
 * technologies d'assistance.
 */
export function TrafficChart({ data }: TrafficChartProps) {
  if (data.length === 0) return null

  const max = Math.max(1, ...data.map((d) => d.views))
  const total = data.reduce((sum, d) => sum + d.views, 0)
  const labelEvery = Math.max(1, Math.ceil(data.length / 7))

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-900">Pages vues par jour</h2>
        <p className="text-xs text-slate-500">
          {total.toLocaleString('fr-FR')} vues · pic à {max.toLocaleString('fr-FR')}
        </p>
      </div>

      <div
        className="flex h-44 items-end gap-1.5"
        role="img"
        aria-label={`Trafic quotidien sur ${data.length} jours, de ${data[0]?.views ?? 0} à ${max} vues par jour`}
      >
        {data.map((point) => (
          <div
            key={point.day}
            className="group flex h-full flex-1 flex-col justify-end"
            title={`${point.label} — ${point.views} vues, ${point.visitors} visiteurs`}
          >
            <div
              className="w-full rounded-t-md bg-blue-500/80 transition-colors group-hover:bg-blue-600"
              style={{ height: `${Math.max(3, Math.round((point.views / max) * 100))}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        {data
          .filter((_, i) => i % labelEvery === 0 || i === data.length - 1)
          .map((point) => (
            <span key={point.day}>{point.label}</span>
          ))}
      </div>
    </section>
  )
}
