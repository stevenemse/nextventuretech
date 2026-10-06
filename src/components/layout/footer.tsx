import Link from 'next/link'
import { MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react'
import { getSiteSettings } from '@/services/settings.service'
import { siteConfig } from '@/config/site'

const LINKS = {
  services: [
    { href: '/services#web-design',                label: 'Web Design' },
    { href: '/services#graphic-design',            label: 'Graphic Design' },
    { href: '/services#intelligence-artificielle', label: 'Intelligence Artificielle' },
    { href: '/services#montage-video',             label: 'Montage Vidéo' },
    { href: '/services#motion-design',             label: 'Motion Design' },
  ],
  company: [
    { href: '/realisations', label: 'Réalisations' },
    { href: '/tarifs',       label: 'Tarifs' },
    { href: '/blog',         label: 'Blog' },
    { href: '/contact',      label: 'Contact' },
    { href: '/reserver',     label: 'Réserver un Appel' },
  ],
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.122 1.527 5.856L0 24l6.335-1.502A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-1.93 0-3.733-.528-5.27-1.443l-.378-.224-3.924.93.997-3.82-.247-.393A9.81 9.81 0 012.182 12c0-5.415 4.403-9.818 9.818-9.818S21.818 6.585 21.818 12 17.415 21.818 12 21.818z" />
    </svg>
  )
}

export async function Footer() {
  const settings = await getSiteSettings()
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp
  const email = settings?.email ?? siteConfig.email
  const phone = settings?.phone ?? siteConfig.phone
  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}`

  return (
    <footer className="rounded-t-[2.5rem] bg-ink text-slate-400" aria-label="Pied de page">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        {/* ─── Bandeau CTA ─────────────────────────────────── */}
        <div className="relative mb-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-12 text-center shadow-glow sm:px-12">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Un projet en tête ? <span className="text-blue-200">Donnons-lui vie.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
              Obtenez votre devis gratuit en quelques minutes — réponse garantie sous 24h.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/reserver"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
              >
                Réserver un appel gratuit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <a
                href={`${waLink}?text=${encodeURIComponent("Bonjour NextVenture Tech, je souhaite discuter d'un projet.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ─── Colonnes ────────────────────────────────────── */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/nextventure-logo-dark.svg"
                alt="Logo NextVenture Tech"
                width={65}
                height={36}
                className="h-9 w-auto"
              />
              <span className="text-lg font-extrabold tracking-tight text-white">
                NextVenture <span className="text-blue-400">Tech</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              {siteConfig.slogan}. Votre partenaire digital à Douala, Cameroun.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Services</h3>
            <ul className="flex flex-col gap-2">
              {LINKS.services.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-blue-400">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Entreprise */}
          <nav aria-label="Entreprise">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Entreprise</h3>
            <ul className="flex flex-col gap-2">
              {LINKS.company.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-blue-400">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
            <address className="flex flex-col gap-3 text-sm not-italic">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <span>Douala, Cameroun</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <a href={`mailto:${email}`} className="break-all transition-colors hover:text-blue-400">{email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <a href={waLink} className="transition-colors hover:text-blue-400">{phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <span>Lun – Ven, 9h – 18h</span>
              </div>
            </address>
          </div>
        </div>

        {/* ─── Barre inférieure ────────────────────────────── */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs">© {new Date().getFullYear()} NextVenture Tech. Tous droits réservés.</p>
          <a
            href={`${waLink}?text=${encodeURIComponent("Bonjour NextVenture Tech, je souhaite discuter d'un projet.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-500"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Discuter sur WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
