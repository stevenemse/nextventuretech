import 'server-only'

import { createClient } from '@/lib/supabase/server'

const BUCKET = 'images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

export interface UploadResult {
  url: string
  path: string
}

/**
 * Valide un fichier image avant upload.
 * Vérifié côté serveur — ne pas faire confiance au client.
 */
export function validateImageFile(
  file: File,
): { valid: true } | { valid: false; error: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024} MB).` }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `Type non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF.` }
  }

  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Extension non autorisée.` }
  }

  return { valid: true }
}

/**
 * Upload une image dans Supabase Storage.
 * Retourne l'URL publique.
 */
export async function uploadImage(
  file: File,
  folder: 'services' | 'works' | 'settings',
): Promise<UploadResult> {
  const validation = validateImageFile(file)
  if (!validation.valid) throw new Error(validation.error)

  const supabase = await createClient()
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const path = `${folder}/${timestamp}-${random}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw new Error(`Upload échoué : ${error.message}`)

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  return { url: urlData.publicUrl, path }
}

/**
 * Supprime une image depuis Supabase Storage.
 * Extrait le path depuis une URL publique Supabase.
 */
export async function deleteImage(urlOrPath: string): Promise<void> {
  const supabase = await createClient()

  // Extraire le chemin si c'est une URL complète
  let path = urlOrPath
  const match = urlOrPath.match(/\/storage\/v1\/object\/public\/images\/(.+)$/)
  if (match?.[1]) path = match[1]

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.warn(`deleteImage: ${error.message}`)
}
