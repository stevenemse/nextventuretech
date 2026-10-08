'use client'

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getDict, LANG_COOKIE } from './index'
import type { Lang, Dictionary } from './index'

interface LangContextValue {
  lang: Lang
  t: Dictionary
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  t: getDict('fr'),
  setLang: () => {},
})

/**
 * Fournit la langue aux Client Components (navbar, formulaires, FAQ…).
 * `initialLang` vient du Server Layout (cookie) — pas de flash de traduction.
 * Le changement écrit le cookie puis appelle router.refresh() pour
 * re-rendre les Server Components avec la nouvelle langue.
 */
export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang
  children: React.ReactNode
}) {
  const router = useRouter()

  const setLang = useCallback(
    (next: Lang) => {
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
      document.documentElement.lang = next
      router.refresh()
    },
    [router],
  )

  // Synchronise <html lang> au chargement (le SSR émet lang="fr" par défaut).
  useEffect(() => {
    document.documentElement.lang = initialLang
  }, [initialLang])

  const value = useMemo<LangContextValue>(
    () => ({ lang: initialLang, t: getDict(initialLang), setLang }),
    [initialLang, setLang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  return useContext(LangContext)
}
