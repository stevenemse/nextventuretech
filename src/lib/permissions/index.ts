import 'server-only'

import { createClient } from '@/lib/supabase/server'

/**
 * Vérifie si l'utilisateur courant est admin.
 * Utilise la table `user_roles` côté serveur.
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return data?.role === 'admin'
}

/**
 * Liste des routes qui ne nécessitent pas d'authentification.
 */
export const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/tarifs',
  '/realisations',
  '/contact',
  '/reserver',
] as const
