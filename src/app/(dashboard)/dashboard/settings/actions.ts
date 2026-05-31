'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/auth-guard'

export async function updateSettings(data: any) {
  let supabase;
  try {
    const auth = await requireAuth();
    supabase = auth.supabase;
  } catch (error) {
    return { error: 'Unauthorized' }
  }
  
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
