'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Animation d'apparition au scroll, compatible avec tous les navigateurs.
 *
 * - Chrome/Edge/Safari 26+ : l'API CSS `animation-timeline: view()` native
 *   s'applique seule (cf. globals.css) — ce composant n'a rien à faire.
 * - Anciens navigateurs : IntersectionObserver ajoute la classe `is-visible`
 *   au premier passage dans le viewport (fallback `.reveal-observer`).
 * - `prefers-reduced-motion` est respecté dans les deux cas via globals.css.
 *
 * Props :
 * - `delay` : délai en ms (effet cascade entre plusieurs cartes)
 * - `once`  : l'animation ne joue qu'une fois (défaut true)
 */
interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  id?: string
  once?: boolean
  style?: CSSProperties
  ariaLabel?: string
}

export function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Si le navigateur supporte animation-timeline: view(), le CSS pur suffit
    if (CSS.supports?.('animation-timeline', 'view()')) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            if (once) observer.unobserve(el)
          } else if (!once) {
            el.classList.remove('is-visible')
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const mergedStyle = {
    ...(delay > 0 ? { '--reveal-delay': `${delay}ms` } : {}),
    ...style,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={cn('reveal-observer reveal', className)}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </div>
  )
}

/** Variante inline (span) pour révéler des éléments dans le flux de texte. */
export function RevealInline({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if ((CSS as { supports?: (a: string, b: string) => boolean }).supports?.('animation-timeline', 'view()')) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible')
            observer.unobserve(el)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      className={cn('reveal-observer reveal inline-block', className)}
      style={delay > 0 ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </span>
  )
}
