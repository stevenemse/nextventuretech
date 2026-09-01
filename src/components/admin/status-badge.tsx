import { Badge } from '@/components/ui/badge'
import type { WorkRequestStatus } from '@/types/database'

const STATUS_CONFIG: Record<
  WorkRequestStatus,
  { label: string; variant: 'secondary' | 'warning' | 'default' | 'success' | 'destructive' }
> = {
  pending:     { label: 'En attente',  variant: 'warning' },
  accepted:    { label: 'Accepté',     variant: 'default' },
  in_progress: { label: 'En cours',    variant: 'default' },
  completed:   { label: 'Terminé',     variant: 'success' },
  refused:     { label: 'Refusé',      variant: 'destructive' },
}

export function StatusBadge({ status }: { status: WorkRequestStatus }) {
  const config = STATUS_CONFIG[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export const STATUS_LABELS: Record<WorkRequestStatus, string> = {
  pending:     'En attente',
  accepted:    'Accepté',
  in_progress: 'En cours',
  completed:   'Terminé',
  refused:     'Refusé',
}
