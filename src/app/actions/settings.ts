'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'
import { siteSettingsSchema, siteStatSchema } from '@/lib/validations/settings'
import {
  upsertSiteSettings,
  createStat,
  updateStat,
  deleteStat,
} from '@/services/settings.service'
import type { ActionResult } from '@/types/actions'
import type { SiteSettings, SiteStat } from '@/types/database'

/**
 * Mettre à jour les paramètres du site (admin).
 */
export async function updateSiteSettingsAction(
  _prev: ActionResult<SiteSettings>,
  formData: FormData,
): Promise<ActionResult<SiteSettings>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    site_name: formData.get('site_name'),
    logo_url: formData.get('logo_url'),
    favicon_url: formData.get('favicon_url'),
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    calendly_url: formData.get('calendly_url'),
    social_links: {
      facebook: formData.get('facebook') ?? '',
      instagram: formData.get('instagram') ?? '',
      linkedin: formData.get('linkedin') ?? '',
      twitter: formData.get('twitter') ?? '',
    },
    // ── Espace publicitaire ──
    // Le Switch Radix publie sa valeur via l'input fantôme ("on" quand coché) :
    // `value="true"` est ajouté dans le formulaire pour rendre l'état explicite.
    ads_enabled: formData.get('ads_enabled') === 'true',
    adsense_publisher_id: formData.get('adsense_publisher_id') ?? '',
    ads_code: formData.get('ads_code') ?? '',
    ads_image_url: formData.get('ads_image_url') ?? '',
    ads_image_link: formData.get('ads_image_link') ?? '',
  }

  const parsed = siteSettingsSchema.safeParse(raw)
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
    const settings = await upsertSiteSettings(parsed.data)
    // Revalider toutes les pages qui affichent logo/coordonnées
    revalidatePath('/', 'layout')
    return {
      status: 'success',
      message: 'Paramètres sauvegardés.',
      data: settings,
    }
  } catch (err) {
    console.error('[updateSiteSettingsAction]', err)
    // Colonnes de publicité absentes → migration 005 non exécutée
    if (err instanceof Error && /ads_(enabled|code|image)/.test(err.message)) {
      return {
        status: 'error',
        message:
          'Colonnes publicité introuvables : exécutez supabase/migrations/005_ads.sql dans le SQL Editor Supabase, puis réessayez.',
      }
    }
    return { status: 'error', message: 'Erreur lors de la sauvegarde.' }
  }
}

/**
 * Créer une statistique (admin).
 */
export async function createStatAction(
  _prev: ActionResult<SiteStat>,
  formData: FormData,
): Promise<ActionResult<SiteStat>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    value: formData.get('value'),
    label: formData.get('label'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_active: formData.get('is_active') !== 'false',
  }

  const parsed = siteStatSchema.safeParse(raw)
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
    const stat = await createStat(parsed.data)
    revalidatePath('/admin/parametres')
    revalidatePath('/')
    return { status: 'success', message: 'Statistique créée.', data: stat }
  } catch (err) {
    console.error('[createStatAction]', err)
    return { status: 'error', message: 'Erreur lors de la création.' }
  }
}

/**
 * Mettre à jour une statistique (admin).
 */
export async function updateStatAction(
  id: string,
  _prev: ActionResult<SiteStat>,
  formData: FormData,
): Promise<ActionResult<SiteStat>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const raw = {
    value: formData.get('value'),
    label: formData.get('label'),
    display_order: Number(formData.get('display_order') ?? 0),
    is_active: formData.get('is_active') !== 'false',
  }

  const parsed = siteStatSchema.safeParse(raw)
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
    const stat = await updateStat(id, parsed.data)
    revalidatePath('/admin/parametres')
    revalidatePath('/')
    return { status: 'success', message: 'Statistique mise à jour.', data: stat }
  } catch (err) {
    console.error('[updateStatAction]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/**
 * Supprimer une statistique (admin).
 */
export async function deleteStatAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await deleteStat(id)
    revalidatePath('/admin/parametres')
    revalidatePath('/')
    return { status: 'success', message: 'Statistique supprimée.' }
  } catch (err) {
    console.error('[deleteStatAction]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}
