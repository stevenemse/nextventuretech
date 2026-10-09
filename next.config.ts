import type { NextConfig } from 'next'

const SECURITY_HEADERS = [
  { key: 'X-Frame-Options',        value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // CSP: bloquer les iframes externes non autorisées, autoriser Calendly
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      "img-src 'self' data: blob: https: http://localhost:3000 https://woofxjcanpgnxjuqtrna.supabase.co https://i.pinimg.com https://*.calendly.com",
      "frame-src https://calendly.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.calendly.com",
      "font-src 'self' data:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'woofxjcanpgnxjuqtrna.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      /* Images hébergées ailleurs (ex: réalisation ETS City Pax avec une photo Pinterest).
         Preferé le Storage Supabase pour les nouveaux contenus. */
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      { source: '/(.*)', headers: SECURITY_HEADERS },
    ]
  },
}

export default nextConfig
