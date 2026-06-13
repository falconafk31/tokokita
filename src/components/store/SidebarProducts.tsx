'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")
const disc = (o: number, p: number) => Math.round(((o - p) / o) * 100)

function TrendingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#EE4D2D]">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B5CF6]">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  )
}

const iconMap: Record<string, React.ReactNode> = {
  trending: <TrendingIcon />,
  terbaru: <SparkleIcon />,
}

export default function SidebarProducts({ title, products, variant = 'trending' }: { title: string, products: any[], variant?: 'trending' | 'terbaru' }) {
  if (!products || products.length === 0) return null

  const accentColor = variant === 'trending' ? '#EE4D2D' : '#8B5CF6'

  return (
    <div className="mb-10 bg-white rounded-[24px] p-6 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-2.5 mb-5 border-b border-[#f0f0f0] pb-4">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}10` }}
        >
          {iconMap[variant]}
        </div>
        <h3 className="text-[16px] font-black text-[#1a1a1a] font-playfair">
          {title}
        </h3>
      </div>
      
      <div className="space-y-4">
        {products.map(p => (
          <Link 
            key={p.id} 
            href={`/${p.slug || p.id}`}
            className="flex gap-3 items-center group cursor-pointer transition-all hover:bg-[#fafafa] p-2 -mx-2 rounded-xl"
          >
            <div className="relative w-[80px] h-[80px] rounded-xl overflow-hidden bg-[#f0f0f0] shrink-0 border border-[#e5e5e5]">
              <Image src={p.image_url} alt={p.name} fill sizes="80px" className="object-cover transition-transform group-hover:scale-110" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-[#1a1a1a] leading-tight mb-1 line-clamp-2 group-hover:text-[#EE4D2D] transition-colors">
                {p.name}
              </div>
              <div className="text-[#EE4D2D] font-black text-[14px] mb-1">{fmt(p.price)}</div>
              <div className="flex items-center gap-2">
                <span className="text-[#999] text-[10px] font-semibold">{p.sold_count?.toLocaleString() || 0} terjual</span>
                <span className="bg-[#FFD6C8]/50 text-[#EE4D2D] text-[9px] font-extrabold px-1.5 py-0.5 rounded">-{disc(p.original_price || p.price, p.price)}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
