'use client'

import { Star } from 'lucide-react'

const ITEMS = [
  'Web Design', 'Graphic Design', 'Intelligence Artificielle',
  'Montage Vidéo', 'Motion Design', 'UX/UI Design',
  'E-Commerce', 'Chatbot IA', 'Branding', 'Logo Design',
]

export function ServicesMarquee() {
  // Dupliquer pour boucle infinie
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden bg-blue-600 py-3" aria-hidden="true">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6 text-sm font-medium text-white">
            <Star className="h-3 w-3 fill-white" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
