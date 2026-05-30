import Image from 'next/image'
import Link from 'next/link'

const fmt = (n: number) => "Rp " + n.toLocaleString("id-ID")
const disc = (o: number, p: number) => Math.round(((o - p) / o) * 100)

export default function ArticleContent({ product }: { product: any }) {
  if (!product) return null

  return (
    <Link
      href={`/${product.slug || product.id}`}
      className="bg-[#fafafa] rounded-2xl p-5 border border-[#e5e5e5] flex gap-5 cursor-pointer hover:border-[#FF7337]/50 hover:shadow-[0_8px_30px_rgba(238,77,45,0.15)] transition-all group items-center"
    >
      <div className="relative w-[120px] h-[120px] shrink-0">
        <Image src={product.image_url} alt={product.name} fill sizes="120px" className="rounded-xl object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-[16px] font-bold text-[#1a1a1a] leading-snug mb-2 line-clamp-2">
          {product.name}
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#EE4D2D] font-black text-[22px]">{fmt(product.price)}</span>
          <span className="text-[#bbb] text-[14px] line-through">{fmt(product.original_price || product.price)}</span>
          <span className="bg-[#fff1f0] text-[#EE4D2D] text-[12px] font-extrabold px-1.5 py-0.5 rounded-md border border-[#FFD6C8] ml-2">
            -{disc(product.original_price || product.price, product.price)}%
          </span>
        </div>
        <div className="inline-block bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white font-extrabold text-[14px] py-2.5 px-6 rounded-xl border-none shadow-[0_4px_14px_rgba(238,77,45,0.3)] group-hover:-translate-y-0.5 transition-transform">
          🛒 Lihat Promo
        </div>
      </div>
    </Link>
  )
}
