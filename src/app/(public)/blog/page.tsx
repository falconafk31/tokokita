import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import BlogListClient from './BlogListClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog & Artikel | TokoKita',
  description: 'Temukan artikel menarik, tips belanja, dan rekomendasi produk terbaik dari TokoKita.',
}

export default async function BlogIndexPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, content, meta_desc, image_url, created_at, category')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-5 py-20 text-center font-nunito">
        <h1 className="text-[40px] font-black text-[#1a1a1a] font-playfair mb-4">Blog & Artikel</h1>
        <p className="text-[#666]">Belum ada artikel yang dipublikasikan.</p>
      </div>
    )
  }

  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1)

  const getReadingTime = (content: string) => {
    const wordCount = (content || '').replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-10 font-nunito">
      
      {/* Blog Header */}
      <div className="text-center max-w-[600px] mx-auto mb-16">
        <h1 className="text-[40px] md:text-[52px] font-black text-[#1a1a1a] font-playfair mb-4 leading-tight">
          Cerita & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE4D2D] to-[#FF7337]">Inspirasi</span>
        </h1>
        <p className="text-[#666] text-[16px]">
          Temukan ragam artikel menarik, tips gaya hidup, hingga panduan belanja cerdas yang telah kami kurasi khusus untuk Anda.
        </p>
      </div>

      {/* Featured Article */}
      <Link href={`/blog/${featuredArticle.slug}`} className="block group mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-[32px] p-6 border border-[#f0f0f0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_20px_60px_rgba(238,77,45,0.1)] hover:-translate-y-1">
          <div className="relative aspect-[4/3] md:aspect-square lg:aspect-[4/3] rounded-[24px] overflow-hidden bg-[#fafafa]">
            {featuredArticle.image_url ? (
              <Image src={featuredArticle.image_url} alt={featuredArticle.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[64px]">📰</div>
            )}
          </div>
          <div className="md:pr-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-block px-3 py-1 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] text-[12px] font-bold">
                ARTIKEL TERBARU
              </div>
              <div className="text-[#999] text-[12px] font-bold">
                📖 {getReadingTime(featuredArticle.content)} menit baca
              </div>
            </div>
            <h2 className="text-[28px] md:text-[36px] font-black text-[#1a1a1a] font-playfair leading-tight mb-4 group-hover:text-[#EE4D2D] transition-colors">
              {featuredArticle.title}
            </h2>
            <p className="text-[#666] text-[15px] leading-relaxed mb-6 line-clamp-3">
              {featuredArticle.meta_desc || "Baca selengkapnya untuk menemukan informasi menarik dari artikel ini..."}
            </p>
            <div className="text-[14px] font-bold text-[#EE4D2D] flex items-center gap-2">
              Baca Selengkapnya 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Article Grid via Client Component for Load More */}
      <BlogListClient articles={otherArticles} />

    </div>
  )
}
