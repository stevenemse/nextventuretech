import { z } from 'zod'

export const serviceSchema = z.object({
  title: z
    .string()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  slug: z
    .string()
    .min(2, 'Le slug doit contenir au moins 2 caractères')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets')
    .trim(),
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v ?? null),
  key_points: z
    .array(z.string().min(1).max(200).trim())
    .max(10, 'Maximum 10 points clés'),
  image_url: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  icon: z
    .string()
    .max(50)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  display_order: z.number().int().min(0).default(0),
  is_published: z.boolean().default(false),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
