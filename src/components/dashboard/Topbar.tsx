'use client'

import { usePathname } from 'next/navigation'

export default function Topbar({ title, action }: { title?: string, action?: React.ReactNode }) {
  const pathname = usePathname()
  
  let displayTitle = title
  if (!displayTitle) {
    if (pathname.includes('/products')) displayTitle = 'Manajemen Produk'
    else if (pathname.includes('/analytics')) displayTitle = 'Analytics'
    else if (pathname.includes('/settings')) displayTitle = 'Pengaturan'
    else displayTitle = 'Dashboard'
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-[#f0f0f0] px-4 md:px-8 h-[70px] md:h-[76px] flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)] sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
          className="md:hidden w-10 h-10 rounded-xl bg-gray-50 text-[#1a1a1a] flex items-center justify-center font-bold text-xl hover:bg-gray-100 transition-colors"
        >
          ☰
        </button>
        <div>
          <div className="text-[10px] md:text-[11px] font-extrabold text-[#999] tracking-wider mb-0.5 uppercase hidden sm:block">Dashboard</div>
          <div className="font-black text-[16px] md:text-[20px] text-[#1a1a1a] tracking-tight leading-none line-clamp-1">
            {displayTitle}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        {action}
        
        <div className="h-8 w-[1px] bg-[#e5e5e5] hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-[13px] font-bold text-[#1a1a1a] leading-tight group-hover:text-[#EE4D2D] transition-colors">Admin Toko</div>
            <div className="text-[11px] font-semibold text-[#888]">Superadmin</div>
          </div>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#EE4D2D] to-[#FFB347] flex items-center justify-center text-white font-black shadow-md border-2 border-white ring-2 ring-transparent group-hover:ring-[#EE4D2D]/20 transition-all shrink-0">
            AD
          </div>
        </div>
      </div>
    </div>
  )
}
