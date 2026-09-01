'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const NAV_LINKS = [
  { href: '/',             label: 'Accueil' },
  { href: '/services',     label: 'Services' },
  { href: '/tarifs',       label: 'Tarifs' },
  { href: '/realisations', label: 'Réalisations' },
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
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Zap className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            NextVenture <span className="text-blue-400">Tech</span>
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-0.5 md:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5',
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
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/reserver"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Réserver un Appel
          </Link>
        </div>

        {/* Burger */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors md:hidden"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#0a0f1e]/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1 px-4 pb-4 pt-2">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
            <li className="mt-2">
              <Link
                href="/reserver"
                className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Réserver un Appel
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
