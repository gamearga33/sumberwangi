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

## 2026-09-16 — Optimasi Gambar Bebas Kuota Vercel, Smooth Scroll, dan Halaman Tentang Kami
- **Keputusan:**
  1. **Unoptimized Images (`images.unoptimized = true`):** Mengaktifkan opsi `unoptimized: true` pada `next.config.ts`. Next.js merender tag `<img>` yang mengambil aset foto langsung dari storage PocketBase (atau file lokal) tanpa diproses melalui serverless image optimization proxy `/_next/image`.
  2. **Alasan Optimasi Gambar:** Mencegah eror lokal HTTP 400 (`"url" parameter is not allowed`) dan memastikan penggunaan hosting Vercel tier gratis (Hobby plan) tidak akan pernah menyentuh kuota bulanan 1.000 image optimizations.
  3. **Global Smooth Scroll:** Menambahkan `scroll-behavior: smooth` pada CSS global dan kelas `scroll-smooth` pada elemen `<html>` untuk pengalaman navigasi yang halus.
  4. **Penyesuaian Halaman Tentang Kami:** Menghapus ikon logo kecil di samping teks judul header `CV SUMBER WANGI MADIUN GROUP` dan mengganti foto parfum ilustrasi pada editorial story dengan logo resmi transparan.

## 2026-09-16 — Migrasi Penuh Arsitektur Backend: PocketBase/Fly.io ke Supabase
- **Keputusan:**
  1. **Penyelamatan & Ekspor Data:** Mengekstrak dan menyelamatkan 100% data dari 11 varian parfum resmi di database SQLite PocketBase lokal (`pocketbase/pb_data/data.db`) ke format JSON terstruktur (`scripts/exported_products.json`) serta menyediakan skrip DDL & seed SQL (`scripts/schema.sql`, `scripts/seed.sql`, dan `scripts/seed-supabase.mjs`). Seluruh aset gambar parfum di `scripts/assets/` dan `public/images/products/` dipastikan utuh.
  2. **Penggantian Dependency:** Menghapus package `pocketbase` dan menginstal package resmi `@supabase/supabase-js` (^2.116.0) dan `@supabase/ssr` (^0.12.7).
  3. **Koneksi Supabase & Arsitektur SSR:**
     - Membuat browser client (`lib/supabase/client.ts`) untuk interaksi client-side.
     - Membuat server client (`lib/supabase/server.ts`) dengan cookie handler Next.js App Router.
     - Membuat middleware auth (`middleware.ts` & `lib/supabase/middleware.ts`) untuk refresh token session dan proteksi rute admin (`/admin/*`).
     - Membuat public client (`lib/supabase/public.ts`) untuk query data publik tanpa sentuhan cookie, sehingga kompatibel penuh dengan ISR (revalidate 60s) dan SSG `generateStaticParams`.
  4. **Transisi Schema & Naming Convention:** Mengganti tipe data PocketBase (`image`, `created`, `updated`) menjadi konvensi Postgres/Supabase (`image_url`, `created_at`, `updated_at`) pada `lib/types.ts` dan fungsi query di `lib/products.ts`.
  5. **Panel Admin Custom Next.js Lengkap:** Membangun antarmuka admin lengkap berbasis Tailwind CSS (estetika hitam obsidian & aksen emas artisanal):
     - `/admin/login`: Login admin dengan Supabase Auth `signInWithPassword`.
     - `/admin/dashboard`: Ringkasan statistik varian, tabel manajemen katalog, toggle instan ketersediaan stok & varian unggulan beranda, aksi hapus permanen, dan tombol logout.
     - `/admin/produk/baru`: Form input varian dengan auto-generate slug, validasi field terperinci, dan upload foto langsung ke Supabase Storage bucket `product-images`.
     - `/admin/produk/[id]/edit`: Form edit varian untuk mengubah harga, deskripsi, status, dan pembaruan foto opsional.
  6. **Pengarsipan File Lama:** Memindahkan seluruh file deployment Fly.io dan binary PocketBase lama (`pocketbase-deploy/`, `pocketbase/`, `scripts/setup-db.js`) ke folder arsip `_archive/`.
- **Alasan:** Fly.io telah menghapus tier gratis permanen (kebijakan baru mewajibkan pembayaran bulanan), sementara Render gratis tidak memiliki persistent disk (berisiko menghapus data SQLite dan foto setiap kali redeploy). Supabase menyediakan database Postgres dan Object Storage terkelola yang aman permanen di free tier tanpa risiko data hilang saat redeploy.

## 2026-09-16 — Strategi Penanganan Auto-Pause 7 Hari Supabase Free Tier
- **Keputusan:** Memilih **Opsi 2** (menerima mekanisme auto-pause free tier dengan panduan resume manual 1-klik di Dashboard Supabase pada `README.md`) serta menyediakan rekomendasi opsi setup scheduled ping gratis via `cron-job.org` bagi owner jika ingin project tetap terjaga aktif tanpa intervensi manual.
- **Alasan:** Sesuai mandat `SUMBER_WANGI_SPEC.md` Bagian 2. Berbeda dari risiko ephemeral disk pada Render (yang menghapus permanen seluruh data dan foto saat restart), fitur auto-pause Supabase 100% menjamin integritas data (Postgres database dan file Storage tetap utuh dan aman). Untuk skala bisnis <20 varian parfum dan traffic awal, resume manual membutuhkan waktu kurang dari 1 menit, sehingga tidak membebani operasional owner.

## 2026-09-16 — Konfigurasi Live Supabase & Migrasi Idempotent Kolom `is_featured`
- **Keputusan:**
  1. Mengisi `.env.local` dengan kredensial live Supabase project owner (`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  2. Menyediakan fungsi normalisasi URL terpusat (`cleanSupabaseUrl`, `getSupabaseUrl`, `getSupabaseAnonKey`) di `lib/supabase/utils.ts` yang menangani pembersihan whitespace, trailing slashes, dan suffix `/rest/v1/`, dan menggunakannya di seluruh Supabase client termasuk `middleware.ts` (`updateSession`).
  3. Memperbarui `scripts/schema.sql`, `scripts/seed.sql`, dan `scripts/fix-is-featured.sql` dengan DDL penambahan kolom yang idempotent (`alter table if exists products add column if not exists ...`), unique index pada `slug`, dan perintah `notify pgrst, 'reload schema';` untuk sinkronisasi seketika schema cache PostgREST.
  4. Menjadikan `scripts/seed.sql` skrip mandiri (self-contained) yang dapat dijalankan langsung di SQL Editor Supabase untuk membuat tabel jika belum ada, menambah kolom yang kurang, mengaktifkan RLS & kebijakan publik, serta meng-upsert 11 varian resmi.
- **Alasan:** Menyelesaikan error PostgreSQL `42703 (column "is_featured" does not exist)` saat seeding, yang terjadi karena tabel `products` sudah sempat terbentuk sebelum kolom `is_featured` ditambahkan, sementara klausa `create table if not exists` tidak memodifikasi tabel yang sudah ada. Serta mencegah auth failure pada middleware akibat trailing path `/rest/v1/` pada env URL.

## 2026-09-16 — Optimasi Kuota Bebas Limit (Vercel & Supabase Free Tier) & Anti Auto-Pause Keep-Alive
- **Keputusan:**
  1. **Mekanisme Otomatis Keep-Alive Supabase (Anti Auto-Pause 7 Hari):**
     - Membangun API endpoint `/api/cron/keep-alive` (dan alias `/api/keep-alive`) didukung helper `lib/keepAlive.ts` yang mengeksekusi query database PostgreSQL teringan (`.select('id').limit(1)`).
     - Menambahkan konfigurasi Vercel Cron di `vercel.json` dengan jadwal `0 4 * * *` (1x sehari pada 04:00 UTC / 11:00 WIB), sepenuhnya patuh pada batas Vercel Hobby plan (maksimal 1 eksekusi cron/hari).
     - Mendukung pengamanan opsional via `CRON_SECRET` (`Authorization: Bearer` atau `?key=`), dengan fallback tetap terbuka jika secret belum disetel untuk kemudahan setup awal.
     - Menyediakan dokumentasi lengkap di `README.md` untuk setup alternatif pinger eksternal gratis (cron-job.org dan UptimeRobot).
  2. **Transisi Halaman Katalog (`/produk`) dari Dynamic SSR ke Static ISR (Edge Cache):**
     - Sebelumnya halaman `/produk` terevaluasi sebagai `ƒ Dynamic` di Next.js karena membaca `searchParams` secara langsung di Server Component, memaksa Next.js melakukan server-side render dan memanggil query Supabase pada setiap pengunjung.
     - Mengubah arsitektur `/produk`: Server Component mengambil seluruh produk aktif sekali dan di-cache via ISR (`revalidate = 60`), sedangkan filtering kategori ("Semua", "Pria", "Wanita", "Unisex") dialihkan ke Client Component (`components/ProductCatalog.tsx`) yang dibungkus boundary `<Suspense>`.
     - Hasil: Rute `/produk` berubah menjadi `○ Static (ISR 1m)`. Pengunjung mendapatkan respon instan dari Vercel Edge Cache (<50ms), dan Supabase hanya di-query maksimal 1x per 60 detik meskipun ribuan pengunjung membuka katalog.
  3. **Proteksi Kuota Vercel Image Optimization (1.000 transformasi/bulan):**
     - Memastikan `images: { unoptimized: true }` di `next.config.ts`. Gambar parfum disajikan langsung dari Supabase Storage / static CDN tanpa melalui proxy kompresi Vercel, memastikan kuota 1.000 image optimizations Vercel tetap 0 (tidak pernah tersentuh).
  4. **Proteksi Kuota Egress Bandwidth Supabase (5GB/bulan):**
     - Menambahkan opsi `cacheControl: '31536000'` (1 tahun cache immutable) pada proses upload foto produk di `app/admin/produk/baru/page.tsx` dan `app/admin/produk/[id]/edit/page.tsx`.
     - Browser pengunjung dan CDN akan meng-cache file gambar parfum selama 1 tahun, mencegah pengunduhan ulang berulang kali dan melindungi batas transfer data Supabase 5GB/bulan.
  5. **Pengurangan Beban Invocations Edge Middleware:**
     - Mempersempit matcher di `middleware.ts` dari global catch-all menjadi khusus `['/admin', '/admin/:path*']`.
     - Menambahkan guard `if (!isAccessingAdmin) return supabaseResponse;` di `lib/supabase/middleware.ts`.
     - Hasil: Rute pengunjung publik (`/`, `/produk`, `/tentang`, `/api/*`) sama sekali tidak memicu eksekusi middleware Next.js, menghemat kuota invocations serverless Edge.
- **Alasan:** Memenuhi instruksi user agar aplikasi dapat berjalan 100% stabil di tier gratis Vercel dan Supabase tanpa risiko database tertidur (auto-pause) dan tanpa risiko terkena limit kuota hosting bulanan.

## 2026-09-16 — Penguatan Arsitektur Bebas Limit, Konvensi Next.js 16 `proxy.ts`, & Standar RFC 9110
- **Keputusan:**
  1. **Migrasi Konvensi `middleware.ts` ke `proxy.ts`:**
     - Next.js 16 secara resmi mendeprekasi penamaan file `middleware.ts` demi menghindari kerancuan dengan Express middleware dan merekomendasikan `proxy.ts` (dengan export function `proxy`).
     - Melakukan migrasi ke `proxy.ts`, menghasilkan build Next.js 100% bersih tanpa warning deprecation sedikitpun.
  2. **Kepatuhan RFC 9110 pada Endpoint Keep-Alive `HEAD`:**
     - Metode `HEAD` pada `/api/cron/keep-alive` dan alias `/api/keep-alive` kini mengembalikan respon dengan body `null` (tanpa payload JSON) sembari mempertahankan seluruh headers dan status code (200/401/500).
     - Menghilangkan transfer data tidak perlu saat dipanggil oleh uptime monitor gratis seperti UptimeRobot yang rutin mengirim request HEAD.
  3. **Robust Admin Redirects & Trailing Slash Handling:**
     - Menormalkan pathname pada `lib/supabase/middleware.ts` dan menggunakan constructor `new URL(path, request.url)` alih-alih `request.nextUrl.clone()`, memastikan akses ke `/admin/` (dengan trailing slash) tidak lagi menghasilkan 404, melainkan teralihkan mulus ke `/admin/dashboard` atau `/admin/login`.
  4. **Penerapan Header Cache Immutable pada Seed Script:**
     - Menambahkan parameter `cacheControl: '31536000'` pada `scripts/seed-supabase.mjs` sehingga foto yang diunggah saat inisialisasi database awal langsung memiliki header cache 1 tahun di Supabase Storage.
  5. **Tautan Semantik & Pure Filtering pada `ProductCatalog.tsx`:**
     - Menggantikan tombol `<button>` dengan semantik `<Link replace scroll={false}>` agar tab kategori dapat di-crawl search engine dan mendukung aksi right-click "Buka di tab baru", sembari tetap berjalan instan di memori via fungsi murni `filterProductsByCategory` yang teruji 100% unit test di Vitest.

## 2026-09-16 — Penyatuan Katalog Produk (Peniadaan Kategori Pria/Wanita/Unisex) & Penghapusan Referensi Pembayaran QRIS
- **Keputusan:**
  1. **Penyatuan Seluruh Varian Parfum Menjadi Satu Katalog Utuh:**
     - Sesuai permintaan owner, seluruh pembagian/kategori produk ("Pria", "Wanita", "Unisex") ditiadakan.
     - Komponen `components/ProductCatalog.tsx` disederhanakan: tab filter kategori dihapus, seluruh varian aktif ditampilkan langsung bersamaan tanpa filter URL `?kategori=`.
     - Badge/label kategori pada `ProductCard` dan halaman detail produk (`app/produk/[slug]/page.tsx`) diubah untuk hanya menampilkan informasi ukuran dan konsentrasi murni (`35 ml · Eau De Parfum`).
     - Teks copy pada Beranda (`app/page.tsx`), Halaman Katalog (`app/produk/page.tsx`), dan Tentang Kami disesuaikan agar tidak lagi membedakan gender/kategori aroma.
     - Form Tambah & Edit Produk di Panel Admin (`app/admin/produk/baru` & `app/admin/produk/[id]/edit`) serta tabel `app/admin/dashboard` disederhanakan dengan meniadakan input pemilihan kategori (kolom diganti menjadi Ukuran & Konsentrasi).
  2. **Penghapusan Referensi Pembayaran QRIS:**
     - Menghapus referensi metode QRIS di langkah ke-3 alur pemesanan pada Beranda, digantikan dengan *"Konfirmasi & Kirim"* via WhatsApp.
     - Menghapus keterangan *"Pembayaran via QRIS"* pada halaman detail produk, digantikan dengan *"Pemesanan diproses langsung oleh tim Sumber Wangi melalui WhatsApp"*.
     - Menghapus poin *"Pembayaran praktis via QRIS"* pada footer, digantikan dengan *"Pemesanan cepat & mudah via WhatsApp"*.
- **Alasan:** Memenuhi instruksi langsung dari owner untuk menyederhanakan pengalaman belanja pengunjung (semua varian disatukan tanpa pemisahan gender) serta mengarahkan alur konfirmasi transaksi sepenuhnya melalui komunikasi personal WhatsApp resmi Sumber Wangi.

## 2026-09-16 — Penyembunyian Akses Panel Admin dari Navigasi Publik
- **Keputusan:** Menghapus tautan rute `/admin/dashboard` dari navigasi footer publik (`components/Footer.tsx`). Panel admin kini hanya dapat diakses dengan mengetikkan URL secara manual pada browser (`/admin` atau `/admin/login`).
- **Alasan:** Memenuhi permintaan owner untuk privasi dan keamanan ekstra agar antarmuka panel admin tidak terpampang atau dapat diakses langsung oleh pengunjung umum melalui klik tautan di website.
