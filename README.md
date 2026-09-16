# Sumber Wangi — Website Company Profile & Katalog Parfum

Website company profile dan katalog produk untuk **Sumber Wangi**, brand parfum artisanal lokal dengan bibit konsentrat wewangian murni berkualitas tinggi yang tahan 12 hingga 14+ jam.

Aplikasi ini menggunakan integrasi pemesanan langsung melalui WhatsApp (`wa.me`) dengan pesan terformat otomatis, serta menggunakan **PocketBase** sebagai backend, database SQLite, dan manajemen file storage.

---

## Tech Stack

- **Frontend:** Next.js (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS (utility classes murni tanpa UI library eksternal)
- **Backend & Database:** PocketBase (Self-hosted SQLite + File Storage + Auth)
- **Testing:** Vitest
- **Linting & Formatting:** ESLint 9 + TypeScript strict mode

---

## Struktur Folder

```
sumberwangi/
├── app/
│   ├── page.tsx                      # Beranda (Hero, Unggulan, Alur Belanja, Filosofi)
│   ├── produk/
│   │   ├── page.tsx                  # Katalog lengkap dengan filter kategori
│   │   ├── loading.tsx               # State loading skeleton untuk katalog
│   │   └── [slug]/
│   │       ├── page.tsx              # Detail produk & tombol besar pemesanan WhatsApp
│   │       ├── loading.tsx           # State loading skeleton detail produk
│   │       └── not-found.tsx         # Halaman 404 elegan jika parfum tidak ditemukan
│   ├── tentang/
│   │   └── page.tsx                  # Profil brand, nilai-nilai, dan komitmen kualitas
│   ├── layout.tsx                    # Root layout (Navbar, Footer, SEO metadata)
│   └── globals.css                   # Tailwind theme styling
├── components/
│   ├── Navbar.tsx                    # Header responsif dengan drawer mobile
│   ├── Footer.tsx                    # Footer lengkap dengan USP & link cepat
│   ├── ProductCard.tsx               # Kartu parfum interaktif & tombol pesan WA
│   ├── WhatsAppButton.tsx            # Tombol pesanan & konsultasi wa.me
│   ├── LoadingSkeleton.tsx           # Komponen skeleton placeholder
│   └── ErrorMessage.tsx              # Komponen fallback jika data gagal dimuat
├── lib/
│   ├── pocketbase.ts                 # Inisialisasi client PocketBase & URL resolver
│   ├── whatsapp.ts                   # Logika generator pesan & URL wa.me
│   ├── whatsapp.test.ts              # Unit test WhatsApp generator
│   ├── utils.ts                      # Format Rupiah, slug generator, validasi form
│   ├── utils.test.ts                 # Unit test utilitas & validasi
│   └── types.ts                      # TypeScript types & interface
├── pocketbase/
│   ├── pocketbase.exe                # Binary PocketBase lokal (git-ignored)
│   ├── pb_data/                      # Database SQLite lokal (git-ignored)
│   └── pb_migrations/                # Skema migrasi snapshot PocketBase
├── scripts/
│   ├── setup-db.js                   # Script inisialisasi schema & seed produk awal
│   └── assets/                       # Aset foto botol parfum awal
├── .env.example                      # Template environment variables
├── .env.local                        # Konfigurasi environment lokal (git-ignored)
├── DECISIONS.md                      # Catatan keputusan teknis mandiri
├── SUMBER_WANGI_SPEC.md              # Spesifikasi teknis acuan proyek
└── AGENTS.md                         # Aturan kerja & definisi selesai
```

---

## Daftar Environment Variables

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Isi variabel berikut:

| Variabel | Keterangan | Contoh Nilai Lokal |
|---|---|---|
| `NEXT_PUBLIC_POCKETBASE_URL` | URL endpoint backend PocketBase | `http://127.0.0.1:8090` |
| `NEXT_PUBLIC_WA_NUMBER` | Nomor WhatsApp tujuan pesanan (format internasional tanpa `+` atau spasi) | `6281234567890` |

---

## Cara Menjalankan Secara Lokal

### 1. Prasyarat
- **Node.js:** v20+ atau v22+
- **PocketBase binary:** sudah tersedia di dalam folder `pocketbase/`

### 2. Jalankan PocketBase Lokal
Buka terminal dan jalankan server PocketBase:

```bash
# Menjalankan server PocketBase lokal pada port 8090
.\pocketbase\pocketbase.exe serve --http="127.0.0.1:8090"
```

PocketBase akan aktif di:
- **REST API:** `http://127.0.0.1:8090/api/`
- **Admin Dashboard:** `http://127.0.0.1:8090/_/`

Kredensial superuser default lokal (untuk development):
- **Email:** `admin@sumberwangi.com`
- **Password:** `SumberWangi123!`

*(Jika database belum memiliki koleksi atau data, jalankan `node scripts/setup-db.js`)*

### 3. Jalankan Aplikasi Next.js
Buka terminal baru di root folder:

```bash
# Install dependency
npm install

# Jalankan server development
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000).

---

## Menjalankan Pengujian (Testing) & Quality Check

```bash
# Menjalankan unit tests (Vitest)
npm run test

# Menjalankan linting (ESLint)
npm run lint

# Melakukan kompilasi build produksi (Next.js)
npm run build
```

---

## Rencana Deployment Ringkas

Detail lengkap dapat dibaca di `SUMBER_WANGI_SPEC.md` Bagian 8.

1. **Backend PocketBase → Fly.io:**
   - Gunakan `Dockerfile` PocketBase.
   - Buat volume persisten di Fly.io (`fly volumes create pb_data --size 1`) agar database SQLite dan upload gambar tersimpan permanen.
   - `fly deploy` dan catat URL instance publik (misal `https://sumberwangi-api.fly.dev`).

2. **Frontend Next.js → Vercel:**
   - Hubungkan repositori GitHub ke akun Vercel.
   - Masukkan environment variables:
     - `NEXT_PUBLIC_POCKETBASE_URL=https://sumberwangi-api.fly.dev`
     - `NEXT_PUBLIC_WA_NUMBER=62xxxxxxxxxxx`
   - Deploy otomatis pada setiap commit di branch utama.
