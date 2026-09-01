'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { toggleServicePublished, deleteServiceAction } from '@/app/actions/services'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

interface Props {
  serviceId: string
  isPublished: boolean
}

export function ServiceRowActions({ serviceId, isPublished }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  function handleToggle(checked: boolean) {
    startTransition(() => { void toggleServicePublished(serviceId, checked) })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteServiceAction(serviceId)
      setShowDelete(false)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={isPublished}
        onCheckedChange={handleToggle}
        disabled={isPending}
        aria-label={isPublished ? 'Dépublier' : 'Publier'}
      />
      <Button asChild variant="ghost" size="icon" aria-label="Modifier">
        <Link href={`/admin/services/${serviceId}`}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        variant="ghost" size="icon"
        className="text-red-500 hover:text-red-700"
        aria-label="Supprimer"
        onClick={() => setShowDelete(true)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Supprimer le service ?"
        description="Cette action est irréversible. Les plans tarifaires associés seront également supprimés."
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        loading={isPending}
      />
    </div>
  )
}
