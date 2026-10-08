/**
 * Configuration publique du site — valeurs par défaut.
 * Les valeurs administrables (logo, WhatsApp, Calendly…) sont lues
 * depuis la table `site_settings` en base. Ce fichier contient les
 * constantes non administrables et les fallbacks.
 */
export const siteConfig = {
  name: 'NextVenture Tech',
  slogan: 'Transformer vos idées en réalité',
  description:
    'NextVenture Tech — Développement web, design graphique et solutions IA. Chaque client, une nouvelle aventure.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nextventuretech.com',
  email: 'nextventuretech237@gmail.com',
  phone: '+237 6 86 03 37 89',
  whatsapp: '+237686033789',
  location: 'Douala, Cameroun',
  hours: 'Lundi – Vendredi, 9h – 18h',
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
  },
} as const
