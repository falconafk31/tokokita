'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkInsertArticles } from '@/app/(dashboard)/dashboard/articles/actions'
import { useToast } from '@/components/shared/Toast'

export default function BulkUploadArticles() {
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
        const formattedData = data.map((row: any) => {
          const rawContent = row['Konten'] || ''
          
          // Convert plain text newlines to HTML paragraphs, and support basic Markdown Headings
          const htmlContent = rawContent
            .split('\n')
            .filter((p: string) => p.trim() !== '')
            .map((p: string) => {
              const text = p.trim()
              if (text.startsWith('### ')) {
                return `<h3>${text.replace('### ', '')}</h3>`
              }
              if (text.startsWith('## ')) {
                return `<h2>${text.replace('## ', '')}</h2>`
              }
              if (text.startsWith('<')) {
                return text // Biarkan jika sudah mengandung tag HTML
              }
              return `<p>${text}</p>`
            })
            .join('')

          return {
            title: row['Judul'] || '',
            content: htmlContent || '<p></p>',
            image_url: row['URL Gambar Cover'] || '',
            category: row['Kategori'] || 'Umum',
            slug: row['URL Slug'] || null,
            product_id: row['Produk Terkait (ID)'] || null,
            meta_title: row['Meta Title'] || '',
            meta_desc: row['Meta Description'] || '',
            published: row['Status'] ? row['Status'].toString().toLowerCase() === 'published' : true
          }
        })

        const res = await bulkInsertArticles(formattedData)
        if (res.error) {
          toast('Gagal mengunggah artikel: ' + res.error, 'error')
        } else {
          toast(`Berhasil mengunggah ${formattedData.length} artikel!`, 'success')
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
        'Judul': 'Khasiat Daun Sirih',
        'Konten': '## Manfaat Utama\n\nDaun sirih memiliki banyak manfaat.\n\n### Sebagai Antibakteri\n\nSalah satunya adalah membunuh kuman.',
        'URL Gambar Cover': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        'Kategori': 'Kesehatan',
        'URL Slug': 'khasiat-daun-sirih',
        'Produk Terkait (ID)': '',
        'Meta Title': '5 Khasiat Daun Sirih yang Belum Anda Ketahui',
        'Meta Description': 'Pelajari manfaat rahasia daun sirih untuk kesehatan tubuh dan antibakteri alami.',
        'Status': 'published'
      }
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Template")
    XLSX.writeFile(wb, "Template_Upload_Artikel.xlsx")
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
