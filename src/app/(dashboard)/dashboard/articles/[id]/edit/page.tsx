import Topbar from '@/components/dashboard/Topbar'
import ArticleFormClient from '../../ArticleFormClient'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: products } = await supabase.from('products').select('id, name')
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single()

  if (!article) {
    notFound()
  }

  return (
    <>
      <Topbar 
        title="Edit Artikel" 
        action={<Link href="/dashboard/articles" className="text-[#999] text-[13px] font-bold hover:text-[#1a1a1a]">Batal</Link>}
      />
      <div className="p-7">
        <ArticleFormClient initialData={article} products={products || []} />
      </div>
    </>
  )
}
