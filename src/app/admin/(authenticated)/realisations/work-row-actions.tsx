'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { toggleWorkPublished, deleteWorkAction } from '@/app/actions/works'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

export function WorkRowActions({ workId, isPublished }: { workId: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={isPublished}
        onCheckedChange={(v) => startTransition(() => { void toggleWorkPublished(workId, v) })}
        disabled={isPending}
        aria-label={isPublished ? 'Dépublier' : 'Publier'}
      />
      <Button asChild variant="ghost" size="icon" aria-label="Modifier">
        <Link href={`/admin/realisations/${workId}`}><Pencil className="h-4 w-4" /></Link>
      </Button>
      <Button
        variant="ghost" size="icon" className="text-red-500 hover:text-red-700"
        onClick={() => setShowDelete(true)} disabled={isPending} aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={showDelete} onOpenChange={setShowDelete}
        title="Supprimer la réalisation ?"
        description="Cette action est irréversible."
        confirmLabel="Supprimer"
        onConfirm={() => startTransition(async () => { await deleteWorkAction(workId); setShowDelete(false) })}
        loading={isPending}
      />
    </div>
  )
}
