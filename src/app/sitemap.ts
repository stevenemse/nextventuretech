import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'
import { getPublishedWorks } from '@/services/works.service'
import { getPublishedPosts } from '@/services/blog.service'

export const revalidate = 3600 // régénéré toutes les heures

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, '')

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/realisations`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tarifs`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/reserver`, changeFrequency: 'yearly', priority: 0.6 },
  ]

  const [works, posts] = await Promise.all([
    getPublishedWorks().catch(() => []),
    getPublishedPosts().catch(() => []),
  ])

  return [
    ...staticRoutes,
    ...works.map((w) => ({
      url: `${base}/realisations#${w.slug}`,
      lastModified: new Date(w.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
