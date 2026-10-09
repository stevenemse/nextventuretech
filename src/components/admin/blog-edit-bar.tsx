'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, ExternalLink } from 'lucide-react'

/**
 * Barre d'édition « à la WordPress » : affichée en bas de l'écran
 * sur /blog et /blog/[slug] uniquement si un admin est connecté
 * (le rendu serveur décide ; ce composant est purement visuel).
 */
export function BlogEditBar({ postId }: { postId?: string }) {
  const router = useRouter()

  return (
    <div
      aria-label="Barre d'édition administrateur"
      className="fixed inset-x-0 bottom-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-t-2xl border border-b-0 border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgb(0_0_0/0.08)] backdrop-blur sm:px-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">Mode administration — vous voyez le site comme un visiteur</span>
          <span className="sm:hidden">Mode admin</span>
        </div>

        <div className="flex items-center gap-2">
          {postId && (
            <Link
              href={`/admin/blog/${postId}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Éditer cet article
            </Link>
          )}
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Gérer les articles
          </Link>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700"
          >
            Rafraîchir
          </button>
        </div>
      </div>
    </div>
  )
}
