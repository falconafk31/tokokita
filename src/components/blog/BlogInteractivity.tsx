'use client'

import { useEffect, useState } from 'react'

export default function BlogInteractivity({ product }: { product?: any }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [showSticky, setShowSticky] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  useEffect(() => {
    // 1. Generate Table of Contents & Lightbox
    const articleBody = document.querySelector('.tiptap-editor')
    if (articleBody) {
      // Lazy load images natively and attach Lightbox
      const images = articleBody.querySelectorAll('img')
      images.forEach(img => {
        if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy')
        img.style.cursor = 'zoom-in'
        img.addEventListener('click', () => {
          setLightboxImg(img.src)
        })
      })

      // Generate TOC
      const hTags = articleBody.querySelectorAll('h2, h3')
      const toc: { id: string; text: string; level: number }[] = []
      
      hTags.forEach((h, i) => {
        const id = `heading-${i}`
        h.id = id
        toc.push({
          id,
          text: h.textContent || '',
          level: h.tagName.toLowerCase() === 'h2' ? 2 : 3
        })
      })
      setHeadings(toc)
    }

    // 2. Sticky CTA visibility on scroll
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100 // offset for fixed header
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#f0f0f0] mb-8 lg:float-right lg:w-[320px] lg:ml-8 lg:mb-6 mt-2 relative z-20">
          <h4 className="text-[14px] font-black text-[#1a1a1a] mb-4 uppercase tracking-wider">📑 Daftar Isi</h4>
          <ul className="space-y-3">
            {headings.map(h => (
              <li key={h.id} className={h.level === 3 ? 'pl-4 border-l-2 border-[#e5e5e5] ml-1' : ''}>
                <button 
                  onClick={() => scrollTo(h.id)}
                  className={`text-left text-[13px] hover:text-[#EE4D2D] transition-colors leading-snug ${h.level === 2 ? 'font-bold text-[#1a1a1a]' : 'text-[#666]'}`}
                >
                  {h.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lightbox Overlay */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="Zoomed" />
        </div>
      )}

      {/* Sticky CTA (Mobile: Full width bottom, Desktop: Floating Pill) */}
      {product && showSticky && (
        <div className="fixed bottom-0 left-0 w-full lg:w-auto lg:left-1/2 lg:-translate-x-1/2 lg:bottom-8 lg:rounded-full lg:border lg:border-[#f0f0f0] bg-white border-t border-[#f0f0f0] p-4 lg:py-3 lg:px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:shadow-[0_16px_40px_rgba(0,0,0,0.15)] z-[100] animate-fade-in flex items-center gap-3 lg:gap-4 transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          
          {/* Thumbnail */}
          <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-full overflow-hidden shrink-0 border border-[#f0f0f0]">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0 lg:w-[260px] lg:mr-2">
            <div className="text-[12px] lg:text-[13px] font-bold text-[#1a1a1a] truncate leading-tight mb-0.5">
              {product.name}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] lg:text-[15px] font-black text-[#EE4D2D] truncate leading-none">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {product.original_price > product.price && (
                <span className="text-[10px] lg:text-[11px] text-[#999] line-through hidden md:inline">
                  Rp {product.original_price.toLocaleString('id-ID')}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <a 
            href={`/${product.slug || product.id}`}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white px-4 py-2.5 lg:py-2.5 lg:px-6 rounded-xl lg:rounded-full text-[12px] lg:text-[13px] font-extrabold shadow-[0_4px_14px_rgba(238,77,45,0.3)] flex items-center gap-1.5 lg:gap-2 hover:scale-105 transition-transform"
          >
            🛒 Beli di Shopee
          </a>
        </div>
      )}
    </>
  )
}
