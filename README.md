# Sumber Wangi — Website Company Profile & Katalog Parfum

Website company profile dan katalog produk resmi untuk **CV Sumber Wangi Madiun Group**, brand parfum dengan bibit konsentrat wewangian murni berkualitas tinggi yang tahan 12 hingga 14+ jam dengan harga terjangkau Rp20.000.

Website ini menggunakan **Next.js App Router** dengan backend **Supabase** (PostgreSQL terkelola, Supabase Storage untuk foto produk, dan Supabase Auth untuk pengamanan panel admin), serta integrasi pemesanan WhatsApp (`wa.me`) dengan pesan terformat otomatis.

---

## Tech Stack (v2 — Supabase)

- **Frontend:** Next.js (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS (utility classes murni tanpa component library eksternal)
- **Backend & Database:** Supabase (Postgres terkelola + Storage Bucket `product-images` + Supabase Auth)
- **Koneksi Supabase:** `@supabase/supabase-js` dan `@supabase/ssr`
- **Hosting Frontend:** Vercel (free tier)
- **Testing:** Vitest
- **Linting & Formatting:** ESLint 9 + TypeScript strict mode

---

## Struktur Folder

```
sumberwangi/
├── app/
│   ├── page.tsx                      # Beranda (Hero Logo, Unggulan, Alur Belanja, Filosofi)
│   ├── produk/
│   │   ├── page.tsx                  # Katalog lengkap 11 varian dengan filter kategori
│   │   ├── loading.tsx               # State loading skeleton untuk katalog
│   │   └── [slug]/
│   │       ├── page.tsx              # Detail produk & tombol besar pemesanan WhatsApp
│   │       ├── loading.tsx           # State loading skeleton detail produk
│   │       └── not-found.tsx         # Halaman 404 elegan jika parfum tidak ditemukan
│   ├── tentang/
│   │   └── page.tsx                  # Profil brand, nilai-nilai, dan komitmen kualitas
│   ├── admin/
│   │   ├── login/page.tsx            # Login panel admin via Supabase Auth
│   │   ├── dashboard/page.tsx        # Dashboard manajemen produk (tabel, toggle stok & unggulan)
│   │   ├── produk/
│   │   │   ├── baru/page.tsx         # Form tambah produk baru + upload foto ke Storage
│   │   │   └── [id]/edit/page.tsx    # Form edit produk & pembaruan foto
│   │   └── layout.tsx                # Layout khusus admin
│   ├── layout.tsx                    # Root layout publik (Navbar, Footer, SEO metadata)
│   └── globals.css                   # Tailwind theme styling
├── components/
│   ├── Navbar.tsx                    # Header responsif dengan logo resmi
│   ├── Footer.tsx                    # Footer lengkap dengan link navigasi & kontak resmi
│   ├── ProductCard.tsx               # Kartu parfum Black & Gold & tombol pesan WA
│   ├── WhatsAppButton.tsx            # Tombol pesanan & konsultasi wa.me
│   ├── LoadingSkeleton.tsx           # Komponen skeleton placeholder
│   └── ErrorMessage.tsx              # Komponen fallback jika data gagal dimuat
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client untuk Client Components (browser)
│   │   ├── server.ts                 # Supabase client untuk Server Components & Actions (SSR)
│   │   ├── middleware.ts             # Handler session refresh & proteksi rute /admin/*
│   │   └── public.ts                 # Supabase client publik untuk ISR/SSG tanpa cookie
│   ├── products.ts                   # Helper query produk, upload, dan resolver foto
│   ├── products.test.ts              # Unit test resolver foto produk
│   ├── whatsapp.ts                   # Logika generator pesan & URL wa.me
│   ├── whatsapp.test.ts              # Unit test WhatsApp generator
│   ├── utils.ts                      # Format Rupiah, slug generator, validasi form produk
│   ├── utils.test.ts                 # Unit test utilitas & validasi
│   └── types.ts                      # TypeScript types & interface data produk
├── proxy.ts                          # Next.js 16 network proxy / middleware proteksi rute /admin/*
├── scripts/
│   ├── schema.sql                    # Skrip SQL DDL: tabel products, trigger, RLS, storage
│   ├── seed.sql                      # Skrip SQL DML: seed 11 varian parfum resmi
│   ├── seed-supabase.mjs             # Skrip Node.js: upload foto ke Storage & upsert produk
│   ├── exported_products.json        # Cadangan data 11 varian parfum hasil ekspor
│   └── assets/                       # Aset foto 11 botol parfum resmi
├── _archive/                         # Arsip konfigurasi Fly.io & PocketBase lama
├── .env.example                      # Template environment variables
├── .env.local                        # Konfigurasi environment lokal (git-ignored)
├── DECISIONS.md                      # Log keputusan teknis arsitektur
├── SUMBER_WANGI_SPEC.md              # Spesifikasi teknis acuan proyek (v2 Supabase)
└── AGENTS.md                         # Aturan kerja & definisi selesai
```

---

## Konfigurasi Supabase & Environment Variables

### 1. Buat Project Supabase Baru
1. Kunjungi [supabase.com](https://supabase.com) dan buat project baru (gratis).
2. Buka menu **SQL Editor** di Dashboard Supabase, salin dan jalankan seluruh isi file [`scripts/schema.sql`](file:///c:/Projects/sumberwangi/scripts/schema.sql).
3. Buat akun admin di menu **Authentication → Users → Add user** (masukkan email dan password admin).
4. Masukkan data 11 varian parfum resmi:
   - Opsi Cepat: Jalankan file [`scripts/seed.sql`](file:///c:/Projects/sumberwangi/scripts/seed.sql) pada **SQL Editor** di Dashboard Supabase.
   - Opsi Upload Otomatis Foto: Jalankan `node scripts/seed-supabase.mjs` di terminal lokal setelah mengisi variabel lingkungan.

### 2. Environment Variables (`.env.local`)

Salin template variabel lingkungan:

```bash
cp .env.example .env.local
```

Isi variabel berikut:

| Variabel | Keterangan | Contoh Nilai |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Settings → API di Dashboard Supabase | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon Key dari Settings → API di Dashboard Supabase | `eyJhbGciOiJIUz...` |
| `NEXT_PUBLIC_WA_NUMBER` | Nomor WhatsApp resmi pemesanan (format internasional) | `6281333226161` |
| `CRON_SECRET` | *(Opsional)* Secret token untuk proteksi endpoint keep-alive | `super-secret-key-123` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Opsional)* Hanya digunakan untuk script seed lokal | `eyJhbGciOi...` |

---

## Cara Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server development
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000).

- Halaman Beranda: [http://localhost:3000](http://localhost:3000)
- Halaman Katalog Publik: [http://localhost:3000/produk](http://localhost:3000/produk)
- Endpoint Keep-Alive: [http://localhost:3000/api/cron/keep-alive](http://localhost:3000/api/cron/keep-alive)
- Panel Admin Login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Dashboard Admin: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

---

## Menjalankan Pengujian (Testing) & Quality Check

```bash
# Menjalankan unit tests (Vitest)
npm run test

# Menjalankan linting (ESLint)
npm run lint

# Menjalankan build produksi Next.js
npm run build
```

---

## Strategi Anti Auto-Pause Supabase (Keep-Alive Otomatis)

Supabase Free Tier menerapkan kebijakan **auto-pause setelah 7 hari tidak ada aktivitas (inactivity)**. Seluruh data tetap aman, namun database perlu di-resume manual jika tertidur.

Untuk mencegah hal tersebut, website ini sudah dilengkapi **sistem keep-alive otomatis**:

### 1. Endpoint Keep-Alive (`/api/cron/keep-alive` & `/api/keep-alive`)
Endpoint ini melakukan query PostgreSQL teringan (`.select('id').limit(1)`) ke tabel `products`, sehingga Postgres engine Supabase mencatat aktivitas dan mereset hitungan 7 hari secara terus menerus.

### 2. Vercel Cron Otomatis (`vercel.json`)
File `vercel.json` di root repository sudah terkonfigurasi untuk memanggil endpoint keep-alive setiap hari pada jam 04:00 UTC (11:00 WIB):

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 4 * * *"
    }
  ]
}
```
> **Catatan Kuota Vercel Hobby:** Vercel paket gratis mengizinkan 1 eksekusi cron per hari. Jadwal `0 4 * * *` (1x sehari) 100% aman dan patuh pada limit Vercel Free tier.

### 3. Alternatif Eksternal Gratis (Cadangan / Pinger Independen)
Jika Anda ingin kepastian ekstra tanpa bergantung pada Vercel Cron:
- **[cron-job.org](https://cron-job.org)** (100% Gratis):
  1. Buat akun gratis di `cron-job.org`.
  2. Buat job baru dengan URL: `https://domain-anda.vercel.app/api/cron/keep-alive`.
  3. Set jadwal: setiap 1 hari sekali atau setiap 3 hari sekali.
  4. (Opsional jika memakai `CRON_SECRET`): Masukkan URL `https://domain-anda.vercel.app/api/cron/keep-alive?key=SECRET_ANDA`.
- **[UptimeRobot](https://uptimerobot.com)** (100% Gratis, 50 monitor):
  1. Tambahkan monitor tipe **HTTP(s)**.
  2. Masukkan URL `https://domain-anda.vercel.app/api/keep-alive`.
  3. Interval monitoring 5 - 30 menit (juga berfungsi sebagai pemantau uptime website jika down).

---

## Arsitektur Optimasi Kuota (Bebas Limit Vercel & Supabase)

Arsitektur kode telah dioptimalkan agar tidak menyentuh kuota bulanan gratis:

1. **Vercel Image Optimization Quota (1.000 foto/bulan) → 0/1.000 Terpakai:**
   - Dikonfigurasi `images: { unoptimized: true }` di `next.config.ts`. Next.js merender gambar langsung dari sumber Supabase Storage / static CDN tanpa melalui serverless image optimizer Vercel.
2. **Next.js Static Generation & ISR Edge Cache:**
   - Semua halaman publik (`/`, `/produk`, `/produk/[slug]`, `/tentang`) di-render statis dengan ISR 60 detik.
   - Vercel Edge Cache melayani 99%+ kunjungan pengunjung langsung dari CDN global tanpa mengeksekusi serverless function dan tanpa query database Supabase.
   - Halaman `/produk` memfilter kategori di browser client-side (`components/ProductCatalog.tsx`), bukan dynamic SSR, sehingga pergantian tab kategori instan 0ms tanpa request baru ke Supabase.
3. **Supabase Egress Bandwidth Quota (5GB/bulan) Protection:**
   - Upload foto produk di admin panel menyertakan header `cacheControl: '31536000'` (1 tahun cache immutable).
   - Browser pengunjung menyimpan foto di cache lokal, mencegah download berulang ke Supabase Storage.
4. **Vercel Edge Proxy / Middleware Quota Protection:**
   - Proxy autentikasi Next.js 16 (`proxy.ts`) hanya dijalankan untuk rute panel admin (`/admin/*`). Rute publik bebas dari overhead middleware sehingga menghemat kuota invocations serverless Vercel.

---

## Deployment ke Vercel

1. Push repositori ke GitHub.
2. Hubungkan repository di Vercel Dashboard.
3. Tambahkan environment variables di pengaturan proyek Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WA_NUMBER`
   - `CRON_SECRET` *(opsional, string rahasia bebas)*
4. Deploy akan otomatis berjalan setiap push ke branch `main`, dan Vercel Cron akan langsung aktif otomatis membaca `vercel.json`.

