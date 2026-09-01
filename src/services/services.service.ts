import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type {
  Service,
  ServiceInsert,
  ServiceUpdate,
} from '@/types/database'

// ─── Lecture publique ────────────────────────────────────────

/** Tous les services publiés, triés par display_order. */
export async function getPublishedServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getPublishedServices: ${error.message}`)
  return data ?? []
}

/** Un service publié par son slug. */
export async function getPublishedServiceBySlug(
  slug: string,
): Promise<Service | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getPublishedServiceBySlug: ${error.message}`)
  return data
}

// ─── Admin ───────────────────────────────────────────────────

/** Tous les services (publiés + brouillons) pour le dashboard. */
export async function getAllServices(): Promise<Service[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getAllServices: ${error.message}`)
  return data ?? []
}

/** Un service par son ID (admin). */
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getServiceById: ${error.message}`)
  return data
}

/** Créer un service. */
export async function createService(input: ServiceInsert): Promise<Service> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createService: ${error.message}`)
  if (!data) throw new Error('createService: aucune donnée retournée')
  return data
}

/** Mettre à jour un service. */
export async function updateService(
  id: string,
  input: ServiceUpdate,
): Promise<Service> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updateService: ${error.message}`)
  if (!data) throw new Error('updateService: aucune donnée retournée')
  return data
}

/** Supprimer un service. */
export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw new Error(`deleteService: ${error.message}`)
}

/** Mettre à jour l'ordre d'affichage de plusieurs services. */
export async function reorderServices(
  items: { id: string; display_order: number }[],
): Promise<void> {
  const supabase = await createClient()
  const updates = items.map(({ id, display_order }) =>
    supabase
      .from('services')
      .update({ display_order })
      .eq('id', id),
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(`reorderServices: ${failed.error.message}`)
}
