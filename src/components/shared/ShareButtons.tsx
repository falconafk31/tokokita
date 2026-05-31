'use client'

import { useState, useEffect } from 'react'

export default function ShareButtons({ url, title }: { url: string, title: string }) {
  const [copied, setCopied] = useState(false)
  const [fullUrl, setFullUrl] = useState('')

  useEffect(() => {
    // Generate full URL on client to avoid hydration mismatch
    setFullUrl(window.location.origin + url)
  }, [url])

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + fullUrl)}`,
      color: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border-[#25D366]/30'
    },
    {
      name: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border-[#1877F2]/30'
    },
    {
      name: 'X',
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: 'bg-black/5 text-black hover:bg-black hover:text-white border-black/30'
    }
  ]

  if (!fullUrl) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[13px] font-bold text-[#999] mr-2">Bagikan:</span>
      
      {shareLinks.map(link => (
        <a 
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-[40px] h-[40px] md:w-[36px] md:h-[36px] rounded-full border transition-all duration-200 ${link.color}`}
          title={`Bagikan ke ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-5 md:px-4 h-[40px] md:h-[36px] rounded-full border transition-all duration-200 text-[13px] md:text-[13px] font-bold group
          ${copied 
            ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
            : 'bg-white border-[#e5e5e5] text-[#666] hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white'
          }`}
      >
        <span>
          {copied ? (
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          )}
        </span>
        <span>{copied ? 'Tersalin!' : 'Copy Link'}</span>
      </button>
    </div>
  )
}
