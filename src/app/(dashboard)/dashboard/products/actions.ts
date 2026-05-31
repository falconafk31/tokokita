'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth-guard'

export async function upsertProduct(data: any) {
  let supabase;
  try {
    const auth = await requireAuth();
    supabase = auth.supabase;
  } catch (error) {
    return { error: 'Unauthorized' }
  }
  
  // generate slug if new
  if (!data.slug && data.name) {
    data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const { error } = await supabase.from('products').upsert(data)
  
  if (error) {
    console.error('Error upserting product', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/products', 'page')
  revalidatePath('/(public)', 'page')
  return { success: true }
}

export async function deleteProduct(id: string) {
  let supabase;
  try {
    const auth = await requireAuth();
    supabase = auth.supabase;
  } catch (error) {
    return { error: 'Unauthorized' }
  }
  
  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('Error deleting product', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/products', 'page')
  revalidatePath('/(public)', 'page')
  return { success: true }
}

export async function bulkInsertProducts(dataArray: any[]) {
  let supabase;
  try {
    const auth = await requireAuth();
    supabase = auth.supabase;
  } catch (error) {
    return { error: 'Unauthorized' }
  }
  
  // Format slugs for new items
  const formattedData = dataArray.map(data => {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)
    }
    return data
  })

  const { error } = await supabase.from('products').insert(formattedData)
  
  if (error) {
    console.error('Error bulk inserting products', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/products', 'page')
  revalidatePath('/(public)', 'page')
  return { success: true }
}
