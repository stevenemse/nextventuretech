'use client'

import { useActionState, useState } from 'react'
import { createWorkAction, updateWorkAction } from '@/app/actions/works'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ImageUpload } from '@/components/admin/image-upload'
import { slugify } from '@/lib/utils/slugify'
import { initialActionState } from '@/types/actions'
import type { Work } from '@/types/database'
import type { ActionResult } from '@/types/actions'

const CATEGORIES = [
  'Web Design', 'Graphic Design', 'Intelligence Artificielle',
  'Montage Vidéo', 'Motion Design', 'Application Mobile', 'Autre',
]

interface Props { work?: Work }

export function WorkForm({ work }: Props) {
  const isEdit = !!work
  const action = isEdit ? updateWorkAction.bind(null, work.id) : createWorkAction

  const [state, formAction, pending] = useActionState<ActionResult<Work>, FormData>(
    action, initialActionState,
  )

  const [slug, setSlug] = useState(work?.slug ?? '')
  const [isPublished, setIsPublished] = useState(work?.is_published ?? false)

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  const fe = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

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
          <Input id="title" name="title" defaultValue={work?.title} onChange={handleTitleChange} required error={fe['title']?.[0]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug" required>Slug</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required error={fe['slug']?.[0]} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={work?.description ?? ''} rows={4} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partner">Client / Partenaire</Label>
          <Input id="partner" name="partner" defaultValue={work?.partner ?? ''} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category" name="category"
            defaultValue={work?.category ?? ''}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Choisir —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Image : upload drag & drop + aperçu immédiat (stockée dans Supabase Storage, folder 'works') */}
      <div className="flex flex-col gap-1.5">
        <ImageUpload
          folder="works"
          currentUrl={work?.image_url ?? null}
          fieldName="image_url"
          label="Image de la réalisation"
        />
        {/* Champ caché pour la suppression de l'ancienne image dans updateWorkAction */}
        <input type="hidden" name="previous_image_url" value={work?.image_url ?? ''} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="project_url">URL du projet</Label>
        <Input id="project_url" name="project_url" type="url" defaultValue={work?.project_url ?? ''} placeholder="https://…" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="display_order">Ordre d&apos;affichage</Label>
        <Input id="display_order" name="display_order" type="number" min="0" defaultValue={work?.display_order ?? 0} className="w-32" />
      </div>

      <div className="flex items-center gap-3">
        <Switch id="is_published" checked={isPublished} onCheckedChange={setIsPublished} />
        <Label htmlFor="is_published">Publier cette réalisation</Label>
      </div>
      <input type="hidden" name="is_published" value={isPublished ? 'true' : 'false'} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {isEdit ? 'Enregistrer' : 'Créer la réalisation'}
        </Button>
      </div>
    </form>
  )
}
