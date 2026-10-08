import { siteConfig } from '@/config/site'
import type { Lang } from '@/lib/i18n'

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
  /** Langue du message (défaut FR) */
  lang?: Lang
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
  const lang: Lang = opts.lang === 'en' ? 'en' : 'fr'

  // Sujet : offre / service / generic — selon la langue
  const subject =
    plan
      ? lang === 'en'
        ? `your “${plan}” offer`
        : `votre offre « ${plan} »`
      : service
        ? lang === 'en'
          ? `your “${service}” service`
          : `votre service « ${service} »`
        : null

  let message: string
  if (lang === 'en') {
    message = 'Hello NextVenture Tech'
    message += name ? `, I'm ${name}` : ','
    message += subject
      ? ` and I'm interested in ${subject}`
      : ' and I would like to discuss a project'
    if (budget) message += ` (budget: ${budget})`
    message += '. Thank you.'
  } else {
    message = 'Bonjour NextVenture Tech'
    message += name ? `, je suis ${name}` : ','
    message += subject
      ? ` et je suis intéressé(e) par ${subject}`
      : " et je souhaite discuter d'un projet"
    if (budget) message += ` (budget : ${budget})`
    message += '. Merci.'
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
