import { z } from 'zod'

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .trim(),
  email: z
    .string()
    .email("L'adresse email n'est pas valide")
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .max(20, 'Le numéro de téléphone est trop long')
    .trim()
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .max(100, "Le nom de l'entreprise est trop long")
    .trim()
    .optional()
    .or(z.literal('')),
  service_id: z.string().uuid('Service invalide').optional().or(z.literal('')),
  budget: z
    .string()
    .max(100, 'Le budget indiqué est trop long')
    .trim()
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .trim(),
})

export type ContactFormData = z.infer<typeof contactSchema>
