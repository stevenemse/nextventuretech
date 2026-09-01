'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/guards'
import { pricingPlanSchema } from '@/lib/validations/pricing'
import {
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from '@/services/pricing.service'
import type { ActionResult } from '@/types/actions'
import type { PricingPlan } from '@/types/database'

/**
 * Créer un plan tarifaire (admin).
 */
export async function createPricingPlanAction(
  _prev: ActionResult<PricingPlan>,
  formData: FormData,
): Promise<ActionResult<PricingPlan>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const priceRaw = formData.get('price')
  const raw = {
    service_id: formData.get('service_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    price: priceRaw && String(priceRaw).trim() !== ''
      ? Number(priceRaw)
      : null,
    currency: formData.get('currency') ?? 'FCFA',
    features: formData.getAll('features').filter(Boolean),
    is_custom_quote: formData.get('is_custom_quote') === 'true',
    is_popular: formData.get('is_popular') === 'true',
    display_order: Number(formData.get('display_order') ?? 0),
    is_active: formData.get('is_active') !== 'false',
  }

  const parsed = pricingPlanSchema.safeParse(raw)
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
    const plan = await createPricingPlan(parsed.data)
    revalidatePath('/admin/tarifs')
    revalidatePath('/tarifs')
    redirect(`/admin/tarifs/${plan.id}`)
  } catch (err) {
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[createPricingPlanAction]', err)
    return { status: 'error', message: 'Erreur lors de la création.' }
  }
}

/**
 * Mettre à jour un plan tarifaire (admin).
 */
export async function updatePricingPlanAction(
  id: string,
  _prev: ActionResult<PricingPlan>,
  formData: FormData,
): Promise<ActionResult<PricingPlan>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const priceRaw = formData.get('price')
  const raw = {
    service_id: formData.get('service_id'),
    name: formData.get('name'),
    description: formData.get('description'),
    price: priceRaw && String(priceRaw).trim() !== ''
      ? Number(priceRaw)
      : null,
    currency: formData.get('currency') ?? 'FCFA',
    features: formData.getAll('features').filter(Boolean),
    is_custom_quote: formData.get('is_custom_quote') === 'true',
    is_popular: formData.get('is_popular') === 'true',
    display_order: Number(formData.get('display_order') ?? 0),
    is_active: formData.get('is_active') !== 'false',
  }

  const parsed = pricingPlanSchema.safeParse(raw)
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
    const plan = await updatePricingPlan(id, parsed.data)
    revalidatePath('/admin/tarifs')
    revalidatePath('/tarifs')
    revalidatePath(`/admin/tarifs/${id}`)
    return { status: 'success', message: 'Plan mis à jour.', data: plan }
  } catch (err) {
    console.error('[updatePricingPlanAction]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/**
 * Supprimer un plan tarifaire (admin).
 */
export async function deletePricingPlanAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await deletePricingPlan(id)
    revalidatePath('/admin/tarifs')
    revalidatePath('/tarifs')
    return { status: 'success', message: 'Plan supprimé.' }
  } catch (err) {
    console.error('[deletePricingPlanAction]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}

/**
 * Basculer le badge "Populaire" d'un plan.
 */
export async function togglePlanPopular(
  id: string,
  isPopular: boolean,
): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await updatePricingPlan(id, { is_popular: isPopular })
    revalidatePath('/admin/tarifs')
    revalidatePath('/tarifs')
    return {
      status: 'success',
      message: isPopular ? 'Plan marqué populaire.' : 'Badge retiré.',
    }
  } catch (err) {
    console.error('[togglePlanPopular]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}
