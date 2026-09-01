import 'server-only'

import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase avec service-role key — bypass RLS.
 * À utiliser UNIQUEMENT pour les opérations administratives côté serveur
 * qui nécessitent de bypasser RLS (ex: seed, migrations, webhooks signés).
 *
 * ATTENTION : Ne jamais exposer ce client côté navigateur.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY est manquant. ' +
      'Cette clé est requise pour les opérations admin.',
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
