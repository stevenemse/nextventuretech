'use client'

import { useEffect, useRef } from 'react'
import { Phone } from 'lucide-react'

interface Props {
  url: string
}

export function CalendlyWidget({ url }: Props) {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true

    // Charger le script Calendly
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget w-full"
      data-url={url}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}

export function CalendlyFallback({ whatsapp, phone }: { whatsapp: string; phone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <Phone className="h-8 w-8 text-blue-600" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Planifiez votre appel</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Le calendrier en ligne est temporairement indisponible. Contactez-nous directement
        pour planifier votre appel gratuit.
      </p>
      <a
        href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Bonjour, je souhaite réserver un appel avec NextVenture Tech.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
        Réserver via WhatsApp
      </a>
      <p className="mt-4 text-sm text-slate-500">
        Ou appelez-nous : <a href={`tel:${phone}`} className="text-blue-600 hover:underline">{phone}</a>
      </p>
    </div>
  )
}
