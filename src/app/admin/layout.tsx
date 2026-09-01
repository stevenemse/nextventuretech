import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Dashboard Admin', template: '%s | Admin — NextVenture Tech' },
  robots: { index: false, follow: false },
}

/**
 * Layout racine admin — minimal, sans vérification auth.
 * La vérification est dans (authenticated)/layout.tsx
 * pour éviter la boucle de redirection sur /admin/login.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
