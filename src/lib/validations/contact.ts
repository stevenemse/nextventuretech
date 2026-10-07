import { z } from 'zod'

/** Regex de détection de caractères de contrôle / tentative d'injection. */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

/**
 * Sanitise une chaîne libre : supprime les caractères de contrôle,
 * neutralise les balises HTML/JS (<script>, <img onerror=…) et le HTML entité.
 * La BDD stocke du texte brut ; l'affichage public passe toujours par React
 * (échappement automatique), donc l'injection XSS est déjà bloquée au rendu.
 * Ce nettoyage protège aussi les liens WhatsApp préremplis et les exports.
 */
function sanitizeText(max: number) {
  return z
    .string()
    .transform((v) => v.replace(/[<>]/g, '').replace(CONTROL_CHARS, ''))
    .transform((v) => v.replace(/\s+/g, ' ').trim())
    .pipe(z.string().max(max))
}

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .transform((v) => v.replace(CONTROL_CHARS, '').trim())
    .pipe(z.string().min(2, 'Le nom doit contenir au moins 2 caractères')),
  email: z
    .string()
    .email("L'adresse email n'est pas valide")
    .max(254, "L'email ne peut pas dépasser 254 caractères")
    .trim()
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^[+\d\s().-]{0,20}$/, 'Numéro de téléphone invalide')
    .optional()
    .or(z.literal('')),
  company: sanitizeText(100)
    .optional()
    .or(z.literal('')),
  service_id: z.string().uuid('Service invalide').optional().or(z.literal('')),
  budget: sanitizeText(100)
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .transform((v) => v.replace(CONTROL_CHARS, '').trim())
    .pipe(z.string().min(10, 'Le message doit contenir au moins 10 caractères')),
})

/**
 * Champs pièges pour bots : remplis par automation, jamais par un humain.
 * Plus d'infos : https://developer.mozilla.org/en-US/docs/Web/Security/honeypot
 */
export const honeypotSchema = z.object({
  website: z.string().max(0, 'Champ réservé aux robots').optional().default(''),
})

export type ContactFormData = z.infer<typeof contactSchema>
