'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

export default function RedirectOverlay({ product, onClose }: { product: any, onClose: () => void }) {
  const delay = parseInt(process.env.NEXT_PUBLIC_REDIRECT_DELAY_SECONDS || '3')
  const [count, setCount] = useState(delay)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (count <= 0) {
      window.location.href = `/go/${product.slug || product.id}`
    }
  }, [count, product])

  useEffect(() => {
    // We hit the tracking API immediately or when countdown hits 0
    // Let's do it immediately in background
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id })
    }).catch(console.error)

    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
      setProgress(p => Math.min(p + (100 / delay), 100))
    }, 1000)

    return () => clearInterval(interval)
  }, [product, delay])

  const manualRedirect = () => {
    window.location.href = `/go/${product.slug || product.id}`
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center font-nunito p-4">
      <div className="bg-white rounded-[24px] p-10 max-w-[420px] w-full text-center shadow-[0_32px_80px_rgba(0,0,0,0.4)]">
        
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] mx-auto mb-5 flex items-center justify-center shadow-lg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>

        <div className="relative w-[100px] h-[100px] mx-auto mb-4">
          <Image src={product.image_url} alt={product.name} fill sizes="100px" className="object-cover rounded-xl" />
        </div>

        <div className="font-extrabold text-[16px] text-[#1a1a1a] mb-1.5">{product.name}</div>
        <div className="text-[#EE4D2D] font-black text-[22px] mb-5">{fmt(product.price)}</div>

        <div className="bg-[#fff8f6] border border-[#FFD6C8] rounded-xl p-4 mb-5">
          <div className="text-[#666] text-[13px] mb-2 font-bold">Mengarahkan ke Shopee dalam</div>
          <div className="text-[48px] font-black text-[#EE4D2D] leading-none">{count}</div>
          <div className="text-[#999] text-[12px] mt-1 font-bold">detik</div>
          
          <div className="mt-3 h-1.5 rounded-full bg-[#ffe5dd] overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button onClick={manualRedirect} className="block w-full bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white font-extrabold text-[15px] py-3.5 rounded-xl border-none mb-2.5 cursor-pointer shadow-[0_8px_20px_rgba(238,77,45,0.25)] hover:-translate-y-0.5 transition-all">
          🛒 Langsung ke Shopee
        </button>

        <button onClick={onClose} className="bg-transparent border border-[#ddd] text-[#999] text-[13px] font-bold py-2 px-5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          Kembali
        </button>

      </div>
    </div>
  )
}
