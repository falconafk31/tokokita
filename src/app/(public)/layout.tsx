import Navbar from '@/components/shared/Navbar'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-[120px] md:pt-[70px] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-[#e5e5e5] mt-16 py-10 text-center text-[#999] text-[13px] font-nunito bg-white">
        <div className="font-playfair text-[20px] font-black text-[#ccc] mb-2">TokoKita</div>
        &copy; {new Date().getFullYear()} TokoKita. All rights reserved.<br/>
        <Link href="/dashboard" className="inline-block mt-4 px-5 py-2 rounded-full bg-[#f7f7f7] text-[#EE4D2D] font-bold hover:bg-[#fff8f6] transition-colors">
          ⚙️ Admin Dashboard
        </Link>
      </footer>
    </div>
  )
}
