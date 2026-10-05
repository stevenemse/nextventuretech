import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200)
    .trim(),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug invalide — lettres minuscules, chiffres et tirets uniquement')
    .trim(),
  excerpt: z
    .string()
    .max(300, 'Le résumé ne peut pas dépasser 300 caractères')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v ?? null),
  content: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v ?? null),
  cover_image_url: z
    .string()
    .url('URL invalide')
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  author: z.string().min(1).max(100).trim().default('NextVenture Tech'),
  category: z
    .string()
    .max(100)
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  tags: z.array(z.string().min(1).max(50).trim()).max(10).default([]),
  is_published: z.boolean().default(false),
  published_at: z.string().nullable().default(null),
  seo_title: z
    .string()
    .max(70, 'Le titre SEO ne peut pas dépasser 70 caractères')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
  seo_description: z
    .string()
    .max(160, 'La meta description ne peut pas dépasser 160 caractères')
    .trim()
    .optional()
    .or(z.literal(''))
    .transform((v) => v || null),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>
