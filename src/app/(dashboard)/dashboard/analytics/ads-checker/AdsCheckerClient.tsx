'use client'

import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { getAdsComparisonStats } from './actions'

export default function AdsCheckerClient() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [reportData, setReportData] = useState<{
    adsClicks: number;
    startDate: string;
    endDate: string;
    amountSpent: number;
    costPerClick: number;
    demographics?: {
      gender: { name: string, pct: number }[];
      age: { name: string, pct: number }[];
    }
  } | null>(null)

  const [dbStats, setDbStats] = useState<{
    total_recorded: number;
    human_clicks: number;
    bot_clicks: number;
  } | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    setReportData(null)
    setDbStats(null)

    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws)

        if (data.length === 0) {
          setError("File CSV/Excel kosong!")
          setLoading(false)
          return
        }

        // 1. Cari baris ringkasan untuk total klik (biasanya baris pertama atau Campaign name kosong)
        // Meta Ads biasanya menaruh ringkasan di data[0] pada file XLSX.
        const summaryRow = data.find((row: any) => !row['Campaign name'] || row['Campaign name'] === 'All' || row['Campaign name'] === '') || data[0]
        
        const totalAdsClicks = Number(summaryRow['Link clicks']) || 0
        const totalSpent = Number(summaryRow['Amount spent (IDR)']) || 0
        const reportingStarts = summaryRow['Reporting starts'] || ''
        const reportingEnds = summaryRow['Reporting ends'] || ''

        if (totalAdsClicks === 0) {
          setError("Tidak menemukan kolom 'Link clicks' atau nilainya 0 pada file ini.")
          setLoading(false)
          return
        }

        // 2. Ekstrak Demografi (Gender & Age)
        const genderMap: Record<string, number> = {}
        const ageMap: Record<string, number> = {}
        let hasDemographics = false

        data.forEach((row: any) => {
          const clicks = Number(row['Link clicks']) || 0
          if (clicks > 0) {
            const age = row['Age']
            const gender = row['Gender']
            const day = row['Day']

            // Agar tidak double count dengan breakdown Day, kita abaikan baris yang memiliki hari spesifik
            // JIKA ada baris harian. Namun jika report HANYA Harian, kita harus hitung. 
            // Cara paling aman untuk rasio demografi: jumlahkan saja semuanya. Rasio persen akan tetap sama walau double count.
            if (age && age !== 'All' && age !== '') {
              ageMap[age] = (ageMap[age] || 0) + clicks
              hasDemographics = true
            }
            if (gender && gender !== 'All' && gender !== '' && gender !== 'unknown' && gender !== 'uncategorized') {
              genderMap[gender] = (genderMap[gender] || 0) + clicks
              hasDemographics = true
            }
          }
        })

        // Normalisasi menjadi persentase (Top 5)
        const normalize = (map: Record<string, number>) => {
          const total = Object.values(map).reduce((a, b) => a + b, 0)
          if (total === 0) return []
          return Object.entries(map)
            .map(([name, count]) => ({ name, pct: Math.round((count / total) * 100) }))
            .sort((a, b) => b.pct - a.pct)
            .slice(0, 5)
        }

        const report = {
          adsClicks: totalAdsClicks,
          amountSpent: totalSpent,
          costPerClick: totalSpent / totalAdsClicks,
          startDate: reportingStarts,
          endDate: reportingEnds,
          demographics: hasDemographics ? {
            gender: normalize(genderMap),
            age: normalize(ageMap)
          } : undefined
        }

        setReportData(report)

        // Tarik data dari database internal TokoKita
        if (reportingStarts && reportingEnds) {
          const res = await getAdsComparisonStats(reportingStarts, reportingEnds)
          if (res.error) {
            setError("Gagal menarik data dari database: " + res.error)
          } else if (res.data) {
            setDbStats(res.data)
          }
        } else {
          setError("Tidak menemukan kolom tanggal laporan (Reporting starts / ends).")
        }

      } catch (err) {
        console.error(err)
        setError("Gagal memproses file. Pastikan format CSV dari Meta Ads belum diubah.")
      } finally {
        setLoading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  const fmt = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID")

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#f0f0f0] font-nunito">
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#fff1f0] rounded-full flex items-center justify-center text-[28px] mx-auto mb-4 border border-[#FFD6C8]">
          📊
        </div>
        <h2 className="text-[20px] font-black text-[#1a1a1a] mb-2 font-playfair">Analisa Hasil Iklan (CSV Checker)</h2>
        <p className="text-[#666] text-[14px] max-w-[500px] mx-auto">
          Unggah file CSV Laporan dari platform iklan Anda (contoh: Meta Ads). Sistem akan membandingkan jumlah klik yang ditagih oleh pihak Iklan dengan klik nyata Manusia di sistem TokoKita.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <input 
          type="file" 
          accept=".csv, .xlsx, .xls" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="px-8 py-3.5 bg-[#1a1a1a] text-white rounded-xl text-[14px] font-extrabold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? '⏳ Memproses File...' : '📁 Pilih File CSV Laporan Iklan'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#fff1f0] text-[#EE4D2D] text-[13px] font-bold rounded-xl text-center mb-8 border border-[#FFD6C8]">
          {error}
        </div>
      )}

      {reportData && dbStats && (
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-between items-center bg-[#fafafa] p-4 rounded-xl border border-[#e5e5e5]">
            <div className="text-[13px] font-bold text-[#555]">
              📅 Rentang Laporan: <span className="text-[#1a1a1a] ml-1">{reportData.startDate} — {reportData.endDate}</span>
            </div>
            <div className="text-[13px] font-bold text-[#555]">
              Total Biaya Iklan: <span className="text-[#EE4D2D] ml-1">{fmt(reportData.amountSpent)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-white border-2 border-[#1877F2]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1877F2]"></div>
              <div className="text-[12px] font-bold text-[#666] mb-1">Data dari Iklan (Meta/FB)</div>
              <div className="text-[32px] font-black text-[#1a1a1a] mb-1">{reportData.adsClicks.toLocaleString('id-ID')} <span className="text-[16px] text-[#999] font-bold">Klik</span></div>
              <div className="text-[11px] font-bold text-[#999]">Cost per Click: {fmt(reportData.costPerClick)}</div>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-[#00B14F]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00B14F]"></div>
              <div className="text-[12px] font-bold text-[#666] mb-1">Klik Manusia (TokoKita)</div>
              <div className="text-[32px] font-black text-[#00B14F] mb-1">{dbStats.human_clicks.toLocaleString('id-ID')} <span className="text-[16px] text-[#999] font-bold">Klik</span></div>
              <div className="text-[11px] font-bold text-[#00B14F]">Valid Traffic</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FFF3E0] border-2 border-[#FF9800]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9800]"></div>
              <div className="text-[12px] font-bold text-[#666] mb-1">Bot / Invalid Clicks</div>
              <div className="text-[32px] font-black text-[#FF9800] mb-1">{dbStats.bot_clicks.toLocaleString('id-ID')} <span className="text-[16px] text-[#999] font-bold">Klik</span></div>
              <div className="text-[11px] font-bold text-[#FF9800]">Terindikasi Fraud/Spam</div>
            </div>
          </div>

          {/* Insight Demografi */}
          {reportData.demographics && (reportData.demographics.gender.length > 0 || reportData.demographics.age.length > 0) && (
            <div className="mb-8 p-6 rounded-2xl bg-white border border-[#e5e5e5] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="text-[16px] font-black text-[#1a1a1a] mb-5 border-b border-[#f0f0f0] pb-3">👥 Insight Audiens (Dari Iklan)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gender */}
                {reportData.demographics.gender.length > 0 && (
                  <div>
                    <h4 className="text-[13px] font-bold text-[#666] mb-4">Distribusi Gender</h4>
                    <div className="space-y-3">
                      {reportData.demographics.gender.map(g => (
                        <div key={g.name}>
                          <div className="flex justify-between text-[13px] font-bold mb-1.5">
                            <span className="text-[#1a1a1a] capitalize">{g.name === 'male' ? 'Laki-laki' : g.name === 'female' ? 'Perempuan' : g.name}</span>
                            <span className="text-[#8B5CF6]">{g.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                            <div className="h-full rounded-full bg-[#8B5CF6]" style={{ width: `${g.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Age */}
                {reportData.demographics.age.length > 0 && (
                  <div>
                    <h4 className="text-[13px] font-bold text-[#666] mb-4">Kelompok Umur Teratas</h4>
                    <div className="space-y-3">
                      {reportData.demographics.age.map(a => (
                        <div key={a.name}>
                          <div className="flex justify-between text-[13px] font-bold mb-1.5">
                            <span className="text-[#1a1a1a]">{a.name} Tahun</span>
                            <span className="text-[#FF9800]">{a.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#f0f0f0] overflow-hidden">
                            <div className="h-full rounded-full bg-[#FF9800]" style={{ width: `${a.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analisa Kesimpulan */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#fafafa] to-white border border-[#e5e5e5]">
            <h3 className="text-[16px] font-black text-[#1a1a1a] mb-4">💡 Kesimpulan Analisis</h3>
            
            <div className="space-y-4">
              {reportData.adsClicks > dbStats.human_clicks ? (
                <div className="flex gap-3">
                  <div className="text-[20px]">⚠️</div>
                  <div>
                    <div className="text-[13px] font-black text-[#EE4D2D] mb-1">Terjadi Kebocoran Iklan (Discrepancy)</div>
                    <div className="text-[13px] text-[#555] leading-relaxed">
                      Pihak Iklan menagih Anda untuk <strong>{reportData.adsClicks} klik</strong>, namun TokoKita hanya merekam <strong>{dbStats.human_clicks} klik manusia</strong>. 
                      Selisih <strong>{reportData.adsClicks - dbStats.human_clicks} klik</strong> kemungkinan adalah klik tidak sengaja, klik ganda, <i>bounce</i> sebelum halaman termuat penuh, atau klik dari mesin <i>(Bot)</i> milik pengiklan.
                    </div>
                    <div className="mt-2 text-[12px] font-bold bg-[#fff1f0] text-[#EE4D2D] inline-block px-3 py-1.5 rounded-lg border border-[#FFD6C8]">
                      💸 Estimasi Kerugian (Bot/Invalid): {fmt((reportData.adsClicks - dbStats.human_clicks) * reportData.costPerClick)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="text-[20px]">✅</div>
                  <div>
                    <div className="text-[13px] font-black text-[#00B14F] mb-1">Performa Iklan Sangat Baik</div>
                    <div className="text-[13px] text-[#555] leading-relaxed">
                      Jumlah klik manusia yang terekam di sistem TokoKita lebih besar atau sama dengan jumlah yang dilaporkan oleh Iklan. Trafik Anda valid dan berkualitas tinggi.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
