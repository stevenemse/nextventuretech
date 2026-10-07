import { siteConfig } from '@/config/site'

/** Neutralise les caractères de contrôle et bornes la longueur du message. */
function sanitize(input: string | undefined, max = 150): string {
  if (!input) return ''
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim()
}

interface WhatsAppOptions {
  /** Nom du prospect (optionnel) */
  name?: string
  /** Titre du service demandé (optionnel) */
  service?: string
  /** Plan tarifaire choisi (optionnel) */
  plan?: string
  /** Budget indiqué (optionnel) */
  budget?: string
}

/**
 * Construit une URL WhatsApp avec un message prérempli.
 * Utilisée après l'envoi du formulaire (le visiteur clique pour continuer
 * la conversation sur WhatsApp avec le contexte déjà saisi).
 * Les valeurs sont sanitizées : jamais de caractères de contrôle ni de
 * message excessivement long dans l'URL.
 */
export function buildWhatsAppUrl(options: WhatsAppOptions | string = {}): string {
  // Compat with old signature buildWhatsAppUrl(name, service)
  const opts: WhatsAppOptions =
    typeof options === 'string'
      ? { name: options }
      : options

  const number = siteConfig.whatsapp.replace(/\D/g, '')
  const name = sanitize(opts.name)
  const service = sanitize(opts.service)
  const plan = sanitize(opts.plan)
  const budget = sanitize(opts.budget, 60)

  let message = 'Bonjour NextVenture Tech'
  if (name) message += `, je suis ${name}`
  else message += ','

  const subject = [
    plan ? `votre offre « ${plan} »` : service ? `votre service « ${service} »` : null,
  ]
    .filter(Boolean)
    .join('')

  if (subject) message += ` et je suis intéressé(e) par ${subject}`
  else message += " et je souhaite discuter d'un projet"

  if (budget) message += ` (budget : ${budget})`
  message += '. Merci.'

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
