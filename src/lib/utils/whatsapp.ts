import { siteConfig } from '@/config/site'

/**
 * Construit une URL WhatsApp avec un message prérempli.
 * @param name    Nom du prospect (optionnel)
 * @param service Nom du service demandé (optionnel)
 */
export function buildWhatsAppUrl(name?: string, service?: string): string {
  const number = siteConfig.whatsapp.replace(/\D/g, '')

  let message = 'Bonjour NextVenture Tech,'

  if (name) {
    message += ` je suis ${name}`
  }

  if (service) {
    message += ` et je souhaite en savoir plus sur votre service "${service}"`
  } else {
    message += ' et je souhaite discuter d\'un projet'
  }

  message += '. Merci.'

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
