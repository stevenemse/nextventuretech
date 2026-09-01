'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/',             label: 'Accueil' },
  { href: '/services',     label: 'Services' },
  { href: '/tarifs',       label: 'Tarifs' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/contact',      label: 'Contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer le menu mobile au changement de route
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600">
            <Zap className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold text-white">
            NextVenture <span className="text-blue-400">Tech</span>
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
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-blue-400'
                      : 'text-slate-300 hover:text-white',
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
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white border-0">
            <Link href="/reserver">Réserver un Appel</Link>
          </Button>
        </div>

        {/* Burger mobile */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:text-white md:hidden"
          onClick={() => setIsOpen((o) => !o)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Menu mobile */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#0a0f1e]/98 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col px-4 pb-4 pt-2" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block rounded-md px-3 py-3 text-sm font-medium',
                      isActive ? 'text-blue-400' : 'text-slate-300',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
            <li className="mt-3">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                <Link href="/reserver">Réserver un Appel</Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
