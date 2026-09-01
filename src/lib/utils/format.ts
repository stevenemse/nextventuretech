/**
 * Formate un prix en FCFA (ou autre devise).
 * Ex: formatPrice(150000, 'FCFA') → '150 000 FCFA'
 */
export function formatPrice(
  price: number | null,
  currency = 'FCFA',
  isCustomQuote = false,
): string {
  if (isCustomQuote || price === null) return 'Sur devis'
  return `${price.toLocaleString('fr-FR')} ${currency}`
}

/**
 * Formate une date ISO en français.
 * Ex: formatDate('2024-01-15T10:00:00Z') → '15 janv. 2024'
 */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString))
}

/**
 * Formate une date ISO avec heure.
 */
export function formatDateTime(isoString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString))
}

/**
 * Tronque un texte à une longueur donnée.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}
