'use client'

import { useState } from 'react'
import { loginAction } from './actions'

export default function LoginFormClient() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)
    
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      // Force a hard reload to ensure server reads the new auth cookie
      window.location.href = '/dashboard'
    }
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 font-nunito">
      {error && (
        <div className="bg-[#fff1f0] text-[#EE4D2D] p-3 rounded-xl text-[13px] font-bold text-center">
          {error}
        </div>
      )}
      
      <div>
        <label className="text-[12px] font-bold text-[#666] block mb-1.5">Email Admin</label>
        <input 
          type="email" 
          name="email"
          required
          className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337] bg-[#fafafa] focus:bg-white transition-all" 
          placeholder="admin@tokokita.com" 
        />
      </div>

      <div>
        <label className="text-[12px] font-bold text-[#666] block mb-1.5">Password</label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password"
            required
            className="w-full p-3 pr-10 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337] bg-[#fafafa] focus:bg-white transition-all" 
            placeholder="••••••••" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333] transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="mt-2 w-full bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white font-extrabold text-[15px] py-3.5 rounded-xl shadow-[0_4px_20px_rgba(238,77,45,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(238,77,45,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Masuk...' : 'Login ke Dashboard'}
      </button>
    </form>
  )
}
