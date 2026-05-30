'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/', label: 'Beranda' },
    { href: '/blog', label: 'Blog & Artikel' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg font-nunito transition-all duration-300 ${scrolled ? 'border-b border-[#f0f0f0]/80 shadow-[0_4px_30px_rgba(0,0,0,0.06)]' : 'border-transparent shadow-none'}`}>
      <div className={`max-w-[1100px] mx-auto px-5 flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'h-[60px]' : 'h-[70px]'}`}>
        
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
