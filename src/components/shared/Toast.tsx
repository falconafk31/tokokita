'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`
              pointer-events-auto flex items-center justify-between min-w-[280px] max-w-[400px] 
              px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border 
              transform transition-all duration-300 animate-slide-up
              ${t.type === 'success' ? 'bg-[#e5ffe8] border-[#00b14f]/20 text-[#00b14f]' : 
                t.type === 'error' ? 'bg-[#fff1f0] border-[#EE4D2D]/20 text-[#EE4D2D]' : 
                'bg-white border-[#f0f0f0] text-[#333]'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-[18px]">
                {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              <span className="text-[13px] font-bold">{t.message}</span>
            </div>
            <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 text-[12px] p-1">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
