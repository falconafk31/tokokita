'use client'

import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white rounded-full shadow-[0_4px_20px_rgba(238,77,45,0.4)] flex items-center justify-center text-[20px] transition-all duration-300 z-50 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(238,77,45,0.5)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
      aria-label="Kembali ke atas"
    >
      ↑
    </button>
  )
}
