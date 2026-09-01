/**
 * Types TypeScript alignés sur le schéma PostgreSQL Supabase.
 * Générer automatiquement via : npx supabase gen types typescript
 * En attendant la génération, ces types sont définis manuellement.
 */

export type ServiceStatus = 'published' | 'draft'
export type WorkRequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'refused'

// ─── services ───────────────────────────────────────────────────────────────
export interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  key_points: string[]
  image_url: string | null
  icon: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type ServiceInsert = Omit<Service, 'id' | 'created_at' | 'updated_at'>
export type ServiceUpdate = Partial<ServiceInsert>

// ─── works ──────────────────────────────────────────────────────────────────
export interface Work {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  project_url: string | null
  partner: string | null
  category: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export type WorkInsert = Omit<Work, 'id' | 'created_at' | 'updated_at'>
export type WorkUpdate = Partial<WorkInsert>

// ─── pricing_plans ──────────────────────────────────────────────────────────
export interface PricingPlan {
  id: string
  service_id: string
  name: string
  description: string | null
  price: number | null
  currency: string
  features: string[]
  is_custom_quote: boolean
  is_popular: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type PricingPlanInsert = Omit<
  PricingPlan,
  'id' | 'created_at' | 'updated_at'
>
export type PricingPlanUpdate = Partial<PricingPlanInsert>

// ─── work_requests ──────────────────────────────────────────────────────────
export interface WorkRequest {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  service_id: string | null
  budget: string | null
  message: string
  status: WorkRequestStatus
  created_at: string
  updated_at: string
}

export type WorkRequestInsert = Omit<
  WorkRequest,
  'id' | 'status' | 'created_at' | 'updated_at'
>
export type WorkRequestUpdate = Partial<Pick<WorkRequest, 'status'>>

// ─── site_settings ──────────────────────────────────────────────────────────
export interface SocialLinks {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}

export interface SiteSettings {
  id: string
  site_name: string
  logo_url: string | null
  favicon_url: string | null
  whatsapp: string | null
  email: string | null
  phone: string | null
  calendly_url: string | null
  social_links: SocialLinks
  updated_at: string
}

export type SiteSettingsUpdate = Partial<
  Omit<SiteSettings, 'id' | 'updated_at'>
>

// ─── site_statistics ────────────────────────────────────────────────────────
export interface SiteStat {
  id: string
  value: string
  label: string
  display_order: number
  is_active: boolean
  updated_at: string
}

export type SiteStatInsert = Omit<SiteStat, 'id' | 'updated_at'>
export type SiteStatUpdate = Partial<SiteStatInsert>

// ─── user_roles ─────────────────────────────────────────────────────────────
export interface UserRole {
  user_id: string
  role: 'admin'
  created_at: string
}

// ─── Joined types (for UI) ───────────────────────────────────────────────────
export interface PricingPlanWithService extends PricingPlan {
  services: Pick<Service, 'id' | 'title' | 'slug'>
}

export interface WorkRequestWithService extends WorkRequest {
  services: Pick<Service, 'id' | 'title'> | null
}
