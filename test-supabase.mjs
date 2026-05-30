import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log("Mencoba koneksi ke Supabase:", supabaseUrl)
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) {
    console.error("❌ Koneksi Gagal:", error.message)
  } else {
    console.log("✅ Koneksi Berhasil! Tabel 'products' dapat diakses.")
  }
}
test()
