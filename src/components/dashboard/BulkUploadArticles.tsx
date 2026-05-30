'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { bulkInsertArticles } from '@/app/(dashboard)/dashboard/articles/actions'

export default function BulkUploadArticles() {
  const fileInputRef = useRef<HTMLInputElement>(null)
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
          alert("File Excel kosong!")
          setLoading(false)
          return
        }

        // Map Excel headers to DB columns
        const formattedData = data.map((row: any) => {
          const rawContent = row['Konten'] || ''
          
          // Convert plain text newlines to HTML paragraphs
          const htmlContent = rawContent
            .split('\n')
            .filter((p: string) => p.trim() !== '')
            .map((p: string) => `<p>${p}</p>`)
            .join('')

          return {
            title: row['Judul'] || '',
            content: htmlContent || '<p></p>',
            image_url: row['URL Gambar Cover'] || '',
            status: row['Status'] || 'published'
          }
        })

        const res = await bulkInsertArticles(formattedData)
        if (res.error) {
          alert('Gagal mengunggah artikel: ' + res.error)
        } else {
          alert(`Berhasil mengunggah ${formattedData.length} artikel!`)
        }
      } catch (err) {
        console.error(err)
        alert('Terjadi kesalahan saat membaca file Excel.')
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
        'Konten': 'Daun sirih memiliki banyak manfaat.\n\nSalah satunya adalah sebagai antibakteri.',
        'URL Gambar Cover': 'https://...',
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
