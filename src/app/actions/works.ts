'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { workSchema } from '@/lib/validations/work'
import { slugify } from '@/lib/utils/slugify'
import {
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
} from '@/services/works.service'
import { deleteImage } from '@/services/storage.service'
import type { ActionResult } from '@/types/actions'
import type { Work } from '@/types/database'

/**
 * Créer une réalisation (admin).
 */
export async function createWorkAction(
  _prev: ActionResult<Work>,
  formData: FormData,
): Promise<ActionResult<Work>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug') || slugify(String(formData.get('title') ?? '')),
    description: formData.get('description'),
    image_url: formData.get('image_url'),
    project_url: formData.get('project_url'),
    partner: formData.get('partner'),
    category: formData.get('category'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_published: formData.get('is_published') === 'true',
  }

  const parsed = workSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      if (errors) fieldErrors[field] = errors
    }
    return { status: 'error', message: 'Données invalides.', fieldErrors }
  }

  try {
    const work = await createWork(parsed.data)
    revalidatePath('/admin/realisations')
    revalidatePath('/realisations')
    redirect(`/admin/realisations/${work.id}`)
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[createWorkAction]', err)
    return { status: 'error', message: 'Erreur lors de la création.' }
  }
}

/**
 * Mettre à jour une réalisation (admin).
 */
export async function updateWorkAction(
  id: string,
  _prev: ActionResult<Work>,
  formData: FormData,
): Promise<ActionResult<Work>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const previousImageUrl = String(formData.get('previous_image_url') ?? '')

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    image_url: formData.get('image_url'),
    project_url: formData.get('project_url'),
    partner: formData.get('partner'),
    category: formData.get('category'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_published: formData.get('is_published') === 'true',
  }

  const parsed = workSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      if (errors) fieldErrors[field] = errors
    }
    return { status: 'error', message: 'Données invalides.', fieldErrors }
  }

  try {
    const work = await updateWork(id, parsed.data)

    // L'image a été remplacée dans le formulaire → supprimer l'ancienne du Storage
    if (
      previousImageUrl &&
      previousImageUrl !== parsed.data.image_url &&
      previousImageUrl.includes('/storage/v1/object/public/images/')
    ) {
      await deleteImage(previousImageUrl).catch((err) =>
        console.warn('[updateWorkAction] deleteImage:', err),
      )
    }

    revalidatePath('/admin/realisations')
    revalidatePath('/realisations')
    revalidatePath(`/admin/realisations/${id}`)
    return { status: 'success', message: 'Réalisation mise à jour.', data: work }
  } catch (err) {
    console.error('[updateWorkAction]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/**
 * Supprimer une réalisation (admin).
 */
export async function deleteWorkAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    // Récupérer l'URL de l'image avant suppression pour nettoyer le Storage
    const work = await getWorkById(id)
    if (work?.image_url?.includes('/storage/v1/object/public/images/')) {
      await deleteImage(work.image_url).catch((err) =>
        console.warn('[deleteWorkAction] deleteImage:', err),
      )
    }

    await deleteWork(id)
    revalidatePath('/admin/realisations')
    revalidatePath('/realisations')
    return { status: 'success', message: 'Réalisation supprimée.' }
  } catch (err) {
    console.error('[deleteWorkAction]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}

/**
 * Basculer la publication d'une réalisation.
 */
export async function toggleWorkPublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await updateWork(id, { is_published: isPublished })
    revalidatePath('/admin/realisations')
    revalidatePath('/realisations')
    return {
      status: 'success',
      message: isPublished ? 'Réalisation publiée.' : 'Réalisation dépubliée.',
    }
  } catch (err) {
    console.error('[toggleWorkPublished]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}
