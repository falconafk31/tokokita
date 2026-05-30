'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")
const disc = (o: number, p: number) => Math.round(((o - p) / o) * 100)

export default function SidebarProducts({ title, products }: { title: string, products: any[] }) {
  if (!products || products.length === 0) return null

  return (
    <div className="mb-10 bg-white rounded-[24px] p-6 border border-[#f0f0f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <h3 className="text-[18px] font-black text-[#1a1a1a] font-playfair mb-5 border-b border-[#f0f0f0] pb-3">
        {title}
      </h3>
      
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
