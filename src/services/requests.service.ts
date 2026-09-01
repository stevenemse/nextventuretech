import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type {
  WorkRequest,
  WorkRequestInsert,
  WorkRequestStatus,
  WorkRequestWithService,
} from '@/types/database'

// ─── Formulaire public ───────────────────────────────────────

/**
 * Crée une demande depuis le formulaire contact public.
 * Utilise la clé anon + RLS policy "requests_public_insert".
 * Le statut initial est toujours 'pending' (imposé par la DB).
 */
export async function createWorkRequest(
  input: WorkRequestInsert,
): Promise<WorkRequest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_requests')
    .insert({
      ...input,
      // Normalisation serveur — on ne fait pas confiance au frontend
      service_id: input.service_id || null,
      phone: input.phone || null,
      company: input.company || null,
      budget: input.budget || null,
    })
    .select()
    .single()

  if (error) throw new Error(`createWorkRequest: ${error.message}`)
  if (!data) throw new Error('createWorkRequest: aucune donnée retournée')
  return data
}

// ─── Admin ───────────────────────────────────────────────────

/** Toutes les demandes avec pagination, tri et filtre de statut. */
export async function getAllWorkRequests(options: {
  page?: number
  pageSize?: number
  status?: WorkRequestStatus | 'all'
  search?: string
}): Promise<{ data: WorkRequestWithService[]; count: number }> {
  const { page = 1, pageSize = 20, status = 'all', search = '' } = options
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('work_requests')
    .select('*, services(id, title)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  if (search.trim()) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`,
    )
  }

  const { data, error, count } = await query

  if (error) throw new Error(`getAllWorkRequests: ${error.message}`)
  return {
    data: (data ?? []) as WorkRequestWithService[],
    count: count ?? 0,
  }
}

/** Une demande par son ID. */
export async function getWorkRequestById(
  id: string,
): Promise<WorkRequestWithService | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_requests')
    .select('*, services(id, title)')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getWorkRequestById: ${error.message}`)
  return data as WorkRequestWithService
}

/** Changer le statut d'une demande. */
export async function updateWorkRequestStatus(
  id: string,
  status: WorkRequestStatus,
): Promise<WorkRequest> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('work_requests')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updateWorkRequestStatus: ${error.message}`)
  if (!data) throw new Error('updateWorkRequestStatus: aucune donnée retournée')
  return data
}

/** Compter les demandes en attente (pour le badge du dashboard). */
export async function countPendingRequests(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('work_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) throw new Error(`countPendingRequests: ${error.message}`)
  return count ?? 0
}

/** Supprimer une demande. */
export async function deleteWorkRequest(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('work_requests')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`deleteWorkRequest: ${error.message}`)
}
