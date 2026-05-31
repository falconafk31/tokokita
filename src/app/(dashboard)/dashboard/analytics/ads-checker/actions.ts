'use server'

import { createClient } from '@/lib/supabase/server'

export async function getAdsComparisonStats(startDateStr: string, endDateStr: string) {
  const supabase = await createClient()

  // Ensure dates cover the whole day for end date
  const start = new Date(startDateStr)
  start.setHours(0, 0, 0, 0)
  
  const end = new Date(endDateStr)
  end.setHours(23, 59, 59, 999)

  const { data: clicks, error } = await supabase
    .from('product_clicks')
    .select('device_type, created_at')
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString())

  if (error) {
    return { error: error.message }
  }

  const botClicks = clicks.filter(c => c.device_type === 'Bot').length
  const humanClicks = clicks.length - botClicks

  return {
    success: true,
    data: {
      total_recorded: clicks.length,
      human_clicks: humanClicks,
      bot_clicks: botClicks,
      start_date: start.toISOString(),
      end_date: end.toISOString()
    }
  }
}
