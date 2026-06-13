import Navbar from '@/components/shared/Navbar'
import BackToTop from '@/components/shared/BackToTop'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('shop_name, logo_url').eq('id', 1).single()
  
  const shopName = settings?.shop_name || 'TokoKita'
  const logoUrl = settings?.logo_url || ''

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-[120px] md:pt-[70px] flex flex-col">
      <Navbar shopName={shopName} logoUrl={logoUrl} />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-[#e5e5e5] mt-16 py-12 text-[#999] text-[13px] font-nunito bg-white">
        <div className="max-w-[1100px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left flex items-center gap-3">
            {logoUrl && <img src={logoUrl} alt={shopName} className="w-8 h-8 rounded-lg object-cover" />}
            <div>
              <div className="font-playfair text-[20px] font-black text-[#ccc] mb-1">{shopName}</div>
              &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
            </div>
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
      <BackToTop />
    </div>
  )
}
