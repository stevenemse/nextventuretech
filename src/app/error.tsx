'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log de l'erreur — en prod, utiliser Sentry ou équivalent
    console.error('[GlobalError]', error.message)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0f1e] px-4 text-center">
      <p className="text-7xl font-extrabold text-red-500 opacity-30 select-none" aria-hidden="true">500</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Une erreur est survenue</h1>
      <p className="mt-3 text-slate-400 max-w-md">
        Nous avons rencontré un problème inattendu. Notre équipe a été notifiée.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Accueil
        </Link>
      </div>
    </div>
  )
}
