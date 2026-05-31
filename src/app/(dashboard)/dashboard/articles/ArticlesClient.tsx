'use client'

import { useState } from 'react'
import { deleteArticle } from './actions'
import Link from 'next/link'
import ConfirmModal from '@/components/shared/ConfirmModal'

export default function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const ITEMS_PER_PAGE = 10

  const totalPages = Math.max(1, Math.ceil(initialArticles.length / ITEMS_PER_PAGE))
  const currentArticles = initialArticles.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteArticle(itemToDelete)
      setItemToDelete(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
              {["No.", "Judul", "Kategori", "Slug", "Produk Terkait", "Status", "Aksi"].map(h => (
                <th key={h} className="p-4 text-left text-[11px] font-extrabold text-[#999] uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((a, i) => (
              <tr key={a.id} className={`border-b border-[#f7f7f7] hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                <td className="p-4 text-[13px] font-bold text-[#555]">
                  {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                </td>
                <td className="p-4 text-[13px] font-bold text-[#1a1a1a]">
                  {a.title}
                </td>
                <td className="p-4">
                  <span className="bg-[#f0f0f0] text-[#555] text-[11px] font-bold px-2 py-1 rounded-md">{a.category || 'Umum'}</span>
                </td>
                <td className="p-4 text-[#555] text-[13px] max-w-[200px] truncate">
                  /{a.slug}
                </td>
                <td className="p-4 text-[#555] text-[13px] font-semibold">
                  {a.products?.name || '-'}
                </td>
                <td className="p-4">
                  <span className={`text-[11px] font-extrabold px-2 py-1 rounded-md ${a.published ? 'bg-[#e5ffe8] text-[#00b14f]' : 'bg-[#f0f0f0] text-[#555]'}`}>
                    {a.published ? 'PUBLISHED' : 'DRAFT'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/articles/${a.id}/edit`} className="p-1.5 rounded-md border border-[#e5e5e5] bg-white text-[#555] text-[12px] hover:bg-gray-50 flex items-center justify-center no-underline">✏️</Link>
                    <button onClick={() => setItemToDelete(a.id)} className="p-1.5 rounded-md border border-[#FFD6C8] bg-[#fff8f6] text-[#EE4D2D] text-[12px] hover:bg-red-50">🗑️</button>
                    <a href={`/blog/${a.slug}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-md border border-[#e5e5e5] bg-white text-[#555] text-[12px] hover:bg-gray-50 flex items-center justify-center no-underline">👁️</a>
                  </div>
                </td>
              </tr>
            ))}
            {initialArticles.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 text-sm font-bold">
                  Belum ada artikel. Silakan buat artikel baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-[#f0f0f0] flex items-center justify-between bg-white">
          <div className="text-[13px] text-[#666] font-bold">
            Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, initialArticles.length)} dari {initialArticles.length} artikel
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

      <ConfirmModal 
        isOpen={!!itemToDelete}
        title="Hapus Artikel?"
        message="Artikel yang dihapus tidak dapat dikembalikan. URL artikel ini akan menampilkan halaman Not Found."
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  )
}
