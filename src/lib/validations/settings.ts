import { z } from 'zod'

export const siteSettingsSchema = z.object({
  site_name: z.string().min(1, 'Le nom du site est requis').max(100).trim(),
  logo_url: z.string().url('URL invalide').optional().or(z.literal('')),
  favicon_url: z.string().url('URL invalide').optional().or(z.literal('')),
  whatsapp: z
    .string()
    .max(20)
    .regex(/^\+?[\d\s-]+$/, 'Numéro WhatsApp invalide')
    .trim()
    .optional()
    .or(z.literal('')),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().max(20).trim().optional().or(z.literal('')),
  calendly_url: z
    .string()
    .url('URL Calendly invalide')
    .optional()
    .or(z.literal('')),
  social_links: z.object({
    facebook: z.string().url('URL invalide').optional().or(z.literal('')),
    instagram: z.string().url('URL invalide').optional().or(z.literal('')),
    linkedin: z.string().url('URL invalide').optional().or(z.literal('')),
    twitter: z.string().url('URL invalide').optional().or(z.literal('')),
  }),
  // ── Espace publicitaire (blog) ──
  ads_enabled: z.boolean().default(false),
  adsense_publisher_id: z
    .string()
    .trim()
    .max(60, "ID éditeur trop long (ex. ca-pub-1234567890123456)")
    .optional()
    .or(z.literal('')),
  ads_code: z.string().max(10000, 'Code HTML trop long').optional().or(z.literal('')),
  ads_image_url: z.string().url('URL invalide').optional().or(z.literal('')),
  ads_image_link: z.string().url('URL invalide').optional().or(z.literal('')),
})

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>

export const siteStatSchema = z.object({
  value: z.string().min(1).max(20).trim(),
  label: z.string().min(1).max(100).trim(),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type SiteStatFormData = z.infer<typeof siteStatSchema>
