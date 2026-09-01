import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page introuvable — 404',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1e] px-4 text-center">
      <p className="text-8xl font-extrabold text-blue-600 opacity-30 select-none" aria-hidden="true">404</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Page introuvable</h1>
      <p className="mt-3 text-slate-400">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
