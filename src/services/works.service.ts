import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Work, WorkInsert, WorkUpdate } from '@/types/database'

// ─── Lecture publique ────────────────────────────────────────

/** Toutes les réalisations publiées, triées par display_order. */
export async function getPublishedWorks(): Promise<Work[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getPublishedWorks: ${error.message}`)
  return data ?? []
}

/** Réalisations publiées filtrées par catégorie. */
export async function getPublishedWorksByCategory(
  category: string,
): Promise<Work[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getPublishedWorksByCategory: ${error.message}`)
  return data ?? []
}

// ─── Admin ───────────────────────────────────────────────────

/** Toutes les réalisations (admin), avec pagination. */
export async function getAllWorks(
  page = 1,
  pageSize = 20,
): Promise<{ data: Work[]; count: number }> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('works')
    .select('*', { count: 'exact' })
    .order('display_order', { ascending: true })
    .range(from, to)

  if (error) throw new Error(`getAllWorks: ${error.message}`)
  return { data: data ?? [], count: count ?? 0 }
}

/** Une réalisation par son ID. */
export async function getWorkById(id: string): Promise<Work | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getWorkById: ${error.message}`)
  return data
}

/** Créer une réalisation. */
export async function createWork(input: WorkInsert): Promise<Work> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('works')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createWork: ${error.message}`)
  if (!data) throw new Error('createWork: aucune donnée retournée')
  return data
}

/** Mettre à jour une réalisation. */
export async function updateWork(
  id: string,
  input: WorkUpdate,
): Promise<Work> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('works')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updateWork: ${error.message}`)
  if (!data) throw new Error('updateWork: aucune donnée retournée')
  return data
}

/** Supprimer une réalisation. */
export async function deleteWork(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('works').delete().eq('id', id)
  if (error) throw new Error(`deleteWork: ${error.message}`)
}
