import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Vérifie que l'utilisateur est authentifié.
 * Redirige vers /admin/login si non connecté.
 */
export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  return user
}

/**
 * Vérifie que l'utilisateur est administrateur.
 * La vérification se fait côté serveur via la table `user_roles`.
 * NE JAMAIS faire confiance à un rôle envoyé par le frontend.
 */
export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/admin/login')
  }

  const { data: role, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (roleError || !role || role.role !== 'admin') {
    redirect('/admin/login')
  }

  return user
}

/**
 * Retourne l'utilisateur courant sans redirection.
 * Retourne null si non authentifié.
 */
export async function getOptionalUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Vérifie le rôle admin SANS redirection (usage côté rendu public).
 */
export async function isAdminUser(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return role?.role === 'admin'
}
