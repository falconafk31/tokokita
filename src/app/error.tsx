'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-5 bg-[#fcfcfc] font-nunito">
      <div className="w-full max-w-[600px] bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#f0f0f0] text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-[32px] font-black text-[#1a1a1a] font-playfair leading-tight mb-4">
          Terjadi Kesalahan Sistem
        </h1>
        
        <p className="text-[#666] text-[16px] mb-8 max-w-[400px] mx-auto">
          Mohon maaf, sistem kami sedang mengalami gangguan atau memuat data yang salah. Silakan coba lagi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-[#EE4D2D] hover:bg-[#ff7337] text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(238,77,45,0.25)] hover:-translate-y-1"
          >
            Coba Lagi (Reload)
          </button>
          
          <Link 
            href="/" 
            className="w-full sm:w-auto bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#333] font-bold py-3.5 px-8 rounded-full transition-colors"
          >
            Ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
