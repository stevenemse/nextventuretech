import type { Metadata } from 'next'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { getPublishedServices } from '@/services/services.service'
import { getSiteSettings } from '@/services/settings.service'
import { siteConfig } from '@/config/site'
import { ContactForm } from './contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez NextVenture Tech pour discuter de votre projet digital.',
}

export default async function ContactPage() {
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

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0a0f1e] pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400 mb-3"><span aria-hidden="true">&#47;&#47;</span> Contact</p>
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Obtenez votre devis <span className="text-blue-400">gratuit</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Répondons à votre message sous 24h. Discutons de votre projet !
          </p>
        </div>
      </section>

      {/* Corps */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Infos contact */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Nos coordonnées</h2>
              <div className="flex flex-col gap-6">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-slate-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Décrivez votre projet</h2>
              <ContactForm services={services.map((s) => ({ id: s.id, title: s.title }))} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
