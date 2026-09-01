import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Connexion Admin',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Marque */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-600">NextVenture Tech</h1>
          <p className="mt-1 text-sm text-slate-500">Dashboard Administrateur</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">Connexion</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
