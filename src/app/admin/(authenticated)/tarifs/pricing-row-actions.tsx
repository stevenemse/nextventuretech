'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Star } from 'lucide-react'
import { togglePlanPopular, deletePricingPlanAction } from '@/app/actions/pricing'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

export function PricingRowActions({
  planId, isPopular,
}: { planId: string; isPopular: boolean; isActive: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost" size="icon"
        className={isPopular ? 'text-amber-500' : 'text-slate-400'}
        onClick={() => startTransition(() => { void togglePlanPopular(planId, !isPopular) })}
        disabled={isPending}
        aria-label={isPopular ? 'Retirer badge populaire' : 'Marquer populaire'}
        title={isPopular ? 'Retirer badge populaire' : 'Marquer populaire'}
      >
        <Star className="h-4 w-4" fill={isPopular ? 'currentColor' : 'none'} />
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Modifier">
        <Link href={`/admin/tarifs/${planId}`}><Pencil className="h-4 w-4" /></Link>
      </Button>
      <Button
        variant="ghost" size="icon" className="text-red-500 hover:text-red-700"
        onClick={() => setShowDelete(true)} disabled={isPending} aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={showDelete} onOpenChange={setShowDelete}
        title="Supprimer le plan ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={() => startTransition(async () => { await deletePricingPlanAction(planId); setShowDelete(false) })}
        loading={isPending}
      />
    </div>
  )
}
