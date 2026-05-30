import LoginFormClient from './LoginFormClient'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <div className="font-playfair text-[28px] font-black text-[#EE4D2D] mb-2">TokoKita</div>
          <p className="text-[14px] text-[#666] font-bold">Silakan login untuk mengakses Admin Dashboard</p>
        </div>
        <LoginFormClient />
      </div>
    </div>
  )
}
