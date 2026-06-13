'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSettings } from './actions'
import { useToast } from '@/components/shared/Toast'

export default function SettingsFormClient({ initialData }: { initialData: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    shop_name: initialData?.shop_name || 'TokoKita',
    fb_pixel_id: initialData?.fb_pixel_id || '',
    redirect_delay: initialData?.redirect_delay || 3,
    favicon_url: initialData?.favicon_url || '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    await updateSettings(form)
    setIsSaving(false)
    toast('Pengaturan berhasil disimpan!', 'success')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0] max-w-[600px]">
      <h2 className="text-[18px] font-black text-[#1a1a1a] mb-6">Pengaturan Toko</h2>
      
      <div className="space-y-6">
        <div>
          <label className="text-[13px] font-bold text-[#666] block mb-2">Nama Toko</label>
          <input 
            type="text" 
            value={form.shop_name}
            onChange={e => setForm(p => ({ ...p, shop_name: e.target.value }))}
            className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337]" 
          />
        </div>
        
        <div>
          <label className="text-[13px] font-bold text-[#666] block mb-2">Meta Ads Pixel ID</label>
          <input 
            type="text" 
            value={form.fb_pixel_id}
            onChange={e => setForm(p => ({ ...p, fb_pixel_id: e.target.value }))}
            placeholder="123456789012345"
            className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337]" 
          />
          <p className="text-[11px] text-[#999] mt-1.5 font-bold">Digunakan untuk tracking pengunjung dari Facebook/Instagram Ads.</p>
        </div>
        
        <div>
          <label className="text-[13px] font-bold text-[#666] block mb-2">Default Redirect Delay (Detik)</label>
          <input 
            type="number" 
            value={form.redirect_delay}
            onChange={e => setForm(p => ({ ...p, redirect_delay: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) }))}
            className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337]" 
          />
        </div>

        <div>
          <label className="text-[13px] font-bold text-[#666] block mb-2">URL Favicon (Ikon Tab Browser)</label>
          <input 
            type="text" 
            value={form.favicon_url}
            onChange={e => setForm(p => ({ ...p, favicon_url: e.target.value }))}
            placeholder="https://... (Opsional)"
            className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[14px] outline-none focus:border-[#FF7337]" 
          />
          {form.favicon_url && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-[12px] text-[#999] font-bold">Preview:</span>
              <img src={form.favicon_url} alt="Favicon Preview" className="w-8 h-8 rounded-md border border-[#e5e5e5] object-contain bg-[#f9f9f9]" />
            </div>
          )}
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] text-white px-6 py-3 rounded-xl text-[14px] font-bold shadow-[0_4px_14px_rgba(238,77,45,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </div>
  )
}
