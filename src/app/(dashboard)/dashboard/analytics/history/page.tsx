import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/dashboard/Topbar'
import Link from 'next/link'

export default async function AnalyticsHistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams
  const currentPage = parseInt(page || '1') || 1
  const ITEMS_PER_PAGE = 50

  const supabase = await createClient()

  // Ambil total count
  const { count, error: countError } = await supabase
    .from('product_clicks')
    .select('*', { count: 'exact', head: true })

  const totalItems = count || 0
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  // Ambil data klik dengan pagination (offset, limit)
  const { data: clicks } = await supabase
    .from('product_clicks')
    .select(`
      *,
      product:products(name)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const dateStr = d.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short', year: 'numeric' })
      const timeStr = d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
      return `${dateStr}, ${timeStr} WIB`
    } catch {
      return '??:??'
    }
  }

  return (
    <>
      <Topbar 
        title="Semua Riwayat Klik" 
        action={
          <Link href="/dashboard/analytics" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-xl text-[13px] font-bold text-[#555] hover:bg-gray-50">
            ← Kembali ke Ringkasan
          </Link>
        }
      />
      <div className="p-7 font-nunito">
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
          <div className="p-5 border-b border-[#f0f0f0] flex justify-between items-center bg-[#fafafa]">
            <h2 className="text-[15px] font-black text-[#1a1a1a]">Riwayat Klik Lengkap</h2>
            <div className="text-[12px] font-bold text-[#666]">
              Total {totalItems.toLocaleString('id-ID')} Klik Terdeteksi
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#f0f0f0] bg-white">
                  {["Waktu Akses", "Produk", "IP Address", "Device / Bot"].map(h => (
                    <th key={h} className="p-4 text-left text-[11px] font-extrabold text-[#999] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clicks?.map((c: any, i: number) => (
                  <tr key={c.id} className={`border-b border-[#f7f7f7] hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white'}`}>
                    <td className="p-4 text-[12px] font-bold text-[#1a1a1a] whitespace-nowrap">
                      {formatTime(c.created_at)}
                    </td>
                    <td className="p-4 text-[13px] font-bold text-[#EE4D2D]">
                      {c.product?.name || <span className="text-[#999] italic">Produk Dihapus</span>}
                    </td>
                    <td className="p-4 text-[12px] font-bold text-[#555] font-mono">
                      {c.ip_address || '-'}
                    </td>
                    <td className="p-4">
                      {c.device_type === 'Bot' ? (
                        <span className="text-[#FF9800] bg-[#FFF3E0] px-2 py-1 rounded-md text-[11px] font-black tracking-wide uppercase border border-[#FFE0B2]">
                          🤖 Bot Terdeteksi
                        </span>
                      ) : (
                        <span className="text-[#00B14F] bg-[#E5F7ED] px-2 py-1 rounded-md text-[11px] font-black tracking-wide uppercase border border-[#B3EBC8]">
                          👤 {c.device_type}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!clicks || clicks.length === 0) && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[#999] font-bold text-[13px]">
                      Belum ada data klik sama sekali.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-5 border-t border-[#f0f0f0] flex items-center justify-between bg-white">
              <div className="text-[12px] text-[#666] font-bold">
                Menampilkan {offset + 1} - {Math.min(offset + ITEMS_PER_PAGE, totalItems)} dari {totalItems.toLocaleString('id-ID')}
              </div>
              <div className="flex gap-2">
                <Link 
                  href={`/dashboard/analytics/history?page=${Math.max(1, currentPage - 1)}`}
                  className={`px-4 py-2 border border-[#e5e5e5] rounded-xl text-[13px] font-bold transition-all ${currentPage === 1 ? 'text-[#ccc] cursor-not-allowed pointer-events-none' : 'text-[#555] hover:bg-gray-50'}`}
                >
                  ← Prev
                </Link>
                <div className="px-4 py-2 bg-[#fafafa] rounded-xl text-[13px] font-bold text-[#1a1a1a] border border-[#f0f0f0]">
                  Hal {currentPage} / {totalPages}
                </div>
                <Link 
                  href={`/dashboard/analytics/history?page=${Math.min(totalPages, currentPage + 1)}`}
                  className={`px-4 py-2 border border-[#e5e5e5] rounded-xl text-[13px] font-bold transition-all ${currentPage === totalPages ? 'text-[#ccc] cursor-not-allowed pointer-events-none' : 'text-[#555] hover:bg-gray-50'}`}
                >
                  Next →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
