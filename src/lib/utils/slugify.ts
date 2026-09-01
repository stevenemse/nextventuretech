/**
 * Génère un slug URL-safe depuis un texte.
 * Ex: slugify('Web Design & E-Commerce') → 'web-design-e-commerce'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .replace(/[^a-z0-9\s-]/g, '')    // supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-')            // espaces → tirets
    .replace(/-+/g, '-')             // tirets multiples → un seul
}
