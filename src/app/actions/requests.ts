'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'
import {
  updateWorkRequestStatus,
  deleteWorkRequest,
} from '@/services/requests.service'
import type { WorkRequestStatus } from '@/types/database'
import type { ActionResult } from '@/types/actions'

/**
 * Changer le statut d'une demande (admin).
 */
export async function changeRequestStatus(
  id: string,
  status: WorkRequestStatus,
): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  const validStatuses: WorkRequestStatus[] = [
    'pending', 'accepted', 'in_progress', 'completed', 'refused',
  ]
  if (!validStatuses.includes(status)) {
    return { status: 'error', message: 'Statut invalide.' }
  }

  try {
    await updateWorkRequestStatus(id, status)
    revalidatePath('/admin/demandes')
    return { status: 'success', message: 'Statut mis à jour.' }
  } catch (err) {
    console.error('[changeRequestStatus]', err)
    return { status: 'error', message: 'Erreur lors de la mise à jour.' }
  }
}

/**
 * Supprimer une demande (admin).
 */
export async function removeRequest(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { status: 'error', message: 'Non autorisé.' }
  }

  try {
    await deleteWorkRequest(id)
    revalidatePath('/admin/demandes')
    return { status: 'success', message: 'Demande supprimée.' }
  } catch (err) {
    console.error('[removeRequest]', err)
    return { status: 'error', message: 'Erreur lors de la suppression.' }
  }
}
