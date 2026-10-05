'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, ExternalLink } from 'lucide-react'
import { toggleBlogPostPublished, deleteBlogPostAction } from '@/app/actions/blog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

interface Props { postId: string; isPublished: boolean; slug: string }

export function BlogRowActions({ postId, isPublished, slug }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isPublished}
        onCheckedChange={(v) => startTransition(() => { void toggleBlogPostPublished(postId, v) })}
        disabled={isPending}
        aria-label={isPublished ? 'Dépublier' : 'Publier'}
      />
      {isPublished && (
        <Button asChild variant="ghost" size="icon" aria-label="Voir l'article">
          <Link href={`/blog/${slug}`} target="_blank">
            <ExternalLink className="h-4 w-4 text-slate-400" />
          </Link>
        </Button>
      )}
      <Button asChild variant="ghost" size="icon" aria-label="Modifier">
        <Link href={`/admin/blog/${postId}`}><Pencil className="h-4 w-4" /></Link>
      </Button>
      <Button
        variant="ghost" size="icon" className="text-red-500 hover:text-red-700"
        onClick={() => setShowDelete(true)} disabled={isPending} aria-label="Supprimer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={showDelete} onOpenChange={setShowDelete}
        title="Supprimer l&apos;article ?"
        description="Cette action est irréversible. L'article sera définitivement supprimé."
        confirmLabel="Supprimer"
        onConfirm={() => startTransition(async () => { await deleteBlogPostAction(postId); setShowDelete(false) })}
        loading={isPending}
      />
    </div>
  )
}
