import type { Metadata } from 'next'
import { PageHeader } from '@/components/admin/page-header'
import { BlogPostForm } from '../blog-post-form'

export const metadata: Metadata = { title: 'Nouvel article' }

export default function NouvelArticlePage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Nouvel article" backHref="/admin/blog" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <BlogPostForm />
      </div>
    </div>
  )
}
