'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/types/actions'

/**
 * Connexion administrateur via Supabase Auth.
 */
export async function signInAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { status: 'error', message: 'Email et mot de passe requis.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Ne pas exposer le détail de l'erreur (énumération de comptes)
    return {
      status: 'error',
      message: 'Email ou mot de passe incorrect.',
    }
  }

  redirect('/admin/demandes')
}

/**
 * Déconnexion.
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
