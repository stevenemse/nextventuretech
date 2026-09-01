/**
 * Types partagés pour toutes les Server Actions.
 * Compatible avec React useActionState (remplace useFormState).
 */

export type ActionStatus = 'idle' | 'success' | 'error'

/**
 * Résultat standard d'une Server Action.
 * T = données retournées en cas de succès.
 */
export type ActionResult<T = undefined> =
  | { status: 'success'; message: string; data?: T }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }

/**
 * État initial pour useActionState.
 */
export const initialActionState: ActionResult = {
  status: 'error',
  message: '',
}
