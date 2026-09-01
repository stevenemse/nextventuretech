import { z } from 'zod'

export const pricingPlanSchema = z.object({
  service_id: z.string().uuid('Service invalide'),
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100)
    .trim(),
  description: z
    .string()
    .max(500)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v ?? null),
  price: z
    .number()
    .positive('Le prix doit être positif')
    .nullable()
    .optional()
    .transform((v) => v ?? null),
  currency: z.string().min(1).max(10).default('FCFA'),
  features: z
    .array(z.string().min(1).max(200).trim())
    .max(20, 'Maximum 20 fonctionnalités'),
  is_custom_quote: z.boolean().default(false),
  is_popular: z.boolean().default(false),
  display_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
})

export type PricingPlanFormData = z.infer<typeof pricingPlanSchema>
