import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllPosts } from '@/services/blog.service'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/utils/format'
import { BlogRowActions } from './blog-row-actions'

export const metadata: Metadata = { title: 'Blog' }

export default async function AdminBlogPage() {
  const { data: posts, count } = await getAllPosts()

  return (
    <div>
      <PageHeader
        title="Blog"
        description={`${count} article${count > 1 ? 's' : ''}`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/blog/nouveau">
              <Plus className="h-4 w-4" aria-hidden="true" /> Nouvel article
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Aucun article.{' '}
          <Link href="/admin/blog/nouveau" className="text-blue-600 hover:underline">
            Rédiger le premier
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Titre</th>
                <th className="px-4 py-3 text-left font-medium">Catégorie</th>
                <th className="px-4 py-3 text-left font-medium">Statut</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900 max-w-xs truncate">{post.title}</div>
                    <div className="text-xs text-slate-400 font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{post.category ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={post.is_published ? 'success' : 'secondary'}>
                      {post.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                    {post.published_at
                      ? formatDateTime(post.published_at)
                      : formatDateTime(post.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <BlogRowActions postId={post.id} isPublished={post.is_published} slug={post.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
