'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100
        setProgress(Math.min(100, Math.max(0, scrolled)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (progress === 0) return null

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] z-[60] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
