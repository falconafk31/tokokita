import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/dashboard/Topbar'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return (
    <>
      <Topbar title="Manajemen Produk" />
      <div className="p-7">
        <ProductsClient initialProducts={products || []} />
      </div>
    </>
  )
}
