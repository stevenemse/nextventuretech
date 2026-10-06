import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { Work } from '@/types/database'

interface WorkCardProps {
  work: Work
}

const INNER = ({ work }: WorkCardProps) => (
  <>
    {/* Image */}
    {work.image_url ? (
      <Image
        src={work.image_url}
        alt={work.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900" />
    )}

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

    {/* Bouton flèche */}
    <div className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:-translate-y-1">
      <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
    </div>

    {/* Contenu */}
    <div className="absolute bottom-0 left-0 right-0 p-6 pr-20">
      {work.category && (
        <span className="mb-2.5 inline-block rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {work.category}
        </span>
      )}
      <h3 className="text-lg font-extrabold leading-tight tracking-tight text-white">{work.title}</h3>
      {work.partner && <p className="mt-1 text-xs text-slate-300">{work.partner}</p>}
    </div>
  </>
)

export function WorkCard({ work }: WorkCardProps) {
  const base = 'group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-ink shadow-soft transition-shadow duration-300 hover:shadow-card'

  if (work.project_url) {
    return (
      <a
        href={work.project_url}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        aria-label={`Voir le projet : ${work.title}`}
      >
        <INNER work={work} />
      </a>
    )
  }

  return (
    <div className={base} role="article" aria-label={work.title}>
      <INNER work={work} />
    </div>
  )
}
