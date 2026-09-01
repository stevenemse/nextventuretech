import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllPricingPlans } from '@/services/pricing.service'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'
import { PricingRowActions } from './pricing-row-actions'

export const metadata: Metadata = { title: 'Tarifs' }

export default async function AdminTarifsPage() {
  const plans = await getAllPricingPlans()

  return (
    <div>
      <PageHeader
        title="Tarifs"
        description={`${plans.length} plan${plans.length > 1 ? 's' : ''}`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/tarifs/nouveau">
              <Plus className="h-4 w-4" aria-hidden="true" /> Nouveau plan
            </Link>
          </Button>
        }
      />

      {plans.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Aucun plan. <Link href="/admin/tarifs/nouveau" className="text-blue-600 hover:underline">Créer le premier</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Plan</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Prix</th>
                <th className="px-4 py-3 text-left font-medium">Populaire</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{plan.name}</td>
                  <td className="px-4 py-3 text-slate-600">{plan.services?.title ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {formatPrice(plan.price, plan.currency, plan.is_custom_quote)}
                  </td>
                  <td className="px-4 py-3">
                    {plan.is_popular && <Badge variant="popular">⭐ Populaire</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={plan.is_active ? 'success' : 'secondary'}>
                      {plan.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <PricingRowActions planId={plan.id} isPopular={plan.is_popular} isActive={plan.is_active} />
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
