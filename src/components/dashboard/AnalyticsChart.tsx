'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AnalyticsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-[#999] text-[14px] bg-[#fafafa] rounded-xl border border-[#f0f0f0]">
        Data tidak cukup untuk menampilkan grafik.
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-[#f0f0f0] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <p className="text-[12px] text-[#999] font-bold mb-1">{label}</p>
          <p className="text-[14px] font-black text-[#1a1a1a]">
            {payload[0].value} <span className="text-[#EE4D2D]">Klik</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height={300} minWidth={0}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#999', fontWeight: 'bold' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11, fill: '#999', fontWeight: 'bold' }} 
            dx={-10}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            stroke="#EE4D2D" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorClicks)" 
            activeDot={{ r: 6, fill: '#EE4D2D', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
