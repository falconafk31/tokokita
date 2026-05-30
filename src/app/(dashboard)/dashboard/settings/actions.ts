'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(data: any) {
  const supabase = await createClient()
  
  // Update or insert into settings where id = 1
  const payload = { id: 1, ...data }
  const { error } = await supabase.from('settings').upsert(payload)
  
  if (error) {
    console.error('Error saving settings:', error)
    return { error: error.message }
  }
  
  revalidatePath('/dashboard/settings', 'page')
  return { success: true }
}
