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
    <section className="py-20 bg-[#f7f7f3]" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 mb-2"><span aria-hidden="true">&#47;&#47;</span> FAQ</p>
          <h2 id="faq-heading" className="text-3xl font-extrabold text-slate-900">
            Questions <span className="text-blue-600">fréquentes</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-medium text-slate-900 pr-4">{item.q}</span>
                <ChevronDown
                  className={cn('h-5 w-5 shrink-0 text-blue-600 transition-transform duration-200', open === i && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
