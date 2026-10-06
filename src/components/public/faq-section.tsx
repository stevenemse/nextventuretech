'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const FAQ_ITEMS = [
  {
    q: 'Quels services propose NextVenture Tech ?',
    a: 'Nous proposons des services de développement web, de design graphique (logos, chartes graphiques), d\'intelligence artificielle (chatbots, recommandations), de montage vidéo et de motion design.',
  },
  {
    q: 'Où êtes-vous situés ?',
    a: 'Notre siège social est situé à Douala, Cameroun. Nous travaillons également avec des clients du monde entier.',
  },
  {
    q: 'Quel type de sites web pouvez-vous créer ?',
    a: 'Nous créons des sites web sur mesure, des boutiques en ligne (e-commerce), des sites vitrines et des plateformes interactives adaptées à vos besoins.',
  },
  {
    q: 'Quelle est la durée moyenne de développement ?',
    a: 'La durée dépend de la complexité du projet. En général, comptez entre 2 et 8 semaines pour un site web, selon les fonctionnalités requises.',
  },
  {
    q: 'Offrez-vous des services de maintenance ?',
    a: 'Oui, nous proposons des contrats de maintenance pour assurer que votre site reste à jour, sécurisé et performant sur le long terme.',
  },
  {
    q: 'Pouvez-vous intégrer un chatbot à mon site existant ?',
    a: 'Absolument. Nous pouvons intégrer un chatbot intelligent à votre site web actuel, quel que soit la technologie utilisée.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="bg-surface py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
            — FAQ
          </p>
          <h2 id="faq-heading" className="text-4xl font-extrabold tracking-tight text-ink">
            Questions <span className="text-blue-600">fréquentes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Tout ce que vous devez savoir avant de démarrer votre projet avec nous.
          </p>
        </div>

        <div className="reveal flex flex-col gap-3.5">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={cn(
                  'rounded-3xl border bg-white transition-all duration-300',
                  isOpen ? 'border-blue-200 shadow-soft' : 'border-border hover:border-blue-200/70',
                )}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-ink">{item.q}</span>
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                      isOpen ? 'bg-blue-600 text-white' : 'bg-blue-600/10 text-blue-600',
                    )}
                  >
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform duration-300', isOpen && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
