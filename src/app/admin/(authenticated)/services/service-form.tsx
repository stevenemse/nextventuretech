'use client'

import { useActionState, useState } from 'react'
import { createServiceAction, updateServiceAction } from '@/app/actions/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { slugify } from '@/lib/utils/slugify'
import { initialActionState } from '@/types/actions'
import type { Service } from '@/types/database'
import type { ActionResult } from '@/types/actions'
import { Plus, X } from 'lucide-react'

interface ServiceFormProps {
  service?: Service
}

export function ServiceForm({ service }: ServiceFormProps) {
  const isEdit = !!service

  const action = isEdit
    ? updateServiceAction.bind(null, service.id)
    : createServiceAction

  const [state, formAction, pending] = useActionState<ActionResult<Service>, FormData>(
    action,
    initialActionState,
  )

  const [slug, setSlug] = useState(service?.slug ?? '')
  const [keyPoints, setKeyPoints] = useState<string[]>(
    service?.key_points ?? [''],
  )
  const [isPublished, setIsPublished] = useState(service?.is_published ?? false)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  function addKeyPoint() { setKeyPoints((p) => [...p, '']) }
  function removeKeyPoint(i: number) {
    setKeyPoints((p) => p.filter((_, idx) => idx !== i))
  }
  function updateKeyPoint(i: number, v: string) {
    setKeyPoints((p) => p.map((item, idx) => (idx === i ? v : item)))
  }

  const fieldErrors = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}
      {state.status === 'success' && (
        <Alert variant="success"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>Titre</Label>
          <Input id="title" name="title" defaultValue={service?.title} onChange={handleTitleChange} required error={fieldErrors['title']?.[0]} />
          {fieldErrors['title']?.[0] && <p className="text-xs text-red-500">{fieldErrors['title'][0]}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug" required>Slug</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required error={fieldErrors['slug']?.[0]} />
          {fieldErrors['slug']?.[0] && <p className="text-xs text-red-500">{fieldErrors['slug'][0]}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={service?.description ?? ''} rows={4} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Points clés</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addKeyPoint}>
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {keyPoints.map((point, i) => (
            <div key={i} className="flex gap-2">
              <Input
                name="key_points"
                value={point}
                onChange={(e) => updateKeyPoint(i, e.target.value)}
                placeholder={`Point clé ${i + 1}`}
              />
              {keyPoints.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => removeKeyPoint(i)} aria-label="Supprimer">
                  <X className="h-4 w-4 text-red-500" aria-hidden="true" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="icon">Icône (nom Lucide)</Label>
          <Input id="icon" name="icon" defaultValue={service?.icon ?? ''} placeholder="Globe" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="display_order">Ordre d&apos;affichage</Label>
          <Input id="display_order" name="display_order" type="number" min="0" defaultValue={service?.display_order ?? 0} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="image_url">URL de l&apos;image</Label>
        <Input id="image_url" name="image_url" type="url" defaultValue={service?.image_url ?? ''} placeholder="https://…" />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="is_published"
          name="is_published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
          value={isPublished ? 'true' : 'false'}
        />
        <Label htmlFor="is_published">Publier ce service</Label>
      </div>
      {/* Champ caché pour transmettre la valeur du switch */}
      <input type="hidden" name="is_published" value={isPublished ? 'true' : 'false'} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {isEdit ? 'Enregistrer les modifications' : 'Créer le service'}
        </Button>
      </div>
    </form>
  )
}
