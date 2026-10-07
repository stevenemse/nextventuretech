'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  InboxIcon,
  Layers,
  BriefcaseBusiness,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { signOutAction } from '@/app/actions/auth'

const navItems = [
  { href: '/admin/demandes',     label: 'Demandes',      icon: InboxIcon },
  { href: '/admin/services',     label: 'Services',      icon: Layers },
  { href: '/admin/realisations', label: 'Réalisations',  icon: BriefcaseBusiness },
  { href: '/admin/tarifs',       label: 'Tarifs',        icon: Tag },
  { href: '/admin/parametres',   label: 'Paramètres',    icon: Settings },
]

interface AdminSidebarProps {
  pendingCount?: number
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  // La sidebar mobile se ferme automatiquement à la navigation :
  // mémoriser le pathname au rendu (pattern « adjust state during render »)
  const [lastPath, setLastPath] = useState(pathname)
  const [open, setOpen] = useState(false)

  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }

  return (
    <>
      {/* Bouton hamburger — mobile uniquement, figure fixe au-dessus du contenu */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Overlay — mobile uniquement */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* En-tête */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <LayoutDashboard className="h-5 w-5 text-blue-600" aria-hidden="true" />
          <span className="font-bold text-slate-900">NVT Admin</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Navigation admin">
          <ul className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname.startsWith(href)
              const showBadge = href === '/admin/demandes' && pendingCount > 0

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {showBadge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="border-t border-slate-200 p-4">
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
