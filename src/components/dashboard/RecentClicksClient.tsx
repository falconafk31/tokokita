'use client'

import { useState } from 'react'

import Link from 'next/link'

export default function RecentClicksClient({ clicks, totalCount }: { clicks: any[], totalCount: number }) {
  const displayedClicks = clicks.slice(0, 10)

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      const dateStr = d.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: '2-digit', month: 'short' })
      const timeStr = d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
      return `${dateStr}, ${timeStr} WIB`
    } catch {
      return '??:??'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex-1 h-fit">
      <h2 className="text-[16px] font-extrabold text-[#1a1a1a] mb-5 border-b border-[#f0f0f0] pb-3 flex justify-between items-center">
        <span>⏱️ 10 Klik Terbaru</span>
        <span className="text-[11px] font-bold text-[#999] bg-[#f0f0f0] px-2 py-1 rounded-md">{totalCount} Total</span>
      </h2>
      <div className="flex flex-col gap-4">
        {displayedClicks.map((c: any) => (
          <div key={c.id} className="flex flex-col gap-1 border-l-2 border-[#EE4D2D] pl-3">
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-black text-[#1a1a1a] truncate pr-2">{c.product_name}</span>
              <span className="text-[10px] font-bold text-[#EE4D2D] whitespace-nowrap bg-[#fff1f0] px-2 py-0.5 rounded-md">
                {formatTime(c.created_at)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#999] text-[11px] font-bold">
              <span>IP: {c.ip_address}</span>
              {c.device_type === 'Bot' ? (
                <span className="text-[#FF9800] bg-[#FFF3E0] px-1.5 py-0.5 rounded-sm">🤖 Bot / Crawler</span>
              ) : (
                <span>{c.device_type}</span>
              )}
            </div>
          </div>
        ))}
        {clicks.length === 0 && (
          <div className="text-center text-[#999] text-[13px] py-2">Belum ada aktivitas.</div>
        )}
      </div>
      
      {totalCount > 10 && (
        <Link 
          href="/dashboard/analytics/history"
          className="w-full mt-5 py-2.5 rounded-xl border border-[#e5e5e5] text-[13px] font-bold text-[#555] hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          Lihat Semua Riwayat →
        </Link>
      )}
    </div>
  )
}
