'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Client Supabase pour le navigateur.
 * Utilise uniquement la clé anon — jamais la service-role key.
 * Appelé depuis les Client Components uniquement.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
