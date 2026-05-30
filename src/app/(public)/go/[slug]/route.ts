import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('id, shopee_affiliate_url')
    .eq('slug', slug)
    .single()

  let finalProduct = product
  
  if (!finalProduct) {
    // try by id if slug fails
    const { data: productById } = await supabase
      .from('products')
      .select('id, shopee_affiliate_url')
      .eq('id', slug)
      .single()
      
    finalProduct = productById
  }

  if (!finalProduct || !finalProduct.shopee_affiliate_url) {
    console.error("Redirect failed:", error?.message || "Product not found or no URL")
    return NextResponse.redirect(new URL('/', request.url))
  }

  await supabase.from('redirects').insert({
    product_id: finalProduct.id,
  })

  return NextResponse.redirect(finalProduct.shopee_affiliate_url, {
    status: 302,
    headers: {
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'no-store'
    }
  })
}
