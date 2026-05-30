'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkInsertProducts } from '@/app/(dashboard)/dashboard/products/actions'
import { useToast } from '@/components/shared/Toast'

export default function BulkUploadProducts() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        if (data.length === 0) {
          toast("File Excel kosong!", 'error')
          setLoading(false)
          return
        }

        // Map Excel headers to DB columns
        const formattedData = data.map((row: any) => ({
          name: row['Nama Produk'] || '',
          description: row['Deskripsi'] || '',
          original_price: Number(row['Harga Asli']) || 0,
          price: Number(row['Harga Diskon']) || 0,
          category: row['Kategori'] || 'Lainnya',
          image_url: row['URL Gambar'] || '',
          shopee_affiliate_url: row['Link Shopee'] || '',
          rating: Number(row['Rating']) || 0,
          sold_count: Number(row['Terjual']) || 0,
        }))

        const res = await bulkInsertProducts(formattedData)
        if (res.error) {
          toast('Gagal mengunggah produk: ' + res.error, 'error')
        } else {
          toast(`Berhasil mengunggah ${formattedData.length} produk!`, 'success')
        }
      } catch (err) {
        console.error(err)
        toast('Terjadi kesalahan saat membaca file Excel.', 'error')
      } finally {
        setLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        'Nama Produk': 'Contoh Baju SD',
        'Deskripsi': 'Deskripsi singkat...',
        'Harga Asli': 150000,
        'Harga Diskon': 120000,
        'Kategori': 'Seragam',
        'URL Gambar': 'https://...',
        'Link Shopee': 'https://shope.ee/...',
        'Rating': 4.8,
        'Terjual': 150
      }
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, "Template_Upload_Produk.xlsx")
  }

  return (
    <div className="flex gap-2">
      <input 
        type="file" 
        accept=".xlsx, .xls" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
      />
      <button 
        onClick={downloadTemplate}
        className="px-4 py-2 bg-white text-[#555] border border-[#e5e5e5] rounded-xl text-[13px] font-bold hover:bg-gray-50 flex items-center gap-2"
        title="Download Template Excel"
      >
        📄 Template
      </button>
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="px-4 py-2 bg-gradient-to-r from-[#00B14F] to-[#00D15F] text-white rounded-xl text-[13px] font-bold shadow-md hover:opacity-90 flex items-center gap-2"
      >
        {loading ? '⏳ Mengunggah...' : '📤 Upload Excel'}
      </button>
    </div>
  )
}
