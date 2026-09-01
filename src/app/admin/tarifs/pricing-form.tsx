'use client'

import { useActionState, useState } from 'react'
import { createPricingPlanAction, updatePricingPlanAction } from '@/app/actions/pricing'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { initialActionState } from '@/types/actions'
import { Plus, X } from 'lucide-react'
import type { PricingPlan, Service } from '@/types/database'
import type { ActionResult } from '@/types/actions'

interface Props {
  plan?: PricingPlan
  services: Pick<Service, 'id' | 'title'>[]
}

export function PricingForm({ plan, services }: Props) {
  const isEdit = !!plan
  const action = isEdit
    ? updatePricingPlanAction.bind(null, plan.id)
    : createPricingPlanAction

  const [state, formAction, pending] = useActionState<ActionResult<PricingPlan>, FormData>(
    action, initialActionState,
  )

  const [features, setFeatures] = useState<string[]>(plan?.features ?? [''])
  const [isCustomQuote, setIsCustomQuote] = useState(plan?.is_custom_quote ?? false)
  const [isPopular, setIsPopular] = useState(plan?.is_popular ?? false)
  const [isActive, setIsActive] = useState(plan?.is_active ?? true)

  const fe = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}
      {state.status === 'success' && (
        <Alert variant="success"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="service_id" required>Service associé</Label>
        <select
          id="service_id" name="service_id"
          defaultValue={plan?.service_id ?? ''}
          required
          className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">— Choisir un service —</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
        {fe['service_id']?.[0] && <p className="text-xs text-red-500">{fe['service_id'][0]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" required>Nom du plan</Label>
          <Input id="name" name="name" defaultValue={plan?.name} required error={fe['name']?.[0]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Devise</Label>
          <Input id="currency" name="currency" defaultValue={plan?.currency ?? 'FCFA'} className="w-28" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={plan?.description ?? ''} rows={3} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Prix {isCustomQuote && '(ignoré si sur devis)'}</Label>
        <Input
          id="price" name="price" type="number" min="0"
          defaultValue={plan?.price ?? ''}
          placeholder="Ex: 150000"
          disabled={isCustomQuote}
          className="w-48"
        />
      </div>

      {/* Fonctionnalités */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Fonctionnalités incluses</Label>
          <Button type="button" variant="ghost" size="sm" onClick={() => setFeatures((p) => [...p, ''])}>
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input
                name="features"
                value={f}
                onChange={(e) => setFeatures((p) => p.map((item, idx) => idx === i ? e.target.value : item))}
                placeholder={`Fonctionnalité ${i + 1}`}
              />
              {features.length > 1 && (
                <Button type="button" variant="ghost" size="icon"
                  onClick={() => setFeatures((p) => p.filter((_, idx) => idx !== i))}
                  aria-label="Supprimer"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Switch id="is_custom_quote" checked={isCustomQuote} onCheckedChange={setIsCustomQuote} />
          <Label htmlFor="is_custom_quote">Prix sur devis</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="is_popular" checked={isPopular} onCheckedChange={setIsPopular} />
          <Label htmlFor="is_popular">Plan populaire ⭐</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
          <Label htmlFor="is_active">Plan actif</Label>
        </div>
      </div>

      <input type="hidden" name="is_custom_quote" value={isCustomQuote ? 'true' : 'false'} />
      <input type="hidden" name="is_popular" value={isPopular ? 'true' : 'false'} />
      <input type="hidden" name="is_active" value={isActive ? 'true' : 'false'} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {isEdit ? 'Enregistrer' : 'Créer le plan'}
        </Button>
      </div>
    </form>
  )
}
