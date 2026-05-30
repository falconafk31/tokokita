export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-br from-[#EE4D2D] via-[#FF7337] to-[#FFB347] py-10 px-5 text-center text-white font-nunito">
      <div className="max-w-[600px] mx-auto">
        <div className="text-[13px] font-bold opacity-85 mb-2 tracking-[2px] uppercase">
          Produk Pilihan Terbaik
        </div>
        <h1 className="font-playfair text-[clamp(28px,5vw,48px)] font-black m-0 mb-3 leading-[1.15]">
          Belanja Hemat,<br/>Kualitas Premium
        </h1>
        <p className="opacity-85 text-[15px] m-0 mb-6">
          Semua produk langsung dari Shopee dengan harga terbaik
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {["🚚 Gratis Ongkir", "⚡ Tiba Hari Ini", "✅ Garansi Ori", "💳 COD"].map(t => (
            <div key={t} className="bg-white/20 backdrop-blur-md py-2 px-4 rounded-[20px] text-[13px] font-bold border border-white/30">
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
