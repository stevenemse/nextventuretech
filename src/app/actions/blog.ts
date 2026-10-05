'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { blogPostSchema } from '@/lib/validations/blog'
import { slugify } from '@/lib/utils/slugify'
import {
  createPost, updatePost, deletePost,
} from '@/services/blog.service'
import type { ActionResult } from '@/types/actions'
import type { BlogPost } from '@/types/database'

/** Créer un article de blog (admin). */
export async function createBlogPostAction(
  _prev: ActionResult<BlogPost>,
  formData: FormData,
): Promise<ActionResult<BlogPost>> {
  try { await requireAdmin() } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const isPublished = formData.get('is_published') === 'true'
  const raw = {
    title:           formData.get('title'),
    slug:            formData.get('slug') || slugify(String(formData.get('title') ?? '')),
    excerpt:         formData.get('excerpt'),
    content:         formData.get('content'),
    cover_image_url: formData.get('cover_image_url'),
    author:          formData.get('author') || 'NextVenture Tech',
    category:        formData.get('category'),
    tags:            formData.getAll('tags').filter(Boolean),
    is_published:    isPublished,
    published_at:    isPublished ? new Date().toISOString() : null,
    seo_title:       formData.get('seo_title'),
    seo_description: formData.get('seo_description'),
  }

  const parsed = blogPostSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (errors) fieldErrors[field] = errors
    }
    return { status: 'error', message: 'Données invalides.', fieldErrors }
  }

  try {
    const post = await createPost(parsed.data)
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    redirect(`/admin/blog/${post.id}`)
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[createBlogPostAction]', err)
    return { status: 'error', message: 'Erreur lors de la création.' }
  }
}

/** Mettre à jour un article (admin). */
export async function updateBlogPostAction(
  id: string,
  _prev: ActionResult<BlogPost>,
  formData: FormData,
): Promise<ActionResult<BlogPost>> {
  try { await requireAdmin() } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const isPublished = formData.get('is_published') === 'true'
  const raw = {
    title:           formData.get('title'),
    slug:            formData.get('slug'),
    excerpt:         formData.get('excerpt'),
    content:         formData.get('content'),
    cover_image_url: formData.get('cover_image_url'),
    author:          formData.get('author') || 'NextVenture Tech',
    category:        formData.get('category'),
    tags:            formData.getAll('tags').filter(Boolean),
    is_published:    isPublished,
    published_at:
      typeof formData.get('published_at') === 'string' && formData.get('published_at')
        ? String(formData.get('published_at'))
        : (isPublished ? new Date().toISOString() : null),
    seo_title:       formData.get('seo_title'),
    seo_description: formData.get('seo_description'),
  }

  const parsed = blogPostSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (errors) fieldErrors[field] = errors
    }
    return { status: 'error', message: 'Données invalides.', fieldErrors }
  }

  try {
    const post = await updatePost(id, parsed.data)
    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin/blog')
    revalidatePath(`/admin/blog/${id}`)
    return { status: 'success', message: 'Article mis à jour.', data: post }
  } catch (err) {
    console.error('[updateBlogPostAction]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/** Supprimer un article (admin). */
export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  try { await requireAdmin() } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }
  try {
    await deletePost(id)
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return { status: 'success', message: 'Article supprimé.' }
  } catch (err) {
    console.error('[deleteBlogPostAction]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}

/** Basculer la publication d&apos;un article. */
export async function toggleBlogPostPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try { await requireAdmin() } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }
  try {
    await updatePost(id, {
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    revalidatePath('/blog')
    revalidatePath('/admin/blog')
    return {
      status: 'success',
      message: isPublished ? 'Article publié.' : 'Article dépublié.',
    }
  } catch (err) {
    console.error('[toggleBlogPostPublished]', err)
    return { status: 'error', message: 'Erreur.' }
  }
}
