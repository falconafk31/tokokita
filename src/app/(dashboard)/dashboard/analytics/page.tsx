import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/dashboard/Topbar'
import RecentClicksClient from '@/components/dashboard/RecentClicksClient'
import Image from 'next/image'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  // 1. Ambil data produk
  const { data: products } = await supabase.from('products').select('*')
  const prodList = products || []

  // 2. Ambil data klik (real-time analytics)
  const { data: clicks } = await supabase.from('product_clicks').select('*')
  const clickList = clicks || []

  // --- Kalkulasi Metrik (Hanya Manusia) ---
  const humanClicks = clickList.filter((c: any) => c.device_type !== 'Bot')
  const totalClicks = humanClicks.length
  
  // Klik Hari Ini (Berdasarkan Waktu WIB Jakarta)
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()); // Format: YYYY-MM-DD
  const todayClicks = humanClicks.filter((c: any) => c.created_at && c.created_at.startsWith(today)).length

  // Pengunjung Unik
  const uniqueIPs = new Set(humanClicks.map((c: any) => c.ip_address).filter(Boolean)).size

  // Device Dominance
  const mobileClicks = humanClicks.filter((c: any) => c.device_type === 'Smartphone').length
  const desktopClicks = humanClicks.filter((c: any) => c.device_type === 'Desktop').length
  const tabletClicks = humanClicks.filter((c: any) => c.device_type === 'Tablet').length

  const stats = [
    { label: "Total Redirect", value: totalClicks.toLocaleString('id-ID'), icon: "🚀", color: "border-l-[#EE4D2D]" },
    { label: "Redirect Hari Ini", value: todayClicks.toLocaleString('id-ID'), icon: "📅", color: "border-l-[#00B14F]" },
    { label: "Pengunjung Unik", value: uniqueIPs.toLocaleString('id-ID'), icon: "👥", color: "border-l-[#8B5CF6]" },
    { label: "Akses Mobile", value: totalClicks > 0 ? Math.round((mobileClicks / totalClicks) * 100) + "%" : "0%", icon: "📱", color: "border-l-[#FFB347]" },
  ]

  // --- Kalkulasi Produk Terpopuler (Hanya Manusia) ---
  const clickCountByProduct = humanClicks.reduce((acc: any, c: any) => {
    if (c.product_id) acc[c.product_id] = (acc[c.product_id] || 0) + 1
    return acc
  }, {})

  const topProducts = prodList
    .map(p => ({ ...p, click_count: clickCountByProduct[p.id] || 0 }))
    .sort((a, b) => b.click_count - a.click_count)
    .slice(0, 10)

  // Max click for progress bar
  const maxClick = topProducts.length > 0 ? topProducts[0].click_count : 1

  // --- Riwayat Klik Terbaru ---
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }) + ' WIB'
    } catch {
      return '??:??'
    }
  }

  const recentClicks = [...clickList]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(c => {
      const prod = prodList.find(p => p.id === c.product_id)
      return { ...c, product_name: prod?.name || 'Produk Dihapus' }
    })

  return (
    <>
      <Topbar 
        title="Real-Time Analytics" 
        action={
          <a 
            href="/api/export/analytics" 
            download
            className="flex items-center gap-2 bg-[#EE4D2D] text-white px-4 py-2 rounded-xl text-[13px] font-bold shadow-md hover:bg-[#FF7337] transition-all"
          >
            📥 Export CSV
          </a>
        }
      />
      <div className="p-7 font-nunito">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
          {stats.map(s => (
            <div key={s.label} className={`bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border-l-4 ${s.color}`}>
              <div className="text-[28px] mb-2">{s.icon}</div>
              <div className="text-[22px] font-black text-[#1a1a1a]">{s.value}</div>
              <div className="text-[12px] text-[#999] font-bold mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <h2 className="text-[16px] font-extrabold text-[#1a1a1a] mb-5 border-b border-[#f0f0f0] pb-3">🔥 10 Produk Paling Banyak Di-klik</h2>
            <div className="flex flex-col gap-4">
              {topProducts.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-6 text-center font-bold text-[#999] text-[13px]">#{i + 1}</div>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                    <Image src={p.image_url} alt={p.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-[#1a1a1a] truncate mb-1.5">{p.name}</div>
                    <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-[#EE4D2D] to-[#FF7337]"
                        style={{ width: `${Math.max((p.click_count / (maxClick || 1)) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0 min-w-[60px]">
                    <div className="text-[#EE4D2D] font-black text-[15px]">{p.click_count}</div>
                    <div className="text-[#999] text-[10px] uppercase font-bold tracking-wider">Klik</div>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center text-[#999] text-[13px] py-4">Belum ada data pelacakan klik.</div>
              )}
            </div>
          </div>

          {/* Device Breakdown & Recent Clicks */}
          <div className="flex flex-col gap-6">
            {/* Device */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] h-fit">
              <h2 className="text-[16px] font-extrabold text-[#1a1a1a] mb-5 border-b border-[#f0f0f0] pb-3">📱 Distribusi Perangkat</h2>
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span className="text-[#1a1a1a]">📱 Smartphone</span>
                    <span className="text-[#EE4D2D]">{mobileClicks} Klik</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f0f0f0]"><div className="h-full rounded-full bg-[#EE4D2D]" style={{width: `${totalClicks ? (mobileClicks/totalClicks)*100 : 0}%`}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span className="text-[#1a1a1a]">💻 Desktop / Laptop</span>
                    <span className="text-[#00B14F]">{desktopClicks} Klik</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f0f0f0]"><div className="h-full rounded-full bg-[#00B14F]" style={{width: `${totalClicks ? (desktopClicks/totalClicks)*100 : 0}%`}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold mb-2">
                    <span className="text-[#1a1a1a]">📲 Tablet</span>
                    <span className="text-[#8B5CF6]">{tabletClicks} Klik</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#f0f0f0]"><div className="h-full rounded-full bg-[#8B5CF6]" style={{width: `${totalClicks ? (tabletClicks/totalClicks)*100 : 0}%`}}></div></div>
                </div>
              </div>
            </div>

            {/* Recent Clicks with Load More */}
            <RecentClicksClient clicks={recentClicks} />
          </div>
        </div>

      </div>
    </>
  )
}
