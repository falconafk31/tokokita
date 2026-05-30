'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertArticle(data: any) {
  const supabase = await createClient()
  
  if (!data.slug && data.title) {
    data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const { error } = await supabase.from('articles').upsert(data)
  
  if (error) {
    console.error('Error upserting article', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/articles', 'page')
  revalidatePath('/(public)/blog/[slug]', 'page')
  return { success: true }
}

export async function deleteArticle(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from('articles').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting article', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/articles', 'page')
  return { success: true }
}

export async function bulkInsertArticles(dataArray: any[]) {
  const supabase = await createClient()
  
  const formattedData = dataArray.map(data => {
    if (!data.slug && data.title) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)
    }
    return data
  })

  const { error } = await supabase.from('articles').insert(formattedData)
  
  if (error) {
    console.error('Error bulk inserting articles', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/articles', 'page')
  return { success: true }
}
