import { createClient } from '@/lib/supabase/server'
import HeroBanner from '@/components/store/HeroBanner'
import PublicStoreClient from '@/components/store/PublicStoreClient'

export const revalidate = 60 // revalidate every minute for public store

export default async function PublicStore() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <HeroBanner />
      <PublicStoreClient products={products || []} />
    </>
  )
}
