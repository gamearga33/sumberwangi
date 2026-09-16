# DECISIONS.md — Log Keputusan Teknis Sumber Wangi

Dokumen ini mencatat keputusan teknis mandiri yang diambil selama pengembangan proyek Sumber Wangi (sesuai aturan di `AGENTS.md`).

---

## 2026-09-16 — Struktur Folder Root & PocketBase Lokal
- **Keputusan:** Meletakkan aplikasi Next.js langsung di root proyek (`c:\Projects\sumberwangi`), dan meletakkan binary serta data PocketBase di folder `pocketbase/` yang di-ignore oleh git (`pocketbase/pocketbase.exe`, `pocketbase/pb_data/`).
- **Alasan:** Memudahkan konfigurasi Vercel (karena root directory Next.js berada di `./` tanpa perlu setting sub-directory tambahan), sekaligus menjaga PocketBase lokal terisolasi dan mudah dijalankan untuk proses development lokal.

## 2026-09-16 — Penggunaan PocketBase v0.40.x & Definisi Autodate
- **Keputusan:** Menggunakan PocketBase versi terbaru (v0.40.4) yang menggunakan koleksi `_superusers` bawaan untuk autentikasi superuser, serta mendefinisikan field `created` dan `updated` bertipe `autodate` secara eksplisit pada schema koleksi `products`.
- **Alasan:** Sesuai dengan spesifikasi arsitektur PocketBase modern, dan memungkinkan query sorting `sort: '-created'` berjalan optimal pada query SQLite tanpa error kolom hilang.

## 2026-09-16 — Strategi ISR (Incremental Static Regeneration) 60 Detik
- **Keputusan:** Menggunakan `export const revalidate = 60` pada halaman Beranda, Katalog (`/produk`), dan Detail Produk (`/produk/[slug]`), dipadukan dengan `generateStaticParams` untuk SSG awal seluruh slug produk yang aktif.
- **Alasan:** Keseimbangan optimal antara kecepatan akses pengunjung (halaman tersaji cepat dari cache static edge), SEO maksimal melalui SSG, dan kecepatan pembaruan data ketika owner menambahkan/mengubah produk melalui admin panel (maksimal jeda 60 detik).

## 2026-09-16 — Penanganan Fallback Gambar & Graceful Degradation
- **Keputusan:** Mengimplementasikan URL resolver di `lib/pocketbase.ts` yang mengarah ke file storage PocketBase, dilengkapi fallback otomatis ke gambar lokal `/images/products/{slug}.jpg` jika storage PocketBase offline atau file tidak ditemukan.
- **Alasan:** Memenuhi standar *graceful degradation* pada `AGENTS.md` Bagian 3, sehingga pengunjung tidak pernah melihat broken image icon jika backend sedang mengalami downtime sementara.

## 2026-09-16 — Framework Testing Vitest
- **Keputusan:** Menggunakan Vitest sebagai runner pengujian unit test untuk `lib/whatsapp.ts`, `lib/utils.ts`, dan validasi produk.
- **Alasan:** Sangat cepat, kompatibel penuh dengan konfigurasi TypeScript dan arsitektur ESM Next.js, dan langsung lulus tanpa konfigurasi Babel yang rumit.

## 2026-09-16 — Integrasi Logo Resmi, Warna Hitam & Gold, serta Nomor WhatsApp Owner
- **Keputusan:** Mengadaptasi identitas brand resmi sesuai request owner:
  1. **Logo Resmi:** Menggunakan file logo resmi CV Sumber Wangi Madiun Group (`/images/logo.png`) pada Navbar, Footer, dan Favicon.
  2. **Tema Hitam & Gold:** Mengaplikasikan tema warna luxury dark mode dengan background obsidian black (`#0d0d0d`), surface `#141414`, border halus `#262420`, aksen emas artisanal murni (`#d4af37`), serta teks lembut yang mudah dibaca (`#f2f0ea` dan `#a3a099`). Desain tetap dijaga minimalis, bersih, tanpa efek glow/sparkles berlebihan.
  3. **Nomor WhatsApp Resmi:** Menggunakan nomor `081333226161` (format internasional `6281333226161`) di `.env.local`, `.env.example`, helper `lib/whatsapp.ts`, serta test suite `lib/whatsapp.test.ts`.

## 2026-09-16 — Penyelarasan 11 Varian Parfum Resmi & Hero Image
- **Keputusan:**
  1. **11 Varian Parfum Resmi:** Memperbarui database produk dengan 11 varian resmi dari kode HTML owner (Romanwish, Bulgari Aqua, Nagita, Vanilla Ice, Melati Keraton, Harajuku Love, Sakura, Avril, Shisi, JLO Still, Dunhill Blue) dengan harga seragam Rp20.000 dan ukuran 35ml.
  2. **Hero Image Logo:** Mengganti foto hero banner beranda menjadi display logo resmi CV Sumber Wangi Madiun Group dengan latar belakang obsidian dark dan gold accent frame.
- **Alasan:** Memastikan katalog produk, harga, dan visual branding di website 100% akurat dengan operasional komersial dan materi promosi CV Sumber Wangi Madiun Group saat ini.

## 2026-09-16 — Logo Hero Transparan & Sistem Pemilihan Manual Varian Populer
- **Keputusan:**
  1. **Logo Hero Transparan Tanpa Kotak:** Menghapus wrapper card box (`bg-[#141414]`, `border border-[#262420]`) pada tampilan logo di hero section, sehingga botol emas dan tipografi logo resmi Sumber Wangi melayang alami dengan latar belakang transparan murni langsung di atas background beranda.
  2. **Field `is_featured` untuk Pemilihan Manual Varian Populer:** Menambahkan kolom `is_featured` bertipe Boolean pada koleksi database PocketBase `products`. Fungsi `getFeaturedProducts` memprioritaskan produk dengan `is_available = true && is_featured = true`.
- **Alasan:** Memenuhi preferensi visual owner agar logo tidak terkurung dalam kotak samping ("jangan ada kotak sampingnya"), serta memberikan kendali penuh bagi owner untuk memilih sendiri parfum mana yang tampil di Beranda via toggle checkbox `is_featured` di admin panel PocketBase tanpa perlu mengubah kode.

