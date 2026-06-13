import LoginFormClient from './LoginFormClient'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('shop_name, logo_url').eq('id', 1).single()
  
  const shopName = settings?.shop_name || 'TokoKita'
  const logoUrl = settings?.logo_url || ''

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-8 flex flex-col items-center">
          {logoUrl && <img src={logoUrl} alt={shopName} className="w-20 h-20 rounded-2xl object-cover mb-4 shadow-lg shadow-[#EE4D2D]/20 border border-[#f0f0f0]" />}
          <div className="font-playfair text-[28px] font-black text-[#EE4D2D] mb-2">{shopName}</div>
          <p className="text-[14px] text-[#666] font-bold">Silakan login untuk mengakses Admin Dashboard</p>
        </div>
        <LoginFormClient />
      </div>
    </div>
  )
}
