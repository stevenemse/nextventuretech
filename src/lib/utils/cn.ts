import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine des classes Tailwind en résolvant les conflits.
 * Utilisation : cn('px-4', condition && 'text-blue-500', 'px-2')
 * → 'text-blue-500 px-2'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
