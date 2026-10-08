import { fr } from './dictionaries/fr'
import type { Dictionary } from './dictionaries/fr'
import { en } from './dictionaries/en'

export type Lang = 'fr' | 'en'
export const LANGS: Lang[] = ['fr', 'en']
export const DEFAULT_LANG: Lang = 'fr'

/** Cookie de langue (partagé client/serveur — ce module est sans dépendance serveur). */
export const LANG_COOKIE = 'nvt_lang'

export const dictionaries = { fr, en }
export type { Dictionary }

/** Retourne le dictionnaire complet pour une langue donnée. */
export function getDict(lang: Lang): Dictionary {
  return dictionaries[lang] ?? dictionaries[DEFAULT_LANG]
}

/** Champs d'un service venu de la base de données. */
interface DbService {
  slug: string
  title: string
  description: string | null
  key_points: string[]
}

/**
 * Localise un service en base : la FR reste stockée en base (source de
 * vérité), l'EN est surchargée par `services.overrides[slug]` du dictionnaire.
 * Retourne le service inchangé si aucune surcharge n'existe.
 */
export function localizeService<T extends DbService>(svc: T, t: Dictionary): T {
  const override = t.services.overrides[svc.slug]
  if (!override) return svc
  return {
    ...svc,
    title: override.title,
    description: override.description,
    key_points: override.keyPoints,
  }
}
