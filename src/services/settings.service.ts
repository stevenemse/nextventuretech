import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type {
  SiteSettings,
  SiteSettingsUpdate,
  SiteStat,
  SiteStatInsert,
  SiteStatUpdate,
} from '@/types/database'

// ─── site_settings ───────────────────────────────────────────

/**
 * Récupère les paramètres du site (singleton).
 * Lisible publiquement pour la navbar et le footer.
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getSiteSettings: ${error.message}`)
  return data
}

/** Met à jour les paramètres du site (admin). Upsert sur le singleton. */
export async function upsertSiteSettings(
  input: SiteSettingsUpdate,
): Promise<SiteSettings> {
  const supabase = await createClient()

  // Récupérer l'ID existant ou en créer un nouveau
  const existing = await getSiteSettings()

  if (existing) {
    const { data, error } = await supabase
      .from('site_settings')
      .update(input)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw new Error(`upsertSiteSettings (update): ${error.message}`)
    if (!data) throw new Error('upsertSiteSettings: aucune donnée retournée')
    return data
  }

  const { data, error } = await supabase
    .from('site_settings')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`upsertSiteSettings (insert): ${error.message}`)
  if (!data) throw new Error('upsertSiteSettings: aucune donnée retournée')
  return data
}

// ─── site_statistics ─────────────────────────────────────────

/** Statistiques actives, triées par display_order. */
export async function getActiveStats(): Promise<SiteStat[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_statistics')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getActiveStats: ${error.message}`)
  return data ?? []
}

/** Toutes les statistiques (admin). */
export async function getAllStats(): Promise<SiteStat[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_statistics')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getAllStats: ${error.message}`)
  return data ?? []
}

/** Créer une statistique. */
export async function createStat(input: SiteStatInsert): Promise<SiteStat> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_statistics')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createStat: ${error.message}`)
  if (!data) throw new Error('createStat: aucune donnée retournée')
  return data
}

/** Mettre à jour une statistique. */
export async function updateStat(
  id: string,
  input: SiteStatUpdate,
): Promise<SiteStat> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_statistics')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updateStat: ${error.message}`)
  if (!data) throw new Error('updateStat: aucune donnée retournée')
  return data
}

/** Supprimer une statistique. */
export async function deleteStat(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('site_statistics')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`deleteStat: ${error.message}`)
}
