'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogListClient({ articles }: { articles: any[] }) {
  const [displayLimit, setDisplayLimit] = useState(6)

  if (!articles || articles.length === 0) return null

  return (
    <>
      <h3 className="text-[24px] font-black text-[#1a1a1a] mb-8 font-playfair border-b border-[#e5e5e5] pb-4">
        Artikel Lainnya
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(0, displayLimit).map((article: any) => (
          <Link key={article.id} href={`/blog/${article.slug}`} className="group block">
            <div className="relative aspect-[4/3] rounded-[20px] overflow-hidden bg-[#fafafa] mb-5 border border-[#f0f0f0]">
              {article.image_url ? (
                <Image src={article.image_url} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[48px]">📰</div>
              )}
            </div>
            <div className="text-[#999] text-[12px] font-bold mb-2">
              {new Date(article.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
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

      {articles.length > displayLimit && (
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
