import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { BlogPost, BlogPostInsert, BlogPostUpdate } from '@/types/database'

// ─── Lecture publique ────────────────────────────────────────

/** Articles publiés, triés par date de publication décroissante. */
export async function getPublishedPosts(options?: {
  limit?: number
  category?: string
}): Promise<BlogPost[]> {
  const supabase = await createClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw new Error(`getPublishedPosts: ${error.message}`)
  return data ?? []
}

/** Un article publié par son slug (page publique). */
export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getPublishedPostBySlug: ${error.message}`)
  return data
}

/** Articles adjacents pour la navigation précédent/suivant. */
export async function getAdjacentPosts(publishedAt: string): Promise<{
  prev: Pick<BlogPost, 'id' | 'title' | 'slug'> | null
  next: Pick<BlogPost, 'id' | 'title' | 'slug'> | null
}> {
  const supabase = await createClient()

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('is_published', true)
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('is_published', true)
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .single(),
  ])

  return {
    prev: prevResult.data ?? null,
    next: nextResult.data ?? null,
  }
}

// ─── Admin ───────────────────────────────────────────────────

/** Tous les articles (admin), avec pagination. */
export async function getAllPosts(
  page = 1,
  pageSize = 20,
): Promise<{ data: BlogPost[]; count: number }> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw new Error(`getAllPosts: ${error.message}`)
  return { data: data ?? [], count: count ?? 0 }
}

/** Un article par ID (admin). */
export async function getPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error?.code === 'PGRST116') return null
  if (error) throw new Error(`getPostById: ${error.message}`)
  return data
}

/** Créer un article. */
export async function createPost(input: BlogPostInsert): Promise<BlogPost> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createPost: ${error.message}`)
  if (!data) throw new Error('createPost: aucune donnée retournée')
  return data
}

/** Mettre à jour un article. */
export async function updatePost(id: string, input: BlogPostUpdate): Promise<BlogPost> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updatePost: ${error.message}`)
  if (!data) throw new Error('updatePost: aucune donnée retournée')
  return data
}

/** Supprimer un article. */
export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(`deletePost: ${error.message}`)
}

/** Toutes les catégories distinctes des articles publiés. */
export async function getPublishedCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null)

  if (error) return []
  return [...new Set(data.map((d) => d.category).filter(Boolean))] as string[]
}
