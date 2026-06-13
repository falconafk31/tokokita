import DashboardLayoutClient from '@/components/dashboard/DashboardLayoutClient'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('shop_name, logo_url').eq('id', 1).single()
  
  const shopName = settings?.shop_name || 'TokoKita'
  const logoUrl = settings?.logo_url || ''

  return (
    <DashboardLayoutClient shopName={shopName} logoUrl={logoUrl}>
      {children}
    </DashboardLayoutClient>
  )
}
