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

## 2026-09-16 — Overhaul Desain: Modern Minimalist Typography & Anti-AI Cliché
- **Keputusan:** Mengubah total gaya visual dari gaya template AI (banyak ikon sparkles, pill badges mengambang, efek glow blur, dan gradient text) menjadi gaya **Modern Minimalist Editorial** yang terinspirasi dari rumah wewangian artisanal kontemporer (seperti Le Labo, Byredo, Aesop).
- **Perubahan yang Diterapkan:**
  1. **Tipografi Modern:** Menggunakan Geist Sans modern geometric sans-serif dengan penekanan pada letter-spacing (`tracking-tight` pada judul dan `tracking-wider`/`tracking-[0.22em]` pada logotype dan kategori), menggantikan serif tradisional.
  2. **Pembersihan Elemen AI:** Menghapus seluruh ikon sparkles, pill badge mengambang ("Ready Stock", "Signature Blend", "Koleksi Terfavorit"), dan kotak nomor proses belanja yang mencolok.
  3. **Palet Warna Tenang:** Menghilangkan text gradient emas dan glow blur; menggunakan warna dasar warm neutral (`#fbfbf9`), border halus (`#e8e6df`), dan kontras teks matte black (`#141413`).
  4. **Tata Letak Bersih:** Alur informasi dibuat editorial, rapi, dan memberikan ruang bernapas (whitespace) yang luas pada katalog dan halaman detail produk.
