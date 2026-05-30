'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

export default function CountdownClient({ product, delay = 3, pixelId }: { product: any, delay: number, pixelId?: string }) {
  const [countdown, setCountdown] = useState(delay)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Jalankan timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleRedirect()
          return 0
        }
        return prev - 1
      })
      setProgress(p => Math.min(p + (100 / delay), 100))
    }, 1000)

    return () => clearInterval(timer)
  }, [product, delay])

  const handleRedirect = () => {
    // FB Pixel Tracking (jika terpasang)
    if (pixelId && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: product.name,
        value: product.price,
        currency: 'IDR'
      })
    }

    // Arahkan ke /go untuk di-track oleh sistem internal, lalu ke Shopee
    window.location.href = `/go/${product.slug || product.id}`
  }

  return (
    <div className="bg-[#fafafa] rounded-2xl p-6 border border-[#e5e5e5]">
      <div className="relative w-[120px] h-[120px] mx-auto mb-5">
        <Image src={product.image_url} alt={product.name} fill sizes="120px" className="object-cover rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]" />
      </div>

      <div className="text-center mb-6">
        <div className="font-black text-[18px] text-[#1a1a1a] mb-2 leading-snug">{product.name}</div>
        <div className="text-[#EE4D2D] font-black text-[24px]">{fmt(product.price)}</div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={handleRedirect}
          className="w-full bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white font-extrabold text-[16px] py-4 rounded-xl shadow-[0_4px_20px_rgba(238,77,45,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(238,77,45,0.4)] transition-all flex justify-center items-center gap-2"
        >
          <span>🛒 Langsung ke Shopee</span>
        </button>
        
        <div className="text-center text-[#999] text-[13px] font-bold">
          Otomatis dialihkan dalam <span className="text-[#EE4D2D] text-[16px] font-black animate-pulse">{countdown}</span> detik
        </div>

        <div className="mt-3 h-1.5 rounded-full bg-[#ffe5dd] overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="flex justify-center gap-3 md:gap-4 pt-4 border-t border-[#f0f0f0]">
          {["🚚 Gratis Ongkir", "✅ Garansi Ori", "💳 Bisa COD"].map(badge => (
            <span key={badge} className="text-[#666] text-[11px] md:text-[12px] font-extrabold tracking-tight">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
