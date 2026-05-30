# TokoKita - Web Affiliate & Blog Platform

TokoKita adalah platform *landing page* afiliasi (seperti Shopee Affiliate) modern yang dirancang untuk meningkatkan konversi. Dilengkapi dengan CMS (Content Management System) internal, pelacakan *analytics real-time*, sistem penulisan artikel (Blog) ramah SEO, dan fitur *bulk upload* menggunakan Excel.

## 🚀 Fitur Utama
- **Landing Page Interaktif:** Halaman produk dengan *countdown timer* otomatis sebelum melakukan pengalihan (*redirect*) ke link afiliasi Shopee.
- **Real-Time Analytics:** Melacak seluruh pengunjung secara *real-time* (Waktu, IP, Perangkat).
- **Export CSV:** Mendukung ekspor data laporan *analytics* dalam format CSV dengan penyesuaian zona waktu WIB.
- **Bulk Upload Excel:** Menambahkan ratusan produk dan artikel sekaligus dalam hitungan detik menggunakan format file `.xlsx`.
- **Rich Text Editor:** Menulis artikel semudah mengetik di Word, yang sudah didukung *Tiptap Editor*.
- **Mobile Responsive:** UI/UX *Dashboard* dan Halaman Publik yang mewah dan dapat diakses dengan mulus dari *smartphone*.

## 🛠️ Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (Modern Glassmorphism UI)
- **Database & Auth:** Supabase (PostgreSQL)
- **Editor:** Tiptap React
- **Parser Excel:** SheetJS (`xlsx`)

## 📦 Panduan Instalasi
1. Clone repositori ini.
2. Install semua *dependencies*:
   ```bash
   npm install
   ```
3. Buat file `.env.local` di *root directory* dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## 🗄️ Supabase SQL Database Setup
Untuk menjalankan aplikasi ini dengan sempurna, jalankan perintah SQL berikut di dalam **SQL Editor** pada *Dashboard* Supabase Anda.

### 1. Tabel Produk (`products`)
```sql
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC DEFAULT 0,
  original_price NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 5,
  sold_count NUMERIC DEFAULT 0,
  shopee_affiliate_url TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Lainnya',
  slug TEXT UNIQUE NOT NULL,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Tabel Artikel (`articles`)
```sql
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Tabel Pengaturan (`settings`)
```sql
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  redirect_delay INTEGER DEFAULT 3,
  fb_pixel_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert nilai default (Wajib Dijalankan)
INSERT INTO settings (id, redirect_delay) VALUES (1, 3) ON CONFLICT (id) DO NOTHING;
```

### 4. Tabel Pelacakan Analytics (`product_clicks`)
```sql
CREATE TABLE IF NOT EXISTS product_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Konfigurasi RLS (Opsional / Keamanan)
Jika Anda menggunakan *Client Component* untuk menambah/mengedit data secara langsung (selain dari Server Actions `actions.ts`), Anda perlu mengkonfigurasi kebijakan *Row Level Security* (RLS). Namun, sistem web saat ini secara *default* sudah aman jika Anda memilih untuk **Disable RLS** atau membuat kebijakan akses publik sederhana untuk baca-tulis, karena pengolahan *database* mayoritas dikendalikan dari *Server Side*.

## 📄 Lisensi
Hak Cipta (c) 2026. Seluruh hak dilindungi.
