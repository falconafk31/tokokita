'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth-guard'

export async function getAdsComparisonStats(startDateStr: string, endDateStr: string) {
  let supabase;
  try {
    const auth = await requireAuth();
    supabase = auth.supabase;
  } catch (error) {
    return { error: 'Unauthorized' }
  }

  const parseDate = (dStr: string) => {
    // Jika formatnya mengandung garis miring (biasanya DD/MM/YYYY dari Meta Ads)
    if (typeof dStr === 'string' && dStr.includes('/')) {
      const parts = dStr.split('/')
      if (parts.length === 3) {
        // Asumsi format adalah DD/MM/YYYY
        // parts[0] = DD, parts[1] = MM, parts[2] = YYYY
        // Hati-hati, JS Date butuh (YYYY, MM - 1, DD)
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1
        const year = parseInt(parts[2])
        return new Date(year, month, day)
      }
    }
    // Jika formatnya berupa Excel Serial Number
    if (typeof dStr === 'number') {
      return new Date(Math.round((dStr - 25569) * 86400 * 1000))
    }
    return new Date(dStr)
  }

  let start = parseDate(startDateStr)
  let end = parseDate(endDateStr)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { error: 'Format tanggal CSV tidak dapat dikenali.' }
  }

  // Ensure start is before end (in case CSV was read backward)
  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  start.setHours(0, 0, 0, 0)
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
