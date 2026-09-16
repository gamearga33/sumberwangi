# Spesifikasi Proyek: Website Sumber Wangi (v2 — Supabase)

> **INI ADALAH VERSI REVISI.** Dokumen ini menggantikan versi sebelumnya yang berbasis Pocketbase + Fly.io. Alasan perubahan: Fly.io tidak lagi punya free tier permanen (kebijakan berubah sejak Oktober 2024), dan alternatif gratis lain (Render Free) tidak punya persistent disk sehingga berisiko menghilangkan data produk & foto setiap kali redeploy. Supabase dipilih karena database & storage-nya memang didesain untuk aman secara permanen di free tier tanpa isu ini. Lihat `MIGRATION_NOTES.md` di folder yang sama untuk detail migrasi dari kode yang sudah ada.

Dokumen ini adalah spesifikasi teknis lengkap untuk dikerjakan oleh AI coding agent. Semua keputusan arsitektur sudah final — agent tidak perlu bertanya ulang soal stack, cukup eksekusi sesuai dokumen ini. Jika ada ambiguitas kecil di luar dokumen ini, agent boleh mengambil keputusan wajar dan mencatatnya, bukan berhenti untuk bertanya.

---

## 1. Ringkasan Proyek

Website company profile untuk **Sumber Wangi**, brand parfum lokal. Fungsi utama:

1. Menampilkan profil brand & katalog produk parfum (< 20 produk).
2. Pengunjung yang tertarik pada produk diarahkan ke WhatsApp untuk memesan (tidak ada sistem pembayaran/checkout di website — cukup redirect ke `wa.me` dengan pesan pre-filled).
3. Owner bisa menambah/mengubah/menghapus produk sendiri lewat panel admin custom, tanpa bantuan developer.
4. QRIS fisik akan ditempel di kemasan produk oleh owner (di luar scope website ini) — ketika discan, mengarahkan ke URL website. Website hanya perlu punya URL publik yang stabil; tidak ada logika pembayaran yang perlu dibangun.

**Skala:** sangat kecil. < 20 produk, traffic rendah-menengah, 1-2 admin (owner + developer). Semua keputusan teknis di bawah ini dioptimalkan untuk kesederhanaan dan **keamanan data jangka panjang**, bukan untuk scale besar.

---

## 2. Tech Stack (FINAL — jangan diubah tanpa persetujuan user)

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend framework | **Next.js** (App Router, versi stabil terbaru) | SSG/ISR untuk performa & SEO bagus, ekosistem matang |
| Styling | **Tailwind CSS** (utility classes murni, TANPA component library seperti shadcn/ui) | Ringan, kontrol penuh atas desain |
| Backend + Database | **Supabase** (Postgres managed) | Data aman permanen di free tier (tidak ada risiko hilang saat redeploy seperti masalah yang ditemukan di Pocketbase+Render), auth bawaan, storage bawaan |
| Auth admin | **Supabase Auth** (email + password) | Terintegrasi langsung dengan database, tidak perlu setup terpisah |
| Image storage | **Supabase Storage** (bucket `product-images`) | Satu paket dengan database, tidak perlu layanan eksternal |
| Hosting frontend (Next.js) | **Vercel** (free tier) | Auto-deploy dari Git, gratis untuk skala ini |
| Hosting backend | **Tidak perlu hosting terpisah** — Supabase adalah layanan cloud terkelola (managed), tidak ada server yang perlu di-deploy/dijaga | Ini keuntungan utama dibanding Pocketbase: tidak ada masalah "server harus nyala terus" atau "butuh persistent disk" sama sekali |
| Domain | Custom domain (opsional di awal, bisa mulai dari subdomain gratis Vercel) | Keputusan bisnis owner, di luar scope teknis |

### Catatan penting soal free tier Supabase
- Project gratis Supabase bisa **auto-pause setelah 7 hari tanpa aktivitas** (bukan hilang data, hanya "tidur" — beda dengan masalah persistent disk sebelumnya). Untuk website yang traffic-nya mungkin sepi di awal, ini perlu diantisipasi:
  - Opsi 1: Setup **uptime ping** sederhana (misal pakai cron-job.org gratis, ping endpoint Supabase tiap beberapa hari) supaya project tidak pernah idle 7 hari penuh.
  - Opsi 2: Terima saja risikonya — kalau ter-pause, owner tinggal login ke dashboard Supabase dan klik "Resume project" (perlu ~1 menit, data tidak hilang).
  - Agent WAJIB mencatat opsi mana yang dipilih di `DECISIONS.md` dan menjelaskan cara resume ke owner di `README.md`.
- Data tersimpan permanen selama project tidak dihapus manual — ini beda fundamental dari masalah ephemeral filesystem yang jadi alasan pindah dari Pocketbase.

### Yang SENGAJA TIDAK dipakai (dan kenapa)
- ❌ Pocketbase — awalnya dipilih karena admin panel otomatis, tapi hosting gratis permanen untuk proses always-on (Fly.io/Render) ternyata tidak tersedia lagi tanpa risiko kehilangan data atau biaya bulanan.
- ❌ Fly.io — free allowance permanen sudah dihapus sejak Oktober 2024, sekarang wajib kartu kredit setelah trial 7 hari.
- ❌ Render Free tier — tidak menyediakan persistent disk, sehingga data SQLite & file upload akan hilang setiap kali service redeploy/restart.
- ❌ shadcn/ui atau component library lain — user eksplisit minta Tailwind polos untuk kontrol desain penuh.
- ❌ Payment gateway apapun — QRIS diurus manual oleh owner secara fisik, di luar scope aplikasi.
- ❌ NextAuth/Auth.js terpisah — cukup pakai Supabase Auth yang sudah terintegrasi dengan database.

---

## 3. Arsitektur & Alur Data

```
[Pengunjung Website]
        │
        ▼
[Next.js di Vercel] ──(fetch data produk via Supabase client)──▶ [Supabase (Postgres + Storage)]
        │                                                              (cloud terkelola, tidak perlu
        │                                                               di-deploy/dijaga manual)
        ▼
[Klik "Pesan via WhatsApp"] ──▶ [Redirect ke wa.me dengan pesan pre-filled]

[Owner/Admin] ──▶ [Login ke /admin/login di Next.js] ──▶ [Dashboard custom untuk CRUD produk]
                                        │
                                        ▼
                              [Supabase Auth memverifikasi]
```

**Poin penting:** Berbeda dari versi Pocketbase sebelumnya, di sini **tidak ada admin panel bawaan otomatis** — Supabase memang punya Table Editor di dashboard-nya, tapi itu ditujukan untuk developer, bukan untuk owner non-teknis. Karena itu, **admin panel custom di Next.js menjadi WAJIB** (bukan lagi opsional/tambahan), karena ini satu-satunya cara owner bisa CRUD produk dengan nyaman.

---

## 4. Skema Data (Supabase / Postgres)

### Tabel: `products`

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price integer not null check (price > 0),
  size_ml integer,
  image_url text not null,
  image_gallery_urls text[],
  category text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger untuk auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on products
for each row execute function update_updated_at_column();
```

| Kolom | Tipe | Wajib? | Catatan |
|---|---|---|---|
| `id` | uuid | Auto | Primary key |
| `name` | text | Ya | Nama produk, misal "Sumber Wangi - Oud Royale" |
| `slug` | text (unique) | Ya | URL-friendly identifier, misal `oud-royale` |
| `description` | text | Ya | Deskripsi produk |
| `price` | integer | Ya | Harga dalam Rupiah, harus > 0 |
| `size_ml` | integer | Tidak | Ukuran botol dalam ml |
| `image_url` | text | Ya | URL publik gambar dari Supabase Storage |
| `image_gallery_urls` | text[] | Tidak | Array URL gambar tambahan (opsional) |
| `category` | text | Tidak | Misal "Pria", "Wanita", "Unisex" |
| `is_available` | boolean | Ya (default true) | Untuk sembunyikan produk tanpa hapus data |
| `is_featured` | boolean | Ya (default false) | Untuk menandai produk unggulan/populer di beranda |
| `created_at` | timestamptz | Auto | Otomatis |
| `updated_at` | timestamptz | Auto | Otomatis via trigger |

### Row Level Security (RLS) — WAJIB diaktifkan

Supabase mengaktifkan akses publik penuh secara default kalau RLS tidak di-setup. Ini WAJIB dikonfigurasi dengan benar:

```sql
alter table products enable row level security;

-- Siapapun boleh membaca produk yang tersedia (untuk halaman publik)
create policy "Public can view available products"
on products for select
using (is_available = true);

-- Hanya user yang sudah login (admin) yang boleh melakukan semua operasi
create policy "Authenticated users can do everything"
on products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');
```

> **Catatan:** Kebijakan di atas mengasumsikan HANYA admin yang akan sign up/login (tidak ada registrasi publik). Pastikan tidak ada halaman signup publik dibuat — akun admin dibuat manual lewat Supabase Dashboard, bukan lewat form registrasi di website.

### Supabase Storage — Bucket `product-images`

- Buat bucket bernama `product-images`, set sebagai **public bucket** (supaya gambar bisa diakses langsung tanpa auth di halaman publik).
- Storage policy: hanya authenticated user yang boleh upload/delete, publik hanya boleh read.

```sql
-- Public read access
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Only authenticated users can upload
create policy "Authenticated users can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Only authenticated users can update/delete
create policy "Authenticated users can modify product images"
on storage.objects for update
using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and auth.role() = 'authenticated');
```

---

## 5. Halaman & Fitur

### Public-facing (Next.js)

1. **Homepage (`/`)**
   - Hero section: nama brand "Sumber Wangi", tagline singkat, CTA ke katalog.
   - Sekilas tentang brand (bisa hardcoded, tidak perlu dari database).
   - Highlight beberapa produk (misal 3-4 produk unggulan).
   - Footer: kontak, link WhatsApp, media sosial (jika ada).

2. **Halaman Katalog (`/produk`)**
   - Grid semua produk yang `is_available = true`.
   - Setiap kartu produk: gambar, nama, harga, tombol singkat "Pesan" (redirect WA langsung dari sini) DAN link ke detail produk.
   - Optional: filter by kategori jika field `category` dipakai.

3. **Halaman Detail Produk (`/produk/[slug]`)**
   - Gambar (bisa galeri jika ada `image_gallery_urls`), nama, deskripsi lengkap, harga, ukuran.
   - Tombol besar "Pesan via WhatsApp" — lihat format pesan di bagian 6.

4. **Halaman Tentang Kami (`/tentang`)** — opsional, bisa digabung ke homepage jika ingin lebih simpel.

5. **Halaman Kontak (`/kontak`)** — opsional, bisa cukup footer saja jika sederhana.

### Admin-facing (WAJIB, bukan opsional)

- **`/admin/login`** — form login (email + password) menggunakan `supabase.auth.signInWithPassword()`.
- **`/admin/dashboard`** — list semua produk (termasuk yang `is_available = false`) dengan tombol tambah/edit/hapus/toggle ketersediaan.
- **`/admin/produk/baru`** — form tambah produk baru, termasuk upload gambar ke Supabase Storage.
- **`/admin/produk/[id]/edit`** — form edit produk yang sudah ada.
- **Proteksi route:** gunakan Next.js middleware untuk memvalidasi session Supabase sebelum mengizinkan akses ke `/admin/*` (kecuali `/admin/login`). Redirect ke `/admin/login` kalau tidak ada session valid.
- **Auth token:** Supabase SSR client (`@supabase/ssr`) menangani penyimpanan session di cookie secara otomatis dengan aman — gunakan package resmi ini, jangan implementasi manual.
- **Tombol logout** di dashboard admin, memanggil `supabase.auth.signOut()`.

---

## 6. Integrasi WhatsApp

- Nomor WA: gunakan **dummy placeholder** dulu — simpan sebagai environment variable `NEXT_PUBLIC_WA_NUMBER` dengan nilai placeholder `6281234567890` (format internasional tanpa `+` atau `0` di depan). User akan mengganti sendiri nanti.
- Format link: `https://wa.me/{NEXT_PUBLIC_WA_NUMBER}?text={pesan_encoded}`
- Contoh pesan pre-filled (Bahasa Indonesia santai tapi sopan):
  ```
  Halo Sumber Wangi, saya tertarik dengan produk "{nama_produk}" (Rp{harga}). Apakah masih tersedia?
  ```
- Gunakan `encodeURIComponent()` untuk encode pesan sebelum dimasukkan ke URL.
- Satu nomor WA berlaku untuk semua produk (tidak per-produk/kategori).
- **Fungsi ini tidak berubah dari spec versi sebelumnya** — logic-nya independen dari backend yang dipakai, jadi kode existing untuk ini (jika sudah ada) kemungkinan besar tetap bisa dipakai tanpa perubahan.

---

## 7. Environment Variables

### Next.js (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
NEXT_PUBLIC_WA_NUMBER=6281234567890
```

> **PENTING soal keamanan:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` aman untuk di-expose ke client (memang didesain begitu oleh Supabase — akses sebenarnya dikontrol lewat RLS policy di database, bukan lewat kerahasiaan key ini). JANGAN gunakan `service_role` key di kode frontend/client manapun — key itu bypass semua RLS dan hanya boleh dipakai di server-side yang benar-benar terpercaya (kalau memang dibutuhkan nanti, taruh sebagai `SUPABASE_SERVICE_ROLE_KEY` tanpa prefix `NEXT_PUBLIC_` supaya tidak ter-bundle ke client).

---

## 8. Deployment

### Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com) (gratis, tidak perlu kartu kredit untuk free tier).
2. Jalankan SQL di bagian 4 (tabel, RLS policy) lewat SQL Editor di dashboard Supabase.
3. Buat bucket `product-images` di Storage, set public, terapkan storage policy di bagian 4.
4. Buat 1 akun admin manual lewat Authentication → Users → Add User (email + password owner/developer). **Jangan buat lewat form signup publik karena memang tidak ada form signup di website ini.**
5. Catat `Project URL` dan `anon public key` dari Settings → API untuk dipakai di environment variables.

### Next.js → Vercel
1. Push kode ke GitHub.
2. Import project di Vercel, set environment variables (bagian 7).
3. Auto-deploy setiap push ke branch `main`.
4. Gunakan ISR (`revalidate`) dengan interval wajar (misal 60 detik) untuk halaman katalog & detail produk, supaya perubahan dari admin panel muncul tanpa perlu redeploy manual, tapi tetap dapat keuntungan performa dari static generation.

**Tidak ada langkah deployment backend terpisah** — ini adalah penyederhanaan besar dibanding versi Pocketbase+Fly.io sebelumnya, karena Supabase sepenuhnya managed.

---

## 9. Struktur Folder (Next.js, saran)

```
sumber-wangi/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── produk/
│   │   ├── page.tsx                 # Katalog
│   │   └── [slug]/page.tsx          # Detail produk
│   ├── tentang/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── produk/
│   │       ├── baru/page.tsx
│   │       └── [id]/edit/page.tsx
│   └── layout.tsx
├── components/
│   ├── ProductCard.tsx
│   ├── WhatsAppButton.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Supabase client untuk client-side
│   │   ├── server.ts                # Supabase client untuk server-side (SSR)
│   │   └── middleware.ts            # Helper untuk middleware auth
│   └── whatsapp.ts                  # Helper generate link WA
├── middleware.ts                    # Proteksi route /admin/*
├── .env.local
└── tailwind.config.ts
```

---

## 10. Prioritas Pengerjaan (Urutan Disarankan)

1. Setup project Supabase (tabel, RLS, storage bucket, akun admin) sesuai bagian 8.
2. Migrasi kode existing dari Pocketbase client ke Supabase client — lihat `MIGRATION_NOTES.md` untuk detail spesifik apa saja yang perlu diganti.
3. Pastikan halaman publik (Homepage, Katalog, Detail Produk) berfungsi dengan data dari Supabase.
4. Pastikan tombol/link WhatsApp tetap berfungsi (kemungkinan besar tidak perlu diubah).
5. Bangun admin panel custom (`/admin/login`, `/admin/dashboard`, form tambah/edit) — ini sekarang WAJIB karena tidak ada admin panel bawaan seperti Pocketbase.
6. Deploy Next.js ke Vercel dengan environment variables Supabase yang benar.
7. Testing end-to-end: login admin → tambah produk baru dengan gambar → cek muncul di halaman publik.
8. Setup uptime ping (opsional, lihat catatan free tier di bagian 2) kalau dipilih sebagai solusi auto-pause.

---

## 11. Hal yang EKSPLISIT DI LUAR SCOPE

Agar tidak ada scope creep, hal-hal berikut TIDAK perlu dibangun:
- Sistem pembayaran/checkout apapun (termasuk generate QRIS otomatis) — QRIS fisik diurus manual oleh owner.
- Sistem keranjang belanja (cart).
- Sistem akun/login/signup untuk pengunjung biasa (hanya admin yang login, akun admin dibuat manual lewat Supabase Dashboard, bukan lewat form).
- Multi-bahasa.
- Sistem review/rating produk.
- Newsletter/email marketing.

---

## 12. Ringkasan Biaya

| Item | Biaya |
|---|---|
| Vercel (Next.js hosting) | Gratis |
| Supabase (database + auth + storage) | Gratis (free tier permanen, cukup untuk skala ini; catatan auto-pause 7 hari lihat bagian 2) |
| Domain custom (opsional) | ~Rp100.000–200.000/tahun (di luar scope teknis, keputusan owner) |
| **Total bulanan** | **Rp0** (kecuali domain, itu pun tahunan bukan bulanan) |
