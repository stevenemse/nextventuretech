'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LANGS } from '@/lib/i18n'
import { useLang } from '@/lib/i18n/context'

const NAV_LINKS = [
  { href: '/',             key: 'home' },
  { href: '/services',     key: 'services' },
  { href: '/tarifs',       key: 'pricing' },
  { href: '/realisations', key: 'work' },
  { href: '/blog',         key: 'blog' },
  { href: '/contact',      key: 'contact' },
] as const

/** Sélecteur de langue FR/EN — compact, toujours visible (desktop + mobile). */
function LanguageSwitch() {
  const { lang, t, setLang } = useLang()

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-slate-200/80 bg-white/70 p-0.5"
      role="group"
      aria-label={t.lang.switchLabel}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide transition-colors',
            lang === l
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-ink',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLang()
  const [isOpen, setIsOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4" aria-label={t.nav.label}>
      <nav
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 rounded-full border px-4 pl-5 transition-all duration-300',
          scrolled || isOpen
            ? 'border-border bg-white shadow-soft'
            : 'border-transparent bg-white',
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/nextventure-logo-light.svg"
            alt="Logo NextVenture Tech"
            width={65}
            height={36}
            className="h-8 w-auto sm:h-9"
          />
          <span className="text-base font-extrabold tracking-tight text-ink">
            NextVenture <span className="text-blue-600">Tech</span>
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {NAV_LINKS.map(({ href, key }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-blue-600/10 font-semibold text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {t.nav.links[key]}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Langue + CTA Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitch />
          <Link
            href="/reserver"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            {t.nav.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Langue + Burger — mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch />
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-slate-100"
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Rideau sombre derrière le menu mobile — bloque le contenu en dessous */}
      {isOpen && (
        <button
          type="button"
          aria-label={t.nav.closeMenu}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 -z-10 cursor-default bg-ink/40 md:hidden"
        />
      )}

      {/* Menu mobile — carte blanche opaque */}
      {isOpen && (
        <div className="mx-auto mt-2 max-h-[calc(100dvh-7rem)] max-w-6xl overflow-y-auto rounded-3xl border border-border bg-white p-3 shadow-soft md:hidden">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ href, key }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block rounded-2xl px-4 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600/10 font-semibold text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t.nav.links[key]}
                  </Link>
                </li>
              )
            })}
            <li className="mt-1">
              <Link
                href="/reserver"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-600"
              >
                {t.nav.cta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
