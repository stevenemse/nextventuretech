import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Fragment, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock,
  Tag,
} from 'lucide-react'
import {
  getPublishedPostBySlug,
  getAdjacentPosts,
} from '@/services/blog.service'
import type { BlogPost } from '@/types/database'
import { cn } from '@/lib/utils/cn'
import { JsonLd } from '@/components/seo/json-ld'
import { siteConfig } from '@/config/site'

type Params = Promise<{ slug: string }>

/* ─── SEO ───────────────────────────────────────────────────── */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return { title: 'Article introuvable' }

  return {
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? undefined,
      publishedTime: post.published_at ?? undefined,
      authors: [post.author],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

function readingTimeMinutes(content: string | null): number {
  if (!content) return 1
  const words = content.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Rendu inline : **gras** → <strong>. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={`${keyPrefix}-b-${i}`} className="font-extrabold text-ink">
        {part}
      </strong>
    ) : (
      <Fragment key={`${keyPrefix}-t-${i}`}>{part}</Fragment>
    ),
  )
}

/** Rendu Markdown léger : ##, ###, >, listes « - », paragraphes. */
function renderContent(content: string): ReactNode[] {
  const blocks = content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)

  return blocks.map((block, i) => {
    const key = `block-${i}`

    if (block.startsWith('### ')) {
      return (
        <h3 key={key} className="mt-10 text-xl font-extrabold tracking-tight text-ink">
          {renderInline(block.slice(4), key)}
        </h3>
      )
    }
    if (block.startsWith('## ')) {
      return (
        <h2 key={key} className="mt-12 text-2xl font-extrabold tracking-tight text-ink">
          {renderInline(block.slice(3), key)}
        </h2>
      )
    }
    if (block.startsWith('> ')) {
      return (
        <blockquote
          key={key}
          className="mt-8 rounded-2xl border-l-4 border-blue-600 bg-blue-600/5 px-6 py-5 text-lg font-medium leading-relaxed text-slate-700"
        >
          {renderInline(block.replace(/^> ?/gm, ''), key)}
        </blockquote>
      )
    }
    if (block.split('\n').every((line) => line.trim().startsWith('- '))) {
      const items = block.split('\n').map((line) => line.trim().slice(2))
      return (
        <ul key={key} className="mt-6 flex flex-col gap-3">
          {items.map((item, j) => (
            <li key={`${key}-li-${j}`} className="flex items-start gap-3 leading-relaxed text-slate-700">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
              <span>{renderInline(item, `${key}-li-${j}`)}</span>
            </li>
          ))}
        </ul>
      )
    }
    return (
      <p key={key} className="mt-6 leading-relaxed text-slate-700">
        {renderInline(block, key)}
      </p>
    )
  })
}

/** Carte de navigation précédent / suivant. */
function AdjacentCard({
  post,
  direction,
}: {
  post: Pick<BlogPost, 'title' | 'slug'> | null
  direction: 'prev' | 'next'
}) {
  if (!post) return <div aria-hidden="true" />

  const isPrev = direction === 'prev'
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex flex-col gap-2 rounded-3xl border border-border bg-surface p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card',
        isPrev && 'items-start',
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted',
          !isPrev && 'order-2 justify-end',
        )}
      >
        {isPrev ? (
          <>
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Article précédent
          </>
        ) : (
          <>
            Article suivant <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </>
        )}
      </span>
      <span
        className={cn(
          'font-extrabold leading-snug text-ink transition-colors group-hover:text-blue-600',
          !isPrev && 'order-1 text-right',
        )}
      >
        {post.title}
      </span>
    </Link>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params

  // Dégradation douce : 404 si la table n'existe pas encore ou en cas d'erreur
  let post: BlogPost | null = null
  try {
    post = await getPublishedPostBySlug(slug)
  } catch (error) {
    console.error('BlogPostPage:', error)
  }
  if (!post) notFound()

  const adjacent = post.published_at
    ? await getAdjacentPosts(post.published_at)
    : { prev: null, next: null }

  const minutes = readingTimeMinutes(post.content)
  const base = siteConfig.url.replace(/\/$/, '')

  // ── SEO : données structurées Article ──
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    ...(post.excerpt ? { description: post.seo_description ?? post.excerpt } : {}),
    ...(post.cover_image_url ? { image: [post.cover_image_url] } : {}),
    ...(post.published_at ? { datePublished: post.published_at } : {}),
    ...(post.updated_at ? { dateModified: post.updated_at } : {}),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${base}/logo/nextventure-logo-light.svg`,
      },
    },
    mainEntityOfPage: `${base}/blog/${post.slug}`,
    ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
  }

  return (
    <>
      <JsonLd data={articleLd} />
      {/* Hero article */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] to-background pb-12 pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(43 92 246 / 0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(43 92 246 / 0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)',
          }}
          aria-hidden="true"
        />
        <article className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Fil d'ariane */}
          <nav
            className="mb-8 flex items-center gap-1.5 text-sm text-muted"
            aria-label="Fil d'ariane"
          >
            <Link href="/blog" className="font-semibold transition-colors hover:text-blue-600">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <span className="truncate text-slate-500">{post.title}</span>
          </nav>

          {post.category && (
            <Link
              href={`/blog?categorie=${encodeURIComponent(post.category)}`}
              className="mb-5 inline-flex rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft transition-colors hover:bg-blue-600 hover:text-white"
            >
              {post.category}
            </Link>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
            <span className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-extrabold text-white shadow-soft">
                {post.author
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
              <span className="font-bold text-ink">{post.author}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-blue-600" aria-hidden="true" />
              {formatDate(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-600" aria-hidden="true" />
              {minutes} min de lecture
            </span>
          </div>
        </article>
      </section>

      {/* Corps */}
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Couverture */}
          <div className="reveal relative aspect-[16/9] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-800 shadow-card">
            {post.cover_image_url && (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            )}
          </div>

          {/* Contenu */}
          <div className="reveal mx-auto mt-4 max-w-3xl text-[1.0625rem]">
            {post.content ? (
              renderContent(post.content)
            ) : (
              <p className="mt-8 text-muted">Cet article n&apos;a pas encore de contenu.</p>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
                <Tag className="h-4 w-4 text-blue-600" aria-hidden="true" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Navigation précédent / suivant */}
          {(adjacent.prev || adjacent.next) && (
            <nav
              className="reveal mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2"
              aria-label="Articles adjacent"
            >
              <AdjacentCard post={adjacent.prev} direction="prev" />
              <AdjacentCard post={adjacent.next} direction="next" />
            </nav>
          )}

          {/* Retour blog */}
          <div className="mt-14 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-bold text-ink shadow-soft transition-colors hover:border-blue-300 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Retour au blog
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
