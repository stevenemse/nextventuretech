import Link from 'next/link'
import { Check, MessageCircle, Zap } from 'lucide-react'
import type { PricingPlan } from '@/types/database'
import { cn } from '@/lib/utils/cn'
import { siteConfig } from '@/config/site'

interface PricingCardProps {
  plan: PricingPlan
  /** Titre du service auquel ce plan est rattaché (pour le préremplissage). */
  serviceTitle?: string
}

/**
 * Message WhatsApp prérempli pour ce plan tarifaire.
 * Forme : "Bonjour, je suis interessé(e) par votre offre X (Y, prix Z)..."
 */
export function buildPlanWhatsAppUrl(plan: PricingPlan, serviceTitle?: string): string {
  const number = siteConfig.whatsapp.replace(/\D/g, '')
  const price = plan.is_custom_quote
    ? 'sur devis'
    : `${plan.price?.toLocaleString('fr-FR')} ${plan.currency}`
  const servicePart = serviceTitle ? ` pour ${serviceTitle}` : ''
  const message = `Bonjour NextVenture Tech ! Je suis interessé(e) par votre offre "${plan.name}"${servicePart} (${price}). Pouvez-vous me donner plus de details ?`
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function PricingCard({ plan, serviceTitle }: PricingCardProps) {
  const contactHref = `/contact?service=${encodeURIComponent(serviceTitle ?? '')}&plan=${encodeURIComponent(plan.name)}`
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border p-8 transition-all duration-300',
        plan.is_popular
          ? 'border-blue-600 bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-glow lg:scale-[1.03]'
          : 'border-border bg-surface text-slate-900 shadow-soft hover:-translate-y-1 hover:shadow-card',
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

      {/* CTA — suite logique : formulaire contact prérempli ou WhatsApp direct */}
      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={contactHref}
          className={cn(
            'flex w-full items-center justify-center rounded-full py-3 text-sm font-bold transition-colors',
            plan.is_popular
              ? 'bg-white text-blue-600 hover:bg-blue-50'
              : 'bg-blue-600 text-white hover:bg-blue-700',
          )}
        >
          {plan.is_custom_quote ? 'Demander un devis' : 'Commencer avec cette formule'}
        </Link>
        <a
          href={buildPlanWhatsAppUrl(plan, serviceTitle)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-bold transition-colors',
            plan.is_popular
              ? 'border-white/40 text-white hover:bg-white/10'
              : 'border-border bg-white text-slate-700 hover:border-green-300 hover:text-green-700',
          )}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Discuter sur WhatsApp
        </a>
      </div>
    </div>
  )
}
