import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan | TokoKita',
}

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-5 bg-[#fcfcfc] font-nunito">
      <div className="w-full max-w-[600px] bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#f0f0f0] text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#f0f0f0] text-[#999] mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-[64px] font-black text-[#1a1a1a] font-playfair leading-none mb-2">404</h1>
        <h2 className="text-[24px] font-black text-[#1a1a1a] mb-4">Halaman Tidak Ditemukan</h2>
        
        <p className="text-[#666] text-[16px] mb-8 max-w-[400px] mx-auto">
          Maaf, halaman yang Anda cari mungkin telah dihapus, diubah namanya, atau tidak pernah ada.
        </p>

        <Link 
          href="/" 
          className="inline-block bg-[#EE4D2D] hover:bg-[#ff7337] text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(238,77,45,0.25)] hover:shadow-[0_12px_25px_rgba(238,77,45,0.35)] hover:-translate-y-1"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
