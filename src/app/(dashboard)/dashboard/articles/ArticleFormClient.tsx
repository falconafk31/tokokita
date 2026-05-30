'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertArticle } from './actions'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/dashboard/RichTextEditor'), { 
  ssr: false, 
  loading: () => <div className="min-h-[400px] border border-[#e5e5e5] rounded-xl bg-white animate-pulse flex items-center justify-center text-gray-400 font-bold">Memuat Editor...</div> 
})

export default function ArticleFormClient({ initialData, products }: { initialData?: any, products: any[] }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    id: initialData?.id || undefined,
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    meta_title: initialData?.meta_title || '',
    meta_desc: initialData?.meta_desc || '',
    product_id: initialData?.product_id || '',
    redirect_delay: initialData?.redirect_delay || 3,
    published: initialData?.published || false,
    image_url: initialData?.image_url || '',
  })

  const handleSave = async (published: boolean) => {
    if (!form.title) return alert('Judul wajib diisi')
    
    setIsSaving(true)
    const payload = { ...form, published, product_id: form.product_id || null }
    await upsertArticle(payload)
    setIsSaving(false)
    router.push('/dashboard/articles')
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-[3] flex flex-col gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <label className="text-[12px] font-bold text-[#666] block mb-2">Judul Artikel *</label>
          <input 
            value={form.title} 
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
            className="w-full p-3 rounded-xl border border-[#e5e5e5] text-[15px] font-bold outline-none focus:border-[#FF7337]" 
            placeholder="Judul artikel menarik..." 
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <label className="text-[12px] font-bold text-[#666] block mb-2">Konten Artikel</label>
          <RichTextEditor content={form.content} onChange={(c) => setForm(p => ({ ...p, content: c }))} />
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="font-bold text-[15px] mb-4">SEO Meta</div>
          <div className="mb-4">
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">Meta Title</label>
            <input value={form.meta_title} onChange={e => setForm(p => ({ ...p, meta_title: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none" />
          </div>
          <div>
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">Meta Description</label>
            <textarea value={form.meta_desc} onChange={e => setForm(p => ({ ...p, meta_desc: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none h-20 resize-y" />
          </div>
        </div>
      </div>

      <div className="flex-[1] flex flex-col gap-5 sticky top-20">
        <div className="bg-white p-5 rounded-2xl border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="font-bold text-[15px] mb-4">Aksi</div>
          <button onClick={() => handleSave(false)} disabled={isSaving} className="w-full mb-3 p-3 border border-[#e5e5e5] rounded-xl bg-white text-[#666] text-[13px] font-bold hover:bg-gray-50 disabled:opacity-50">
            Simpan Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={isSaving} className="w-full p-3 border-none rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] text-white text-[13px] font-bold shadow-[0_4px_14px_rgba(238,77,45,0.25)] hover:opacity-90 disabled:opacity-50">
            {isSaving ? "Menyimpan..." : "Publish Artikel"}
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#f0f0f0] shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <div className="font-bold text-[15px] mb-4">Pengaturan Artikel</div>
          
          <div className="mb-4">
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">URL Slug</label>
            <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none" placeholder="auto-generated" />
          </div>

          <div className="mb-4">
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">URL Gambar Cover</label>
            <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none" placeholder="https://... (Opsional)" />
            {form.image_url && <img src={form.image_url} alt="Cover Preview" className="mt-2 w-full h-[120px] object-cover rounded-xl border border-[#e5e5e5]" />}
          </div>

          <div className="mb-4">
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">Produk Terkait</label>
            <select value={form.product_id} onChange={e => setForm(p => ({ ...p, product_id: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none bg-white">
              <option value="">- Tanpa Produk -</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#666] block mb-1.5">Delay Redirect (Detik)</label>
            <input type="number" value={form.redirect_delay} onChange={e => setForm(p => ({ ...p, redirect_delay: e.target.value === '' ? '' : (parseInt(e.target.value) || 0) }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
