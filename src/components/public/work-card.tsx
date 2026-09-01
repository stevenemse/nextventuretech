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
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
    )}

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

    {/* Contenu */}
    <div className="absolute bottom-0 left-0 right-0 p-5">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-blue-400 mb-1">{work.category}</p>
          <h3 className="text-base font-bold text-white leading-tight">{work.title}</h3>
          {work.partner && (
            <p className="mt-1 text-xs text-slate-300">{work.partner}</p>
          )}
          {work.category && (
            <div className="mt-2">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                {work.category}
              </span>
            </div>
          )}
        </div>
        {work.project_url && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  </>
)

export function WorkCard({ work }: WorkCardProps) {
  const base = 'group relative overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] block'

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
