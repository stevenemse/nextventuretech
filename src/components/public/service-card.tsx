import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import type { Service } from '@/types/database'
import { cn } from '@/lib/utils/cn'

const ICON_MAP: Record<string, string> = {
  Globe: '🌐', Palette: '🎨', Brain: '🤖', Video: '🎬', Sparkles: '✨',
}

interface ServiceCardProps {
  service: Service
  variant?: 'grid' | 'alternate'
  index?: number
}

export function ServiceCard({ service, variant = 'grid', index = 0 }: ServiceCardProps) {
  const icon = ICON_MAP[service.icon ?? ''] ?? '⚡'
  const isEven = index % 2 === 0

  if (variant === 'alternate') {
    return (
      <div className={cn(
        'flex flex-col gap-10 items-center md:flex-row',
        !isEven && 'md:flex-row-reverse',
      )}>
        {/* Visuel */}
        <div className="flex-1 w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 aspect-video flex items-center justify-center">
            <span className="text-8xl" aria-hidden="true">{icon}</span>
            {/* Décorations */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-blue-400/20" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-4">
            <span aria-hidden="true">{icon}</span>
            Service {String(index + 1).padStart(2, '0')}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
          {service.description && (
            <p className="text-slate-600 mb-5 leading-relaxed">{service.description}</p>
          )}
          {service.key_points.length > 0 && (
            <ul className="flex flex-col gap-2 mb-6">
              {service.key_points.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/tarifs#${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Voir les tarifs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{service.title}</h3>
      {service.description && (
        <p className="mb-4 text-sm text-slate-600 flex-1 leading-relaxed line-clamp-3">{service.description}</p>
      )}
      <Link
        href={`/services#${service.slug}`}
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        En savoir plus <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
