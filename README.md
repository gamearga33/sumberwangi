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
│   ├── Footer.tsx                    # Footer lengkap dengan link navigasi & panel admin
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
├── middleware.ts                     # Next.js middleware proteksi rute /admin/*
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

- Halaman Katalog Publik: [http://localhost:3000/produk](http://localhost:3000/produk)
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

## Catatan Free Tier Supabase (Penanganan Auto-Pause)

Pada paket gratis Supabase, database akan **auto-pause jika tidak ada aktivitas selama 7 hari**.
- **Data Tidak Hilang:** Seluruh data produk dan foto tetap aman tersimpan di Postgres dan Storage.
- **Cara Resume Proyek:** Masuk ke Dashboard Supabase, pilih project, dan klik tombol **Resume project** (memerlukan waktu ~1-2 menit hingga aktif kembali).
- **Pencegahan Otomatis (Opsional):** Setup scheduled ping (misalnya via layanan gratis seperti cron-job.org) untuk memanggil REST endpoint Supabase setiap beberapa hari agar project tetap aktif.

---

## Deployment ke Vercel

1. Push repositori ke GitHub.
2. Hubungkan repository di Vercel Dashboard.
3. Tambahkan environment variables di pengaturan proyek Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WA_NUMBER`
4. Deploy akan otomatis berjalan setiap push ke branch `main`.
