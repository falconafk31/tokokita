import Topbar from '@/components/dashboard/Topbar'
import SettingsFormClient from './SettingsFormClient'
import { createClient } from '@/lib/supabase/server'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Ambil pengaturan dengan ID = 1 (karena ini pengaturan global)
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <>
      <Topbar title="Pengaturan" />
      <div className="p-7">
        <SettingsFormClient initialData={settings || {}} />
      </div>
    </>
  )
}
