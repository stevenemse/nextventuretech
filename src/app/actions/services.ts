'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { serviceSchema } from '@/lib/validations/service'
import { slugify } from '@/lib/utils/slugify'
import {
  createService,
  updateService,
  deleteService,
} from '@/services/services.service'
import type { ActionResult } from '@/types/actions'
import type { Service } from '@/types/database'

/**
 * Créer un service (admin).
 */
export async function createServiceAction(
  _prev: ActionResult<Service>,
  formData: FormData,
): Promise<ActionResult<Service>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug') || slugify(String(formData.get('title') ?? '')),
    description: formData.get('description'),
    key_points: formData.getAll('key_points').filter(Boolean),
    image_url: formData.get('image_url'),
    icon: formData.get('icon'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_published: formData.get('is_published') === 'true',
  }

  const parsed = serviceSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      if (errors) fieldErrors[field] = errors
    }
    return {
      status: 'error',
      message: 'Données invalides.',
      fieldErrors,
    }
  }

  try {
    const service = await createService(parsed.data)
    revalidatePath('/admin/services')
    revalidatePath('/services')
    redirect(`/admin/services/${service.id}`)
  } catch (err) {
    // redirect() lance une exception — la propager
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[createServiceAction]', err)
    return { status: 'error', message: 'Erreur lors de la création.' }
  }
}

/**
 * Mettre à jour un service (admin).
 */
export async function updateServiceAction(
  id: string,
  _prev: ActionResult<Service>,
  formData: FormData,
): Promise<ActionResult<Service>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    key_points: formData.getAll('key_points').filter(Boolean),
    image_url: formData.get('image_url'),
    icon: formData.get('icon'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_published: formData.get('is_published') === 'true',
  }

  const parsed = serviceSchema.safeParse(raw)
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
    const service = await updateService(id, parsed.data)
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath(`/admin/services/${id}`)
    return { status: 'success', message: 'Service mis à jour.', data: service }
  } catch (err) {
    console.error('[updateServiceAction]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/**
 * Supprimer un service (admin).
 */
export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await deleteService(id)
    revalidatePath('/admin/services')
    revalidatePath('/services')
    revalidatePath('/tarifs')
    return { status: 'success', message: 'Service supprimé.' }
  } catch (err) {
    console.error('[deleteServiceAction]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}

/**
 * Basculer la publication d'un service (admin).
 */
export async function toggleServicePublished(
  id: string,
  isPublished: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await updateService(id, { is_published: isPublished })
    revalidatePath('/admin/services')
    revalidatePath('/services')
    return {
      status: 'success',
      message: isPublished ? 'Service publié.' : 'Service dépublié.',
    }
  } catch (err) {
    console.error('[toggleServicePublished]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}
