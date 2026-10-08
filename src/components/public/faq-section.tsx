'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useLang } from '@/lib/i18n/context'

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useLang()
  const FAQ_ITEMS = t.faq.items

  return (
    <section className="bg-surface py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-14 text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-background px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700">
            {t.faq.badge}
          </p>
          <h2 id="faq-heading" className="text-4xl font-extrabold tracking-tight text-ink">
            {t.faq.title1} <span className="text-blue-600">{t.faq.title2}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">{t.faq.subtitle}</p>
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
