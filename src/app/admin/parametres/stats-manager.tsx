'use client'

import { useActionState, useState, useTransition } from 'react'
import { createStatAction, deleteStatAction } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { initialActionState } from '@/types/actions'
import { Plus, Trash2 } from 'lucide-react'
import type { SiteStat } from '@/types/database'
import type { ActionResult } from '@/types/actions'

interface Props { stats: SiteStat[] }

export function StatsManager({ stats }: Props) {
  const [state, formAction, pending] = useActionState<ActionResult<SiteStat>, FormData>(
    createStatAction, initialActionState,
  )
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [delPending, startDelTransition] = useTransition()

  return (
    <div className="flex flex-col gap-6">
      {/* Liste existante */}
      <div className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {stats.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Aucune statistique.</p>
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-bold text-blue-600">{stat.value}</span>
                <span className="text-sm text-slate-600">{stat.label}</span>
                {!stat.is_active && <span className="text-xs text-slate-400">(inactif)</span>}
              </div>
              <Button
                variant="ghost" size="icon" className="text-red-500 hover:text-red-700"
                onClick={() => setDeleteTarget(stat.id)} aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form action={formAction} className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-medium text-slate-700">Ajouter une statistique</p>
        {state.status === 'error' && state.message && (
          <Alert variant="error" className="mb-3"><AlertDescription>{state.message}</AlertDescription></Alert>
        )}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="stat-value" required>Valeur</Label>
            <Input id="stat-value" name="value" placeholder="50+" className="w-28" required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="stat-label" required>Libellé</Label>
            <Input id="stat-label" name="label" placeholder="Projets réalisés" className="w-48" required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="stat-order">Ordre</Label>
            <Input id="stat-order" name="display_order" type="number" min="0" defaultValue="0" className="w-20" />
          </div>
          <div className="flex items-end">
            <Button type="submit" loading={pending} size="sm">
              <Plus className="h-4 w-4" /> Ajouter
            </Button>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Supprimer la statistique ?"
        description="Cette statistique sera retirée du site."
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (!deleteTarget) return
          startDelTransition(async () => {
            await deleteStatAction(deleteTarget)
            setDeleteTarget(null)
          })
        }}
        loading={delPending}
      />
    </div>
  )
}
