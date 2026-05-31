'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")
const disc = (o: number, p: number) => Math.round(((o - p) / o) * 100)

export default function PublicStoreClient({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("terlaris")
  const [displayLimit, setDisplayLimit] = useState(12)

  const dynamicCategories = ["Semua", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))]

  const filtered = products
    .filter(p => activeCategory === "Semua" || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "terlaris" ? (b.sold_count || 0) - (a.sold_count || 0) :
                    sort === "termurah" ? a.price - b.price :
                    sort === "termahal" ? b.price - a.price : (b.rating || 0) - (a.rating || 0))

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-6 font-nunito">
      
      {/* Hero Section / Header */}
      <div className="bg-gradient-to-r from-[#EE4D2D]/10 to-[#FF7337]/5 rounded-[32px] p-8 md:p-12 mb-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border border-[#EE4D2D]/10">
        <div>
          <h1 className="text-[32px] md:text-[42px] font-black text-[#1a1a1a] leading-tight font-playfair mb-3">
            Temukan Pilihan <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EE4D2D] to-[#FF7337]">Terbaik Anda</span>
          </h1>
          <p className="text-[#666] text-[15px] max-w-[400px]">
            Koleksi produk pilihan dengan kualitas terjamin. Nikmati kemudahan berbelanja langsung ke Shopee.
          </p>
        </div>
        
        {/* Search inside hero for mobile */}
        <div className="w-full md:w-[350px] relative">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari produk apa hari ini?"
            className="w-full py-4 pr-4 pl-12 rounded-2xl border-2 border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-[14px] outline-none bg-white focus:border-[#FF7337] focus:ring-4 focus:ring-[#FF7337]/20 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#EE4D2D" strokeWidth="3">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar snap-x">
        {dynamicCategories.map(cat => {
          const isActive = activeCategory === cat
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`
              snap-start py-2.5 px-6 rounded-full border-none text-[14px] font-bold cursor-pointer whitespace-nowrap transition-all duration-300
              ${isActive ? 'bg-[#1a1a1a] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] scale-105' : 'bg-white text-[#666] border border-[#e5e5e5] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'}
            `}>
              {cat}
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
        <span className="text-[#666] text-[13px]">
          <b className="text-[#1a1a1a]">{filtered.length}</b> produk ditemukan
        </span>
        <select value={sort} onChange={e => setSort(e.target.value)} className="py-1.5 px-3 rounded-lg border border-[#e5e5e5] text-[13px] outline-none bg-white cursor-pointer">
          <option value="terlaris">Terlaris</option>
          <option value="termurah">Harga Terendah</option>
          <option value="termahal">Harga Tertinggi</option>
          <option value="rating">Rating Terbaik</option>
        </select>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
        {filtered.slice(0, displayLimit).map((p, index) => (
          <Link key={p.id} href={`/${p.slug || p.id}`} className="block bg-white rounded-2xl overflow-hidden cursor-pointer border border-[#f0f0f0] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(238,77,45,0.18)] shadow-[0_2px_12px_rgba(0,0,0,0.08)] group">
            <div className="relative bg-[#fafafa] aspect-square">
              <Image src={p.image_url} alt={p.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" priority={index < 4} />
              <div className={`absolute top-2.5 left-2.5 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider
                ${p.badge === 'TERLARIS' ? 'bg-[#EE4D2D]' : p.badge === 'HOT 🔥' ? 'bg-[#FF6B35]' : p.badge === 'BARU' ? 'bg-[#00B14F]' : 'bg-[#333]'}`}>
                {p.badge || 'BARU'}
              </div>
              {disc(p.original_price || p.price, p.price) > 0 && (
                <div className="absolute top-2.5 right-2.5 bg-white text-[#EE4D2D] text-[11px] font-extrabold px-1.5 py-0.5 rounded-md border border-[#FFD6C8]">
                  -{disc(p.original_price || p.price, p.price)}%
                </div>
              )}
              <div className="absolute inset-0 bg-[#EE4D2D]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-[#EE4D2D] text-white font-extrabold text-[13px] px-5 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(238,77,45,0.4)]">
                  🛒 Beli di Shopee
                </div>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[13px] font-bold text-[#1a1a1a] leading-snug mb-1.5 line-clamp-2">
                {p.name}
              </div>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-[#EE4D2D] font-black text-[17px]">{fmt(p.price)}</span>
                <span className="text-[#bbb] text-[12px] line-through">{fmt(p.original_price || p.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  <span className="text-[12px]">⭐</span>
                  <span className="text-[#666] text-[11px] ml-0.5 font-bold">{p.rating}</span>
                </div>
                <span className="text-[#999] text-[11px] font-semibold">{p.sold_count?.toLocaleString() || 0} terjual</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length > displayLimit && (
        <div className="text-center mt-10">
          <button 
            onClick={() => setDisplayLimit(p => p + 12)}
            className="px-8 py-3 rounded-full bg-white border border-[#e5e5e5] text-[#1a1a1a] font-bold text-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-[#1a1a1a] transition-colors cursor-pointer"
          >
            Tampilkan Lebih Banyak
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 px-5 text-[#aaa]">
          <div className="text-[48px] mb-3">🔍</div>
          <div className="text-[16px] font-bold">Produk tidak ditemukan</div>
        </div>
      )}
    </div>
  )
}
