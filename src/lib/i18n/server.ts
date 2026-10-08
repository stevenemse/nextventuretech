import { cookies } from 'next/headers'
import { getDict, DEFAULT_LANG, LANG_COOKIE } from './index'
import type { Lang, Dictionary } from './index'

export { LANG_COOKIE }

/**
 * Lit la langue courante depuis le cookie (côté serveur).
 * Défaut : FR. Utilisable dans les Server Components, generateMetadata
 * et les Server Actions.
 */
export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies()
  return cookieStore.get(LANG_COOKIE)?.value === 'en' ? 'en' : DEFAULT_LANG
}

/** Raccourci : langue + dictionnaire en une seule lecture. */
export async function getT(): Promise<{ lang: Lang; t: Dictionary }> {
  const lang = await getLang()
  return { lang, t: getDict(lang) }
}
