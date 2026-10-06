import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Connexion Admin',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1e] p-4">
      {/* Décorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-800/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Bouton retour accueil */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au site
        </Link>

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/nextventure-logo-dark.svg"
            alt="Logo NextVenture Tech"
            width={95}
            height={52}
            className="mb-3 h-13 w-auto"
          />
          <h1 className="text-2xl font-bold text-white">NextVenture Tech</h1>
          <p className="mt-1 text-sm text-slate-400">Dashboard Administrateur</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-semibold text-white">Connexion</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
