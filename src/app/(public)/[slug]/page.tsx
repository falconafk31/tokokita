import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import CountdownClient from './CountdownClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('name, description').eq('slug', slug).single()
  
  if (!product) return {}
  
  return {
    title: `Beli ${product.name} | TokoKita`,
    description: product.description?.substring(0, 160) || `Promo spesial untuk ${product.name}. Beli sekarang di TokoKita!`,
  }
}

export default async function ProductLandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  // 1. Fetch Product
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) {
    notFound()
  }

  // 2. Fetch Settings
  const { data: settings } = await supabase
    .from('settings')
    .select('redirect_delay, fb_pixel_id')
    .eq('id', 1)
    .single()

  const delay = settings?.redirect_delay || 3

  // 3. Track Click Analytics
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown'
    const ua = headersList.get('user-agent') || 'Unknown'
    
    const isMobile = /mobile/i.test(ua)
    const isTablet = /tablet|ipad/i.test(ua)
    const deviceType = isTablet ? 'Tablet' : isMobile ? 'Smartphone' : 'Desktop'

    // Deteksi bot dari social media / search engine
    let isBot = /bot|facebookexternalhit|whatsapp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(ua)
    
    // Deteksi bot dari Rate Limiting (Maksimal 5 klik per IP per menit)
    if (!isBot && ip !== 'Unknown') {
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      const { count: recentClicksFromIP } = await supabase
        .from('product_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', require('crypto').createHash('sha256').update(ip + 'TokoKitaSalt123!').digest('hex').substring(0, 16))
        .gte('created_at', oneMinuteAgo)

      if ((recentClicksFromIP || 0) >= 5) {
        isBot = true
      }
    }
    
    const finalDeviceType = isBot ? 'Bot' : deviceType

    const ipHash = ip !== 'Unknown' ? require('crypto').createHash('sha256').update(ip + 'TokoKitaSalt123!').digest('hex').substring(0, 16) : 'Unknown'

    // Fire and forget insert (don't block render)
    supabase.from('product_clicks').insert({
      product_id: product.id,
      ip_address: ipHash,
      user_agent: ua,
      device_type: finalDeviceType
    }).then(({ error }) => {
      if (error) console.error('Failed to track click:', error)
    })
  } catch (err) {
    console.error('Analytics tracking error:', err)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-5 bg-[#fcfcfc] font-nunito">
      <div className="w-full max-w-[600px] bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EE4D2D]/10 text-[#EE4D2D] mb-4">
            <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
            </svg>
          </div>
          <h1 className="text-[24px] md:text-[28px] font-black text-[#1a1a1a] font-playfair mb-2">
            Mengarahkan ke Shopee...
          </h1>
          <p className="text-[#666] text-[15px]">
            Mohon tunggu sebentar, Anda akan otomatis dialihkan ke halaman produk.
          </p>
        </div>

        <CountdownClient product={product} delay={delay} pixelId={settings?.fb_pixel_id} />

      </div>
    </div>
  )
}
