import type { Metadata } from 'next'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getSiteSettings } from '@/services/settings.service'
import { siteConfig } from '@/config/site'
import { ContactForm } from './contact-form'
import { Reveal } from '@/components/public/reveal'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez NextVenture Tech pour discuter de votre projet digital.',
}

interface Props {
  searchParams: Promise<{ service?: string; plan?: string }>
}

export default async function ContactPage({ searchParams }: Props) {
  const [services, settings] = await Promise.all([
    getPublishedServices(),
    getSiteSettings(),
  ])

  const phone = settings?.phone ?? siteConfig.phone
  const email = settings?.email ?? siteConfig.email
  const whatsapp = settings?.whatsapp ?? siteConfig.whatsapp

  const contactInfo = [
    { icon: MapPin, label: 'Adresse', value: 'Douala, Cameroun' },
    { icon: Mail,   label: 'Email',   value: email, href: `mailto:${email}` },
    { icon: Phone,  label: 'WhatsApp', value: phone,
      href: `https://wa.me/${whatsapp.replace(/\D/g, '')}` },
    { icon: Clock,  label: 'Horaires', value: 'Lun – Ven, 9h – 18h' },
  ]

  const { service: serviceParam, plan: planParam } = await searchParams

  return (
    <>
      {/* Hero clair */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] to-background pb-16 pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(43 92 246 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(43 92 246 / 0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
            — Contact
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            Obtenez votre devis <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">gratuit</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Répondons à votre message sous 24h. Discutons de votre projet !
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="grid gap-10 lg:grid-cols-5">
            {/* Infos contact — cartes 2x2 */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-extrabold tracking-tight text-ink">Nos coordonnées</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <Reveal
                    key={label}
                    delay={150}
                    className="min-w-0 rounded-3xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-soft">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-0.5 block text-sm font-bold break-words text-ink [overflow-wrap:anywhere] transition-colors hover:text-blue-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-bold break-words text-ink [overflow-wrap:anywhere]">{value}</p>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Formulaire — prérempli si l'utilisateur vient d'un service ou d'un plan tarifaire */}
            <div className="lg:col-span-3">
              <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-9">
                <h2 className="mb-7 text-2xl font-extrabold tracking-tight text-ink">
                  Décrivez votre projet
                </h2>
                <ContactForm
                  services={services.map((s) => ({ id: s.id, title: s.title }))}
                  presetService={serviceParam}
                  presetPlan={planParam}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
