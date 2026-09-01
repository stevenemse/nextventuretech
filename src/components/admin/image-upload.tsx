'use client'

import { useActionState, useRef, useState } from 'react'
import Image from 'next/image'
import { X, ImageIcon } from 'lucide-react'
import { uploadImageAction } from '@/app/actions/upload'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { initialActionState } from '@/types/actions'
import type { ActionResult } from '@/types/actions'
import { cn } from '@/lib/utils/cn'

interface ImageUploadProps {
  folder: 'services' | 'works' | 'settings'
  currentUrl?: string | null
  /** Nom du champ hidden qui reçoit l'URL finale */
  fieldName?: string
  label?: string
}

export function ImageUpload({
  folder, currentUrl, fieldName = 'image_url', label = 'Image',
}: ImageUploadProps) {
  const boundAction = uploadImageAction.bind(null, folder)
  const [state, formAction, pending] = useActionState<ActionResult<{ url: string }>, FormData>(
    boundAction, initialActionState,
  )

  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const finalUrl = state.status === 'success' && state.data
    ? state.data.url
    : preview

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
    // Soumettre automatiquement
    const fd = new FormData()
    fd.append('file', file)
    formAction(fd)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>

      {/* Zone drag & drop */}
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors',
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400',
          pending && 'opacity-60 pointer-events-none',
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
      >
        {finalUrl ? (
          <div className="relative w-full aspect-video max-w-xs">
            <Image src={finalUrl} alt="Aperçu" fill className="object-contain rounded-lg" />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              aria-label="Supprimer l'image"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-sm text-slate-500 text-center">
              Glissez une image ici ou{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => fileRef.current?.click()}
              >
                parcourez
              </button>
            </p>
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP, GIF — max 5 MB</p>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          aria-label="Choisir une image"
        />
      </div>

      {pending && (
        <p className="text-xs text-blue-600 animate-pulse">Upload en cours…</p>
      )}

      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      {/* Champ caché contenant l'URL finale */}
      <input type="hidden" name={fieldName} value={finalUrl ?? ''} />

      {/* Ou saisir une URL manuellement */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">Ou entrer une URL :</span>
        <Input
          type="url"
          placeholder="https://…"
          className="text-xs h-7"
          value={finalUrl ?? ''}
          onChange={(e) => setPreview(e.target.value)}
        />
      </div>
    </div>
  )
}
