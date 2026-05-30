import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/dashboard/Topbar'
import Link from 'next/link'
import ArticlesClient from './ArticlesClient'
import BulkUploadArticles from '@/components/dashboard/BulkUploadArticles'

export default async function ArticlesPage() {
  const supabase = await createClient()
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select(`*, products (name)`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <>
      <Topbar title="Manajemen Artikel" />
      <div className="p-7">
        <div className="flex justify-end gap-2 mb-6">
          <BulkUploadArticles />
          <Link href="/dashboard/articles/new" className="bg-gradient-to-br from-[#EE4D2D] to-[#FF7337] text-white px-5 py-2.5 rounded-xl text-[13px] font-extrabold flex items-center gap-2 shadow-[0_4px_14px_rgba(238,77,45,0.3)] hover:opacity-90 transition-all">
            + Tulis Artikel
          </Link>
        </div>
        <ArticlesClient initialArticles={articles || []} />
      </div>
    </>
  )
}
