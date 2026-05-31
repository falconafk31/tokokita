import Topbar from '@/components/dashboard/Topbar'
import Link from 'next/link'
import AdsCheckerClient from './AdsCheckerClient'

export default function AdsCheckerPage() {
  return (
    <>
      <Topbar 
        title="Validasi Iklan" 
        action={
          <Link href="/dashboard/analytics" className="px-4 py-2 bg-white border border-[#e5e5e5] rounded-xl text-[13px] font-bold text-[#555] hover:bg-gray-50">
            ← Kembali ke Ringkasan
          </Link>
        }
      />
      <div className="p-7">
        <AdsCheckerClient />
      </div>
    </>
  )
}
