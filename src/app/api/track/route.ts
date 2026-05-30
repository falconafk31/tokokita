import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { productId, articleId, referrer } = await request.json()
    const supabase = await createClient()

    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') || ''

    const { error } = await supabase.from('clicks').insert({
      product_id: productId,
      article_id: articleId || null,
      user_agent: userAgent,
      ip_hash: ip ? Buffer.from(ip).toString('base64').substring(0, 32) : null,
      referrer: referrer || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
