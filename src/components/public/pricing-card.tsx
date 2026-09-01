import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import type { PricingPlan } from '@/types/database'
import { cn } from '@/lib/utils/cn'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-7 transition-shadow',
        plan.is_popular
          ? 'border-blue-600 bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-600/30 scale-[1.02]'
          : 'border-slate-200 bg-white text-slate-900 hover:shadow-lg',
      )}
    >
      {/* Badge Populaire */}
      {plan.is_popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-md">
            <Zap className="h-3 w-3 fill-blue-600" aria-hidden="true" />
            Populaire
          </span>
        </div>
      )}

      {/* En-tête */}
      <div className="mb-6">
        <h3 className={cn('text-lg font-bold', plan.is_popular ? 'text-white' : 'text-slate-900')}>
          {plan.name}
        </h3>
        {plan.description && (
          <p className={cn('mt-1 text-sm', plan.is_popular ? 'text-blue-100' : 'text-slate-500')}>
            {plan.description}
          </p>
        )}
      </div>

      {/* Prix */}
      <div className="mb-6">
        {plan.is_custom_quote ? (
          <p className={cn('text-2xl font-extrabold', plan.is_popular ? 'text-white' : 'text-blue-600')}>
            Sur devis
          </p>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className={cn('text-3xl font-extrabold tabular-nums', plan.is_popular ? 'text-white' : 'text-slate-900')}>
              {plan.price?.toLocaleString('fr-FR')}
            </span>
            <span className={cn('text-sm font-medium', plan.is_popular ? 'text-blue-200' : 'text-slate-500')}>
              {plan.currency}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {plan.features.length > 0 && (
        <ul className="mb-8 flex flex-col gap-2.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check
                className={cn('mt-0.5 h-4 w-4 shrink-0', plan.is_popular ? 'text-white' : 'text-blue-600')}
                aria-hidden="true"
              />
              <span className={plan.is_popular ? 'text-blue-50' : 'text-slate-700'}>{f}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <div className="mt-auto">
        <Link
          href={plan.is_custom_quote ? '/contact' : '/reserver'}
          className={cn(
            'flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-colors',
            plan.is_popular
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          {plan.is_custom_quote ? 'Demander un devis' : 'Commencer'}
        </Link>
      </div>
    </div>
  )
}
