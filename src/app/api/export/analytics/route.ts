import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: clicks } = await supabase.from('product_clicks').select('*').order('created_at', { ascending: false })
  const { data: products } = await supabase.from('products').select('id, name')

  if (!clicks || clicks.length === 0) {
    return new NextResponse('Tidak ada data analytics.', { status: 404 })
  }

  // Create a dictionary for quick product name lookup
  const productMap = (products || []).reduce((acc: any, p: any) => {
    acc[p.id] = p.name
    return acc
  }, {})

  // CSV Header
  const headers = ['Waktu (WIB)', 'Nama Produk', 'IP Address', 'Sistem Operasi / Perangkat']
  
  // CSV Rows
  const rows = clicks.map((c: any) => {
    // Convert to WIB
    const dateStr = new Date(c.created_at).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB'

    const productName = productMap[c.product_id] || 'Produk Dihapus'
    
    // Escape quotes for CSV
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`

    return [
      escapeCsv(dateStr),
      escapeCsv(productName),
      escapeCsv(c.ip_address || '-'),
      escapeCsv(c.device_type || 'Unknown')
    ].join(',')
  })

  const csvContent = [headers.join(','), ...rows].join('\n')

  return new NextResponse('\uFEFF' + csvContent, { // \uFEFF for Excel UTF-8 BOM
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Laporan_Analytics_TokoKita.csv"',
    },
  })
}
