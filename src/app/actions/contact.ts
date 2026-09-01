'use server'

import { headers } from 'next/headers'
import { contactSchema } from '@/lib/validations/contact'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { createWorkRequest } from '@/services/requests.service'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import type { ActionResult } from '@/types/actions'

export interface ContactActionData {
  whatsappUrl: string
  name: string
}

/**
 * Server Action : soumettre le formulaire de contact public.
 * - Validation Zod côté serveur
 * - Rate limiting par IP
 * - Création WorkRequest en base
 * - Retourne une URL WhatsApp préremplie
 */
export async function submitContactForm(
  _prev: ActionResult<ContactActionData>,
  formData: FormData,
): Promise<ActionResult<ContactActionData>> {
  // ── Rate limiting ──────────────────────────────────────────
  const headersList = await headers()
  const ip = getClientIp(headersList)
  const rateLimitResult = checkRateLimit(ip)

  if (!rateLimitResult.allowed) {
    return {
      status: 'error',
      message: `Trop de tentatives. Réessayez dans ${rateLimitResult.retryAfter} secondes.`,
    }
  }

  // ── Validation ─────────────────────────────────────────────
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    service_id: formData.get('service_id'),
    budget: formData.get('budget'),
    message: formData.get('message'),
  }

  const parsed = contactSchema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors,
    )) {
      if (errors) fieldErrors[field] = errors
    }
    return {
      status: 'error',
      message: 'Veuillez corriger les erreurs dans le formulaire.',
      fieldErrors,
    }
  }

  const input = parsed.data

  // ── Persistance ────────────────────────────────────────────
  try {
    await createWorkRequest({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      company: input.company ?? null,
      service_id: input.service_id ?? null,
      budget: input.budget ?? null,
      message: input.message,
    })
  } catch (err) {
    console.error('[submitContactForm] DB error:', err)
    return {
      status: 'error',
      message:
        'Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.',
    }
  }

  // ── Succès ─────────────────────────────────────────────────
  const whatsappUrl = buildWhatsAppUrl(input.name, input.service_id ?? undefined)

  return {
    status: 'success',
    message: 'Votre demande a bien été enregistrée ! Nous vous contacterons rapidement.',
    data: { whatsappUrl, name: input.name },
  }
}
