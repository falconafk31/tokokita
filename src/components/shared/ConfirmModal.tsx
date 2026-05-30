'use client'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Ya, Hapus",
  cancelText = "Batal"
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-[24px] p-6 md:p-8 max-w-[400px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-[#f0f0f0] transform scale-100 transition-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#EE4D2D]/10 text-[#EE4D2D] rounded-full flex items-center justify-center mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h3 className="text-[20px] font-black text-[#1a1a1a] mb-2">{title}</h3>
          <p className="text-[#666] text-[14px] mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[#e5e5e5] text-[#666] font-bold text-[14px] hover:bg-[#f7f7f7] hover:border-[#d5d5d5] transition-all"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm()
                onCancel()
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-[#EE4D2D] text-white font-bold text-[14px] hover:bg-[#d73f21] shadow-[0_4px_12px_rgba(238,77,45,0.2)] hover:-translate-y-0.5 transition-all"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
