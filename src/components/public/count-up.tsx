'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '@/lib/i18n/context'

interface CountUpProps {
  /** Valeur textuelle affichée, ex. « 50+ », « 4.8 », « 100 % ». */
  value: string
  className?: string
  /** Durée de l'animation en ms (défaut 1300). */
  duration?: number
}

interface Parsed {
  prefix: string
  suffix: string
  target: number
  decimals: number
}

/** Extrait le nombre d'une valeur textuelle ; null si non numérique. */
function parseValue(raw: string): Parsed | null {
  const match = raw.match(/^(\D*)(\d+(?:[.,]\d+)?)([\s\S]*)$/)
  if (!match) return null
  const prefix = match[1] ?? ''
  const numStr = match[2]
  const suffix = match[3] ?? ''
  if (!numStr) return null
  const normalized = numStr.replace(',', '.')
  const target = Number.parseFloat(normalized)
  if (Number.isNaN(target)) return null
  const dot = normalized.indexOf('.')
  const decimals = dot === -1 ? 0 : normalized.length - dot - 1
  return { prefix, suffix, target, decimals }
}

/**
 * Compteur animé : la valeur s'incrémente de 0 à la cible quand
 * l'élément entre dans le viewport (ease-out cubic).
 * Sans JS / avant hydratation, la valeur finale est affichée (SSR-safe).
 * prefers-reduced-motion → pas d'animation.
 */
export function CountUp({ value, className, duration = 1300 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const { lang } = useLang()
  const locale = lang === 'fr' ? 'fr-FR' : 'en-US'

  const parsed = useMemo(() => parseValue(value), [value])

  useEffect(() => {
    const el = ref.current
    if (!el || !parsed) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let started = false

    const format = (n: number) =>
      n.toLocaleString(locale, {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })

    const run = () => {
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration)
        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
        setDisplay(`${parsed.prefix}${format(parsed.target * eased)}${parsed.suffix}`)
        if (progress < 1) {
          raf = requestAnimationFrame(tick)
        } else {
          setDisplay(value) // valeur finale exacte (format d'origine)
        }
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true
            run()
            observer.disconnect()
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [parsed, value, duration, locale])

  return (
    <span ref={ref} className={className} aria-label={value}>
      {display}
    </span>
  )
}
