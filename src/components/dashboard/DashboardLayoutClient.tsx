'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function DashboardLayoutClient({ children, shopName = 'TokoKita', logoUrl = '' }: { children: React.ReactNode, shopName?: string, logoUrl?: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(p => !p)
    window.addEventListener('toggle-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-sidebar', handleToggle)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f7] font-nunito flex">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 z-[50] md:static md:block transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar onClose={() => setIsMobileOpen(false)} shopName={shopName} logoUrl={logoUrl} />
      </div>

      <div className="flex-1 h-screen overflow-auto flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}
