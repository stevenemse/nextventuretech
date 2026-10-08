'use client'

import { Asterisk } from 'lucide-react'

const ITEMS = [
  'Web Design', 'Graphic Design', 'Intelligence Artificielle',
  'Montage Vidéo', 'Motion Design', 'UX/UI Design',
  'E-Commerce', 'Chatbot IA', 'Branding', 'Logo Design',
]

export function ServicesMarquee() {
  // Dupliquer pour boucle infinie
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 py-4" aria-hidden="true">
      {/* Plus rapide qu'avant (30s → 20s) ; la barre se stoppe au survol de la souris */}
      <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-7 text-sm font-extrabold uppercase tracking-widest text-white">
            <Asterisk className="h-5 w-5 text-blue-200" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
