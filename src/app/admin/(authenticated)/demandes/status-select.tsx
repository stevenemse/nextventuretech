'use client'

import { useTransition } from 'react'
import { changeRequestStatus } from '@/app/actions/requests'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { WorkRequestStatus } from '@/types/database'
import { STATUS_LABELS } from '@/components/admin/status-badge'

const VALID_STATUSES: WorkRequestStatus[] = [
  'pending', 'accepted', 'in_progress', 'completed', 'refused',
]

interface StatusSelectProps {
  requestId: string
  currentStatus: WorkRequestStatus
}

export function StatusSelect({ requestId, currentStatus }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string) {
    startTransition(async () => {
      await changeRequestStatus(requestId, value as WorkRequestStatus)
    })
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-40" aria-label="Changer le statut">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {VALID_STATUSES.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
