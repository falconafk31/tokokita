import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleContent from './ArticleContent'
import SidebarProducts from '@/components/store/SidebarProducts'
import ScrollProgress from '@/components/shared/ScrollProgress'
import ShareButtons from '@/components/shared/ShareButtons'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from('articles').select('meta_title, meta_desc, title').eq('slug', slug).single()
  
  if (!article) return {}
  
  return {
    title: article.meta_title || article.title,
    description: article.meta_desc,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: article } = await supabase
    .from('articles')
    .select(`
      *,
      product:products(*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!article) {
    notFound()
  }

  // Fetch related articles
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, title, slug, image_url, created_at')
    .eq('published', true)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch Sidebar Products
  const { data: trendingProducts } = await supabase
    .from('products')
    .select('*')
    .order('sold_count', { ascending: false })
    .limit(4)

  const { data: latestProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  const formattedDate = new Date(article.created_at).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const wordCount = (article.content || '').replace(/<[^>]+>/g, '').split(/\s+/).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="font-nunito bg-[#fdfdfd]">
      <ScrollProgress />
      
      {/* Hero Image Section (If Available) */}
      {article.image_url && (
        <div className="w-full h-[400px] md:h-[500px] relative mb-10 md:mb-16">
          <Image src={article.image_url} alt={article.title} fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fdfdfd] via-[#fdfdfd]/20 to-transparent"></div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`max-w-[1100px] mx-auto px-5 ${!article.image_url ? 'pt-16' : '-mt-32 relative z-10'}`}>
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#999] mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#EE4D2D] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#EE4D2D] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] truncate max-w-[200px] md:max-w-[400px]">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">
          
          {/* Left Column: Article */}
          <div>
            {/* Article Header */}
            <div className="text-center lg:text-left mb-10">
              {/* Category removed (OPT-2) */}
              <h1 className="font-playfair text-[36px] md:text-[48px] font-black leading-[1.1] text-[#1a1a1a] mb-6">
                {article.title}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-3 text-[#999] text-[14px] font-bold">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>📖 {readingTime} menit baca</span>
              </div>
            </div>
            
            {/* Article Body */}
            <div className="bg-white md:bg-transparent rounded-[24px] md:rounded-none p-6 md:p-0 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:shadow-none mb-16">
              <div 
                className="tiptap-editor text-[#333] text-[17px] md:text-[18px] leading-[1.8] font-nunito"
                dangerouslySetInnerHTML={{ __html: article.content || '' }} 
              />
              
              {/* Linked Affiliate Product Box */}
              {article.product && (
                <div className="mt-16 bg-gradient-to-br from-[#fff8f6] to-[#fff] rounded-[24px] p-8 border border-[#FFD6C8] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#EE4D2D] to-[#FF7337]"></div>
                  <h3 className="text-[20px] font-black text-[#1a1a1a] mb-6 font-playfair">Tertarik dengan produk ini?</h3>
                  <ArticleContent product={article.product} />
                </div>
              )}

              {/* Share Buttons (OPT-8) */}
              <div className="mt-12 pt-8 border-t border-[#f0f0f0]">
                <ShareButtons url={`/blog/${article.slug}`} title={article.title} />
              </div>
            </div>

            {/* Mobile Products Section (OPT-6) */}
            <div className="lg:hidden mb-16">
              <h3 className="text-[20px] font-black mb-5 font-playfair text-[#1a1a1a]">🔥 Produk Populer</h3>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                {trendingProducts?.map(p => (
                  <Link key={p.id} href={`/${p.slug || p.id}`} className="snap-start min-w-[200px] w-[200px] bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-[#EE4D2D] transition-colors">
                    <div className="relative aspect-square bg-[#fafafa]">
                      <Image src={p.image_url} alt={p.name} fill sizes="200px" className="object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="text-[13px] font-bold text-[#1a1a1a] leading-tight line-clamp-2 mb-2 h-[34px]">{p.name}</div>
                      <div className="text-[#EE4D2D] font-black text-[15px]">Rp {p.price.toLocaleString('id-ID')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar (Sticky) */}
          <div className="hidden lg:block space-y-6 pt-4 sticky top-[100px]">
            <SidebarProducts title="🔥 Sedang Trending" products={trendingProducts || []} />
            <SidebarProducts title="✨ Produk Terbaru" products={latestProducts || []} />
          </div>

        </div>
      </div>

      {/* Related Articles Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="bg-[#f7f7f7] py-16 border-t border-[#f0f0f0]">
          <div className="max-w-[1100px] mx-auto px-5">
            <h3 className="text-[28px] font-black text-[#1a1a1a] mb-10 font-playfair text-center">
              Baca Selanjutnya
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel: any) => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} className="group block bg-white rounded-[20px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#f0f0f0] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                  <div className="relative aspect-[4/3] bg-[#fafafa] overflow-hidden">
                    {rel.image_url ? (
                      <Image src={rel.image_url} alt={rel.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[32px]">📰</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-[#999] text-[12px] font-bold mb-2">
                      {new Date(rel.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <h4 className="text-[18px] font-black text-[#1a1a1a] leading-tight group-hover:text-[#EE4D2D] transition-colors line-clamp-3">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
