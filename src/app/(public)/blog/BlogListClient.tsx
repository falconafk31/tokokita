'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogListClient({ articles }: { articles: any[] }) {
  const [displayLimit, setDisplayLimit] = useState(6)
  const [activeCategory, setActiveCategory] = useState("Semua")

  if (!articles || articles.length === 0) return null

  const dynamicCategories = ["Semua", ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))]

  const filteredArticles = articles.filter(a => activeCategory === "Semua" || a.category === activeCategory)

  const getReadingTime = (content: string) => {
    const wordCount = (content || '').replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  return (
    <>
      <h3 className="text-[24px] font-black text-[#1a1a1a] mb-8 font-playfair border-b border-[#e5e5e5] pb-4">
        Artikel Lainnya
      </h3>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
        {dynamicCategories.map((cat: any) => {
          const isActive = activeCategory === cat
          return (
            <button key={cat} onClick={() => { setActiveCategory(cat); setDisplayLimit(6); }} className={`
              snap-start py-2.5 px-6 rounded-full border-none text-[14px] font-bold cursor-pointer whitespace-nowrap transition-all duration-300
              ${isActive ? 'bg-[#1a1a1a] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] scale-105' : 'bg-white text-[#666] border border-[#e5e5e5] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}
            `}>
              {cat}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.slice(0, displayLimit).map((article: any) => (
          <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-[#fafafa] mb-5 border border-[#f0f0f0]">
              {article.image_url ? (
                <Image src={article.image_url} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[48px]">📰</div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[#999] text-[12px] font-bold mb-2">
              <span>{new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>•</span>
              <span>📖 {getReadingTime(article.content)} menit baca</span>
            </div>
            <h4 className="text-[20px] font-black text-[#1a1a1a] leading-tight mb-3 group-hover:text-[#EE4D2D] transition-colors line-clamp-2">
              {article.title}
            </h4>
            <p className="text-[#666] text-[14px] leading-relaxed line-clamp-2">
              {article.meta_desc}
            </p>
          </Link>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-16 px-5 text-[#aaa] w-full col-span-full">
          <div className="text-[48px] mb-3">🔍</div>
          <div className="text-[16px] font-bold">Artikel tidak ditemukan</div>
        </div>
      )}

      {filteredArticles.length > displayLimit && (
        <div className="text-center mt-12">
          <button 
            onClick={() => setDisplayLimit(p => p + 6)}
            className="px-8 py-3 rounded-full bg-white border border-[#e5e5e5] text-[#1a1a1a] font-bold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            Tampilkan Lebih Banyak
          </button>
        </div>
      )}
    </>
  )
}
