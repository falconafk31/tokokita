import Topbar from '@/components/dashboard/Topbar'
import ArticleFormClient from '../ArticleFormClient'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function NewArticlePage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from('products').select('id, name')

  return (
    <>
      <Topbar 
        title="Tulis Artikel Baru" 
        action={<Link href="/dashboard/articles" className="text-[#999] text-[13px] font-bold hover:text-[#1a1a1a]">Batal</Link>}
      />
      <div className="p-7">
        <ArticleFormClient products={products || []} />
      </div>
    </>
  )
}
