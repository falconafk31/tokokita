import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('published', true)

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  if (articles) {
    articles.forEach((article) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${article.slug}`,
        lastModified: new Date(article.created_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  }

  return sitemapEntries
}
