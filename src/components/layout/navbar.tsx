'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '/',             label: 'Accueil' },
  { href: '/services',     label: 'Services' },
  { href: '/tarifs',       label: 'Tarifs' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/blog',         label: 'Blog' },
  { href: '/contact',      label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4" aria-label="Navigation principale">
      <nav
        className={cn(
          'mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border px-4 pl-5 transition-all duration-300',
          scrolled || isOpen
            ? 'border-border bg-white/90 shadow-soft backdrop-blur-xl'
            : 'border-transparent bg-white/60 backdrop-blur-md',
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
          {NAV_LINKS.map(({ href, label }) => {
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
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/reserver"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Démarrer un projet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Burger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menu mobile — carte blanche arrondie */}
      {isOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-3xl border border-border bg-white/95 p-3 shadow-soft backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block rounded-2xl px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600/10 font-semibold text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-ink',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
            <li className="mt-1">
              <Link
                href="/reserver"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
              >
                Démarrer un projet
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
