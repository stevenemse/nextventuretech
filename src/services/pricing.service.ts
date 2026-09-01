import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type {
  PricingPlan,
  PricingPlanInsert,
  PricingPlanUpdate,
  PricingPlanWithService,
} from '@/types/database'

// ─── Lecture publique ────────────────────────────────────────

/** Tous les plans actifs, avec le service associé. */
export async function getActivePricingPlans(): Promise<PricingPlanWithService[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*, services(id, title, slug)')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getActivePricingPlans: ${error.message}`)
  return (data ?? []) as PricingPlanWithService[]
}

/** Plans actifs pour un service donné. */
export async function getPricingPlansByService(
  serviceId: string,
): Promise<PricingPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('service_id', serviceId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getPricingPlansByService: ${error.message}`)
  return data ?? []
}

// ─── Admin ───────────────────────────────────────────────────

/** Tous les plans (actifs + inactifs) pour le dashboard. */
export async function getAllPricingPlans(): Promise<PricingPlanWithService[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*, services(id, title, slug)')
    .order('display_order', { ascending: true })

  if (error) throw new Error(`getAllPricingPlans: ${error.message}`)
  return (data ?? []) as PricingPlanWithService[]
}

/** Un plan par son ID. */
export async function getPricingPlanById(
  id: string,
): Promise<PricingPlan | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getPricingPlanById: ${error.message}`)
  return data
}

/** Créer un plan. */
export async function createPricingPlan(
  input: PricingPlanInsert,
): Promise<PricingPlan> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createPricingPlan: ${error.message}`)
  if (!data) throw new Error('createPricingPlan: aucune donnée retournée')
  return data
}

/** Mettre à jour un plan. */
export async function updatePricingPlan(
  id: string,
  input: PricingPlanUpdate,
): Promise<PricingPlan> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pricing_plans')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updatePricingPlan: ${error.message}`)
  if (!data) throw new Error('updatePricingPlan: aucune donnée retournée')
  return data
}

/** Supprimer un plan. */
export async function deletePricingPlan(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pricing_plans')
    .delete()
    .eq('id', id)
  if (error) throw new Error(`deletePricingPlan: ${error.message}`)
}
