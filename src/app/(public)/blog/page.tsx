import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, CalendarDays, Newspaper, User } from 'lucide-react'
import { getPublishedPosts, getPublishedCategories } from '@/services/blog.service'
import type { BlogPost } from '@/types/database'
import { cn } from '@/lib/utils/cn'
import { getT } from '@/lib/i18n/server'
import type { Lang, Dictionary } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT()
  return {
    title: t.nav.links.blog,
    description: t.blog.metaDescription,
  }
}

type SearchParams = Promise<{ categorie?: string }>

function formatDate(iso: string | null, lang: Lang = 'fr'): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

/* ─── Carte article ─────────────────────────────────────────── */

function PostCard({ post, t, lang }: { post: BlogPost; t: Dictionary; lang: Lang }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      {/* Couverture */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-blue-700 shadow-soft backdrop-blur">
            {post.category}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(post.published_at, lang)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {post.author}
          </span>
        </div>
        <h3 className="text-lg font-extrabold leading-snug tracking-tight text-ink transition-colors group-hover:text-blue-600">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-blue-600">
          {t.blog.readMore}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}

/* ─── Article vedette ───────────────────────────────────────── */

function FeaturedPost({ post, t, lang }: { post: BlogPost; t: Dictionary; lang: Lang }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft transition-shadow duration-300 hover:shadow-card lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800 lg:aspect-auto lg:min-h-[22rem]">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white shadow-soft">
          {t.blog.featured}
        </span>
      </div>

      <div className="flex flex-col justify-center p-7 sm:p-10">
        {post.category && (
          <span className="mb-4 inline-flex w-fit rounded-full border border-blue-200/70 bg-blue-600/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
            {post.category}
          </span>
        )}
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-ink transition-colors group-hover:text-blue-600 sm:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-4 line-clamp-3 leading-relaxed text-muted">{post.excerpt}</p>
        )}
        <div className="mt-5 flex items-center gap-4 text-sm text-muted">
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
          <span>{formatDate(post.published_at, lang)}</span>
        </div>
        <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors group-hover:bg-blue-600">
          {t.blog.readMore}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const { lang, t } = await getT()
  const { categorie } = await searchParams

  // Dégradation douce si la table n'existe pas encore (migration non exécutée)
  let posts: BlogPost[] = []
  let categories: string[] = []
  try {
    ;[posts, categories] = await Promise.all([
      getPublishedPosts(categorie ? { category: categorie } : undefined),
      getPublishedCategories(),
    ])
  } catch (error) {
    console.error('BlogPage:', error)
  }

  const featured = categorie ? null : (posts[0] ?? null)
  const rest = categorie ? posts : posts.slice(1)

  return (
    <>
      {/* Hero clair */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#eef2ff] to-background pb-16 pt-40">
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
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-soft">
            {t.blog.badge}
          </p>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
            {t.blog.title1}{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              {t.blog.title2}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            {t.blog.sub}
          </p>
        </div>
      </section>

      {/* Liste */}
      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filtres catégories */}
          {categories.length > 0 && (
            <div className="reveal mb-10 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/blog"
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                  !categorie
                    ? 'border-ink bg-ink text-white'
                    : 'border-border bg-surface text-slate-600 hover:border-blue-300 hover:text-blue-700',
                )}
              >
                {t.blog.all}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?categorie=${encodeURIComponent(cat)}`}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                    categorie === cat
                      ? 'border-ink bg-ink text-white'
                      : 'border-border bg-surface text-slate-600 hover:border-blue-300 hover:text-blue-700',
                  )}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            /* État vide */
            <div className="reveal mx-auto max-w-xl rounded-[2rem] border border-dashed border-blue-200 bg-white/60 p-14 text-center">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-glow">
                <Newspaper className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-extrabold text-ink">
                {categorie ? t.blog.emptyCategory(categorie) : t.blog.empty}
              </h2>
              <p className="mt-2 text-muted">
                {t.blog.emptySub}
              </p>
              {categorie && (
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-600"
                >
                  {t.blog.allArticles}
                </Link>
              )}
            </div>
          ) : (
            <div className="reveal flex flex-col gap-6">
              {featured && <FeaturedPost post={featured} t={t} lang={lang} />}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} t={t} lang={lang} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
