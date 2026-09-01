import { z } from 'zod'

export const workSchema = z.object({
  title: z
    .string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(150, 'Le titre ne peut pas dépasser 150 caractères')
    .trim(),
  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-z0-9-]+$/, 'Slug invalide')
    .trim(),
  description: z
    .string()
    .max(2000)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v ?? null),
  image_url: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  project_url: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  partner: z
    .string()
    .max(150)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  category: z
    .string()
    .max(100)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(false),
})

export type WorkFormData = z.infer<typeof workSchema>
