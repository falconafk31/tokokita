import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-[120px] md:pt-[70px] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-[#e5e5e5] mt-16 py-12 text-[#999] text-[13px] font-nunito bg-white">
        <div className="max-w-[1100px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-playfair text-[20px] font-black text-[#ccc] mb-2">TokoKita</div>
            &copy; {new Date().getFullYear()} TokoKita. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#EE4D2D] transition-colors">Facebook</a>
            <a href="#" className="hover:text-[#EE4D2D] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#EE4D2D] transition-colors">TikTok</a>
          </div>
          <div className="text-[11px] font-bold text-[#ccc]">
            Powered by Shopee Affiliate
          </div>
        </div>
      </footer>
    </div>
  )
}
