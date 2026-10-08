'use server'

import { headers } from 'next/headers'
import { contactSchema, honeypotSchema } from '@/lib/validations/contact'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { createWorkRequest } from '@/services/requests.service'
import { getPublishedServices } from '@/services/services.service'
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp'
import { getT } from '@/lib/i18n/server'
import { localizeService } from '@/lib/i18n'
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
  const { lang, t } = await getT()

  // ── Honeypot anti-bot ──────────────────────────────────────
  // Un humain ne peut pas remplir le champ « website » (inaccessible).
  // Un bot qui le remplit est silencieusement ignoré (pas de fuite d'info).
  const honeypot = honeypotSchema.safeParse({
    website: String(formData.get('website') ?? ''),
  })
  if (!honeypot.success || honeypot.data.website !== '') {
    // Réponse factice pour ne pas révéler le piège
    return { status: 'error', message: t.contactForm.msgInvalid }
  }

  // ── Rate limiting ──────────────────────────────────────────
  const headersList = await headers()
  const ip = getClientIp(headersList)
  const rateLimitResult = checkRateLimit(ip)

  if (!rateLimitResult.allowed) {
    return {
      status: 'error',
      message:
        lang === 'en'
          ? `Too many attempts. Please retry in ${rateLimitResult.retryAfter} seconds.`
          : `Trop de tentatives. Réessayez dans ${rateLimitResult.retryAfter} secondes.`,
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
      message: t.contactForm.msgFixFields,
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
      message: t.contactForm.msgServerError,
    }
  }

  // ── Succès ─────────────────────────────────────────────────
  // Récupérer le titre du service choisi pour le message WhatsApp.
  // La requête DB a déjà été persistée ; on relit le titre via getPublishedServices.
  let serviceName: string | undefined
  if (input.service_id) {
    try {
      const services = await getPublishedServices()
      const selected = services.find((s) => s.id === input.service_id)
      if (selected) serviceName = localizeService(selected, t).title
    } catch {
      // best-effort — le message WhatsApp reste utile sans le titre
    }
  }

  const whatsappUrl = buildWhatsAppUrl({
    name: input.name,
    service: serviceName,
    budget: input.budget ?? undefined,
    lang,
  })

  return {
    status: 'success',
    message: t.contactForm.msgSuccess,
    data: { whatsappUrl, name: input.name },
  }
}
