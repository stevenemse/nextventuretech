import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostById } from '@/services/blog.service'
import { PageHeader } from '@/components/admin/page-header'
import { BlogPostForm } from '../blog-post-form'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(id)
  return { title: post ? `Modifier — ${post.title}` : 'Article introuvable' }
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <div className="max-w-3xl">
      <PageHeader title={`Modifier — ${post.title}`} backHref="/admin/blog" />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <BlogPostForm post={post} />
      </div>
    </div>
  )
}