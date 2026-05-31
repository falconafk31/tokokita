const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const articles = [
  {
    'Judul': '5 Rahasia Skincare Rutin ala Artis Korea',
    'Konten': 'Memiliki kulit wajah yang *glowing* seperti artis Korea bukanlah mimpi. Semuanya bermula dari rutinitas yang benar!\n\n## 1. Double Cleansing\n\nLangkah pertama yang paling penting adalah *double cleansing*. Gunakan pembersih berbahan dasar minyak (oil-based) terlebih dahulu.\n\n### Mengapa Oil-Based?\n\nMinyak mampu mengangkat sisa makeup dan kotoran yang menyumbat pori-pori dengan jauh lebih efektif dibandingkan sabun air biasa.\n\n## 2. Eksfoliasi Berkala\n\nJangan lupa eksfoliasi maksimal 2 kali seminggu untuk mengangkat sel kulit mati. \n\nDapatkan produk perawatan terbaik di toko kami!',
    'URL Gambar Cover': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop',
    'Kategori': 'Kecantikan',
    'URL Slug': 'rahasia-skincare-korea-glowing',
    'Produk Terkait (ID)': '',
    'Meta Title': '5 Rahasia Skincare Rutin ala Artis Korea untuk Kulit Glowing',
    'Meta Description': 'Bongkar rahasia rutinitas skincare artis Korea mulai dari double cleansing hingga eksfoliasi agar kulit wajah glowing maksimal.',
    'Status': 'published'
  },
  {
    'Judul': 'Setup Meja Kerja Minimalis untuk Produktivitas Ekstra',
    'Konten': 'Meja kerja yang berantakan adalah musuh utama dari produktivitas. Mari kita sulap meja Anda!\n\n## Singkirkan Barang Tidak Perlu\n\nBersihkan meja Anda dari tumpukan kertas. Gunakan laci atau folder khusus.\n\n## Pencahayaan yang Tepat\n\n### Lampu Meja LED\n\nGunakan lampu meja dengan temperatur warna *warm white* agar mata tidak mudah lelah menatap layar komputer seharian.\n\n### Posisi Monitor\n\nPastikan monitor berada sejajar dengan mata (eye-level).',
    'URL Gambar Cover': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop',
    'Kategori': 'Produktivitas',
    'URL Slug': 'setup-meja-kerja-minimalis',
    'Produk Terkait (ID)': '',
    'Meta Title': 'Panduan Setup Meja Kerja Minimalis Anti Berantakan',
    'Meta Description': 'Tingkatkan produktivitas kerja di rumah dengan setup meja minimalis, pencahayaan LED, dan manajemen kabel yang rapi.',
    'Status': 'published'
  },
  {
    'Judul': 'Cara Memilih Kopi Roasting yang Pas untuk Lambung',
    'Konten': 'Pecinta kopi seringkali khawatir dengan masalah asam lambung. Padahal, kuncinya ada pada profil *roasting* (pemanggangan).\n\n## Light vs Dark Roast\n\nBanyak yang mengira kopi hitam pekat (Dark Roast) memiliki kafein tertinggi, padahal salah!\n\n### Light Roast\n\nKopi jenis ini justru memiliki kadar kafein tertinggi dan keasaman (acidity) yang sangat kuat. Kurang cocok untuk penderita maag.\n\n### Dark Roast\n\nKopi Dark Roast memiliki kadar asam lambung yang lebih rendah karena proses pemanggangan yang lama menghilangkan senyawanya. Ini lebih aman untuk lambung!',
    'URL Gambar Cover': 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1000&auto=format&fit=crop',
    'Kategori': 'Kuliner',
    'URL Slug': 'memilih-kopi-roasting-aman-lambung',
    'Produk Terkait (ID)': '',
    'Meta Title': 'Cara Jitu Memilih Kopi Roasting yang Aman untuk Lambung',
    'Meta Description': 'Jangan salah pilih! Temukan perbedaan Light Roast dan Dark Roast untuk menemukan kopi yang bersahabat dengan lambung Anda.',
    'Status': 'published'
  }
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(articles);

XLSX.utils.book_append_sheet(wb, ws, "Artikel");

const outputPath = path.join(__dirname, '..', '..', '..', 'Artikel_Auto_Generate.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('File Excel berhasil dibuat di:', outputPath);
