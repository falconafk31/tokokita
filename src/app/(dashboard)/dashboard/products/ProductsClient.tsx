'use client'

import { useState } from 'react'
import Image from 'next/image'
import { upsertProduct, deleteProduct } from './actions'
import BulkUploadProducts from '@/components/dashboard/BulkUploadProducts'
import ConfirmModal from '@/components/shared/ConfirmModal'

const BADGES = ["BARU", "TERLARIS", "HOT 🔥", "SALE", "DISKON 38%", "TOP RATED"]

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")
const disc = (o: number, p: number) => Math.round(((o - p) / o) * 100)

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // newest, oldest
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 10

  const dynamicCategories = Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)))

  const sortedProducts = [...initialProducts].sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime()
    const timeB = new Date(b.created_at || 0).getTime()
    return sortBy === 'newest' ? timeB - timeA : timeA - timeB
  })

  const filteredProducts = sortedProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const currentProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const EMPTY = {
    name: "", category: "Fashion", price: "", original_price: "",
    image_url: "", shopee_affiliate_url: "", badge: "BARU", rating: 4.5, sold_count: 0,
  }
  const [form, setForm] = useState(EMPTY)

  const openAdd = () => { setForm(EMPTY); setEditData(null); setShowForm(true); }
  const openEdit = (p: any) => {
    setForm({ ...p, price: String(p.price), original_price: String(p.original_price || p.price) })
    setEditData(p)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.shopee_affiliate_url) return
    setIsSaving(true)
    
    const payload: any = {
      ...form,
      price: parseInt(form.price as string),
      original_price: parseInt((form.original_price || form.price) as string),
      sold_count: parseInt(form.sold_count as unknown as string) || 0,
      rating: parseFloat(form.rating as unknown as string) || 4.5,
    }
    
    if (editData) {
      payload.id = editData.id
    } else {
      payload.image_url = form.image_url || `https://placehold.co/400x400/FFE5E5/EE4D2D?text=${encodeURIComponent(form.name.slice(0,12))}`
    }

    await upsertProduct(payload)
    setIsSaving(false)
    setShowForm(false)
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteProduct(itemToDelete)
      setItemToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <label className="text-[13px] font-bold text-[#666]">Urutkan:</label>
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)} 
            className="p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337] bg-white font-bold"
          >
            <option value="newest">Tanggal Terbaru</option>
            <option value="oldest">Tanggal Terlama</option>
          </select>
          <input 
            type="text" 
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337] bg-white min-w-[200px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <BulkUploadProducts />
          <button onClick={openAdd} className="bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white px-5 py-2.5 rounded-xl text-[13px] font-extrabold flex items-center gap-2 shadow-[0_4px_14px_rgba(238,77,45,0.3)] hover:opacity-90 transition-all">
            + Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                {["No.", "Produk", "Kategori", "Harga", "Diskon", "Terjual", "Rating", "Link Shopee", "Aksi"].map(h => (
                  <th key={h} className="p-4 text-left text-[11px] font-extrabold text-[#999] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p, i) => (
                <tr key={p.id} className={`border-b border-[#f7f7f7] hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                  <td className="p-4 text-[13px] font-bold text-[#555]">
                    {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#fafafa]">
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/FFE5E5/EE4D2D?text=No+Img` }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="text-[13px] font-bold text-[#1a1a1a] max-w-[160px] line-clamp-2">
                        {p.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-[#f0f0f0] text-[#555] text-[11px] font-bold px-2 py-1 rounded-md">{p.category}</span>
                  </td>
                  <td className="p-4 text-[#EE4D2D] font-extrabold text-[14px] whitespace-nowrap">
                    {fmt(p.price)}
                  </td>
                  <td className="p-4">
                    <span className="bg-[#fff1f0] text-[#EE4D2D] text-[12px] font-extrabold px-2 py-1 rounded-md">
                      -{disc(p.original_price, p.price)}%
                    </span>
                  </td>
                  <td className="p-4 text-[#555] text-[13px] font-semibold">{p.sold_count?.toLocaleString('id-ID') || 0}</td>
                  <td className="p-4 text-[#1a1a1a] text-[13px] font-bold">⭐ {p.rating}</td>
                  <td className="p-4 max-w-[160px]">
                    <a href={p.shopee_affiliate_url} target="_blank" rel="noreferrer" className="text-[#EE4D2D] text-[11px] font-bold no-underline block truncate">
                      🔗 {p.shopee_affiliate_url?.replace("https://", "")}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-md border border-[#e5e5e5] bg-white text-[#555] text-[12px] hover:bg-gray-50">✏️</button>
                      <button onClick={() => setItemToDelete(p.id)} className="p-1.5 rounded-md border border-[#FFD6C8] bg-[#fff8f6] text-[#EE4D2D] text-[12px] hover:bg-red-50">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 text-sm font-bold">
                    Belum ada produk. Silakan tambah produk baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#f0f0f0] flex items-center justify-between bg-white">
            <div className="text-[13px] text-[#666] font-bold">
              Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} dari {filteredProducts.length} produk
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[#e5e5e5] rounded-xl text-[13px] font-bold text-[#555] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              <div className="px-4 py-2 bg-[#fafafa] rounded-xl text-[13px] font-bold text-[#1a1a1a] border border-[#f0f0f0]">
                {currentPage} / {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[#e5e5e5] rounded-xl text-[13px] font-bold text-[#555] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-7 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-[18px]">
                {editData ? "✏️ Edit Produk" : "➕ Tambah Produk Baru"}
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Nama Produk *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="Nama produk..." />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">🔗 Link Affiliate Shopee *</label>
                <input type="url" value={form.shopee_affiliate_url} onChange={e => setForm(p => ({ ...p, shopee_affiliate_url: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="https://shp.ee/xxxxx" />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Harga Jual *</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="89000" />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Harga Asli</label>
                <input type="number" value={form.original_price} onChange={e => setForm(p => ({ ...p, original_price: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="145000" />
              </div>
              <div className="col-span-2">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">URL Foto Produk</label>
                <input type="url" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="https://..." />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Kategori</label>
                <input 
                  list="categories-list" 
                  value={form.category} 
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))} 
                  className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337] bg-white" 
                  placeholder="Ketik atau pilih kategori..."
                />
                <datalist id="categories-list">
                  {dynamicCategories.map((c: any) => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Badge Label</label>
                <select value={form.badge} onChange={e => setForm(p => ({ ...p, badge: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337] bg-white">
                  {BADGES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Rating (1-5)</label>
                <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseFloat(e.target.value) || 0 }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="4.5" />
              </div>
              <div className="col-span-1">
                <label className="text-[12px] font-bold text-[#666] block mb-1.5">Terjual</label>
                <input type="number" min="0" value={form.sold_count} onChange={e => setForm(p => ({ ...p, sold_count: parseInt(e.target.value) || 0 }))} className="w-full p-2.5 rounded-xl border border-[#e5e5e5] text-[13px] outline-none focus:border-[#FF7337]" placeholder="0" />
              </div>
            </div>

            {form.shopee_affiliate_url && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#fff8f6] border border-[#FFD6C8]">
                <div className="text-[11px] font-extrabold text-[#EE4D2D] mb-1">PREVIEW LINK SHOPEE</div>
                <a href={form.shopee_affiliate_url} target="_blank" rel="noreferrer" className="text-[#EE4D2D] text-[12px] break-all">
                  {form.shopee_affiliate_url}
                </a>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 p-3 border border-[#e5e5e5] rounded-xl bg-white text-[#666] text-[14px] font-bold hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleSave} disabled={isSaving} className="flex-[2] p-3 border-none rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#FF7337] text-white text-[14px] font-bold shadow-[0_8px_20px_rgba(238,77,45,0.25)] hover:opacity-90 disabled:opacity-50">
                {isSaving ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!itemToDelete}
        title="Hapus Produk?"
        message="Produk yang dihapus tidak dapat dikembalikan lagi. Klik pada produk yang telah di-share akan error."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  )
}
