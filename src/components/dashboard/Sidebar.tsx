'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar({ onClose, shopName = 'TokoKita', logoUrl = '' }: { onClose?: () => void, shopName?: string, logoUrl?: string }) {
  const pathname = usePathname()
  
  const navItems = [
    { id: "/dashboard/products", label: "Produk", icon: "📦" },
    { id: "/dashboard/articles", label: "Artikel", icon: "📝" },
    { id: "/dashboard/analytics", label: "Analytics", icon: "📊" },
    { id: "/dashboard/settings", label: "Pengaturan", icon: "⚙️" },
  ]

  return (
    <div className="w-[260px] bg-white flex-shrink-0 flex flex-col min-h-screen sticky top-0 font-nunito border-r border-[#f0f0f0] shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-7 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl && <img src={logoUrl} alt={shopName} className="w-10 h-10 rounded-xl object-cover shadow-sm border border-[#f0f0f0]" />}
          <div>
            <div className="font-playfair text-[20px] font-black bg-gradient-to-br from-[#EE4D2D] to-[#FFB347] bg-clip-text text-transparent mb-0.5 tracking-tight">
              {shopName}
            </div>
            <div className="text-[#999] text-[10px] tracking-[0.2em] font-extrabold uppercase">Workspace</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold">
            ✕
          </button>
        )}
      </div>
      
      <div className="flex-1 px-4 py-2 flex flex-col gap-1.5">
        <div className="text-[#a0a0a0] text-[11px] font-extrabold px-3 mb-2 tracking-wider mt-2">MAIN MENU</div>
        {navItems.map(item => {
          const isActive = pathname.startsWith(item.id)
          const isAnalytics = item.id === '/dashboard/analytics'
          
          return (
            <div key={item.id} className="flex flex-col gap-1">
              <Link href={item.id} onClick={onClose} className={`
                flex items-center gap-3.5 w-full px-4 py-3 rounded-xl border-none cursor-pointer text-[14px] font-bold text-left transition-all group
                ${isActive ? 'bg-gradient-to-r from-[#fff1f0] to-white text-[#EE4D2D] shadow-[inset_2px_0_0_#EE4D2D]' : 'bg-transparent text-[#666] hover:bg-gray-50 hover:text-[#1a1a1a]'}
              `}>
                <span className={`text-[18px] transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100'}`}>{item.icon}</span>
                {item.label}
                {isActive && !isAnalytics && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#EE4D2D] shadow-[0_0_8px_rgba(238,77,45,0.4)]" />}
              </Link>
              
              {isAnalytics && isActive && (
                <div className="ml-10 pl-3 py-2 border-l border-[#f0f0f0] flex flex-col gap-2">
                  <Link href="/dashboard/analytics" className={`text-[12px] font-bold transition-colors ${pathname === '/dashboard/analytics' ? 'text-[#EE4D2D]' : 'text-[#999] hover:text-[#1a1a1a]'}`}>
                    Ringkasan
                  </Link>
                  <Link href="/dashboard/analytics/history" className={`text-[12px] font-bold transition-colors ${pathname === '/dashboard/analytics/history' ? 'text-[#EE4D2D]' : 'text-[#999] hover:text-[#1a1a1a]'}`}>
                    Riwayat Lengkap
                  </Link>
                  <Link href="/dashboard/analytics/ads-checker" className={`text-[12px] font-bold transition-colors ${pathname === '/dashboard/analytics/ads-checker' ? 'text-[#EE4D2D]' : 'text-[#999] hover:text-[#1a1a1a]'}`}>
                    Validasi Iklan
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="p-5">
        <div className="bg-gradient-to-br from-[#fff1f0] to-[#fff8f6] p-5 rounded-2xl border border-[#FFD6C8] relative overflow-hidden group">
          <div className="relative z-10">
            <div className="text-[13px] font-extrabold text-[#1a1a1a] mb-1">Toko Publik</div>
            <div className="text-[12px] text-[#666] mb-4 leading-relaxed font-semibold">Lihat tampilan website Anda sebagai pengunjung.</div>
            <Link href="/" target="_blank" className="flex items-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] shadow-[0_4px_12px_rgba(238,77,45,0.2)] text-white text-[13px] font-extrabold cursor-pointer transition-all hover:opacity-90 justify-center mb-3">
              Buka Toko ↗
            </Link>
            
            <form action="/login" method="GET" onSubmit={async (e) => {
              e.preventDefault();
              const { logoutAction } = await import('@/app/login/actions')
              await logoutAction()
            }}>
              <button type="submit" className="w-full p-3 rounded-xl bg-white border border-[#FFD6C8] text-[#EE4D2D] text-[13px] font-extrabold cursor-pointer transition-all hover:bg-[#fff8f6] justify-center">
                Keluar (Logout)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
