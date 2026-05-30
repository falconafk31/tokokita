'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/blog', label: 'Blog & Artikel' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#f0f0f0]/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] font-nunito transition-all duration-300">
      <div className="max-w-[1100px] mx-auto px-5 h-[70px] flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-[36px] h-[36px] rounded-xl bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] flex items-center justify-center shadow-lg shadow-[#EE4D2D]/30 group-hover:scale-105 transition-transform">
            <span className="text-white text-lg">🛍️</span>
          </div>
          <span className="font-playfair text-[22px] font-black text-[#1a1a1a] tracking-tight group-hover:text-[#EE4D2D] transition-colors">
            TokoKita
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#f7f7f7] p-1.5 rounded-full border border-[#f0f0f0]">
          {links.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-5 py-2 rounded-full text-[14px] font-bold transition-all duration-300 ${
                  isActive 
                  ? 'bg-white text-[#EE4D2D] shadow-[0_2px_10px_rgba(0,0,0,0.06)]' 
                  : 'text-[#666] hover:text-[#1a1a1a] hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Search Bar & Action */}
        <div className="flex flex-1 md:flex-none items-center justify-end gap-3 min-w-[200px] max-w-[300px]">
          <div className="relative w-full hidden sm:block">
            <input
              placeholder="Cari..."
              className="w-full py-2.5 pr-4 pl-10 rounded-full border border-[#e5e5e5] text-[13px] outline-none bg-[#fafafa] box-border focus:border-[#FF7337] focus:bg-white focus:ring-4 focus:ring-[#FF7337]/10 transition-all"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40 w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>

      </div>
      
      {/* Mobile Nav Links (bottom bar style or just under) */}
      <div className="md:hidden flex border-t border-[#f0f0f0] bg-white">
        {links.map(link => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex-1 text-center py-3 text-[13px] font-bold border-b-2 transition-colors ${
                isActive ? 'border-[#EE4D2D] text-[#EE4D2D]' : 'border-transparent text-[#666]'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
