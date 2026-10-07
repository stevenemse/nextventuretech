/**
 * Composant JSON-LD générique — injecte un script ld+json.
 * Safe par défaut : jamais rendu côté client (composant serveur).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML est la seule façon d'injecter du JSON-LD
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
