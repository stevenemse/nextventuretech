'use server'

import { requireAdmin } from '@/lib/auth/guards'
import { uploadImage } from '@/services/storage.service'
import type { ActionResult } from '@/types/actions'

interface UploadData { url: string }

/**
 * Server Action : upload d'une image (admin uniquement).
 * Validation de taille + type côté serveur.
 */
export async function uploadImageAction(
  folder: 'services' | 'works' | 'settings',
  _prev: ActionResult<UploadData>,
  formData: FormData,
): Promise<ActionResult<UploadData>> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const file = formData.get('file')

  if (!(file instanceof File) || file.size === 0) {
    return { status: 'error', message: 'Aucun fichier fourni.' }
  }

  try {
    const result = await uploadImage(file, folder)
    return { status: 'success', message: 'Image uploadée.', data: { url: result.url } }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur upload.'
    return { status: 'error', message: msg }
  }
}
