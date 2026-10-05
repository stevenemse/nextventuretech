'use client'

import { useActionState, useState } from 'react'
import { createBlogPostAction, updateBlogPostAction } from '@/app/actions/blog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { slugify } from '@/lib/utils/slugify'
import { initialActionState } from '@/types/actions'
import { Plus, X } from 'lucide-react'
import type { BlogPost } from '@/types/database'
import type { ActionResult } from '@/types/actions'

const CATEGORIES = [
  'Web Design', 'Développement', 'Design Graphique',
  'Intelligence Artificielle', 'Marketing Digital',
  'Conseils', 'Actualités', 'Tutoriels',
]

interface Props { post?: BlogPost }

export function BlogPostForm({ post }: Props) {
  const isEdit = !!post
  const action = isEdit
    ? updateBlogPostAction.bind(null, post.id)
    : createBlogPostAction

  const [state, formAction, pending] = useActionState<ActionResult<BlogPost>, FormData>(
    action, initialActionState,
  )

  const [slug, setSlug] = useState(post?.slug ?? '')
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false)
  const [tags, setTags] = useState<string[]>(post?.tags ?? [])
  const [tagInput, setTagInput] = useState('')

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isEdit) setSlug(slugify(e.target.value))
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  const fe = state.status === 'error' ? (state.fieldErrors ?? {}) : {}

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}
      {state.status === 'success' && (
        <Alert variant="success"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      {/* Titre + Slug */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" required>Titre</Label>
          <Input id="title" name="title" defaultValue={post?.title} onChange={handleTitleChange} required error={fe['title']?.[0]} />
          {fe['title']?.[0] && <p className="text-xs text-red-500">{fe['title'][0]}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug" required>Slug (URL)</Label>
          <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required error={fe['slug']?.[0]} />
          {slug && <p className="text-xs text-slate-400">/blog/{slug}</p>}
        </div>
      </div>

      {/* Résumé */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="excerpt">Résumé <span className="text-slate-400 font-normal">(affiché dans les cartes et meta description)</span></Label>
        <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ''} rows={3} placeholder="Décrivez l'article en 1-2 phrases (max 300 caractères)…" />
        <p className="text-xs text-slate-400">Utilisé comme meta description si le champ SEO est vide</p>
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Contenu <span className="text-slate-400 font-normal">(Markdown supporté)</span></Label>
        <Textarea id="content" name="content" defaultValue={post?.content ?? ''} rows={20} placeholder="# Titre&#10;&#10;Votre contenu en Markdown..." className="font-mono text-sm" />
      </div>

      {/* Image + Auteur + Catégorie */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="author">Auteur</Label>
          <Input id="author" name="author" defaultValue={post?.author ?? 'NextVenture Tech'} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category" name="category"
            defaultValue={post?.category ?? ''}
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Choisir —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cover_image_url">URL image de couverture</Label>
          <Input id="cover_image_url" name="cover_image_url" type="url" defaultValue={post?.cover_image_url ?? ''} placeholder="https://…" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
            placeholder="Ajouter un tag (Entrée pour valider)"
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                #{tag}
                <input type="hidden" name="tags" value={tag} />
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900" aria-label={`Supprimer ${tag}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-700 uppercase tracking-wide">SEO</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo_title">Titre SEO <span className="text-slate-400 font-normal">(max 70 caractères)</span></Label>
            <Input id="seo_title" name="seo_title" defaultValue={post?.seo_title ?? ''} placeholder="Titre pour Google (laissez vide = titre de l'article)" maxLength={70} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="seo_description">Meta description <span className="text-slate-400 font-normal">(max 160 caractères)</span></Label>
            <Textarea id="seo_description" name="seo_description" defaultValue={post?.seo_description ?? ''} rows={2} placeholder="Description pour Google (laissez vide = résumé de l'article)" maxLength={160} />
          </div>
        </div>
      </div>

      {/* Publication */}
      <div className="flex items-center gap-3">
        <Switch id="is_published" checked={isPublished} onCheckedChange={setIsPublished} />
        <Label htmlFor="is_published">
          {isPublished ? 'Publier maintenant' : 'Enregistrer comme brouillon'}
        </Label>
      </div>
      <input type="hidden" name="is_published" value={isPublished ? 'true' : 'false'} />
      {post?.published_at && (
        <input type="hidden" name="published_at" value={post.published_at} />
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={pending}>
          {isEdit ? 'Enregistrer les modifications' : 'Créer l\'article'}
        </Button>
      </div>
    </form>
  )
}
