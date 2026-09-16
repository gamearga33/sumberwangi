# Spesifikasi Proyek: Website Sumber Wangi

Dokumen ini adalah spesifikasi teknis lengkap untuk dikerjakan oleh AI coding agent. Semua keputusan arsitektur sudah final — agent tidak perlu bertanya ulang soal stack, cukup eksekusi sesuai dokumen ini. Jika ada ambiguitas kecil di luar dokumen ini, agent boleh mengambil keputusan wajar dan mencatatnya, bukan berhenti untuk bertanya.

---

## 1. Ringkasan Proyek

Website company profile untuk **Sumber Wangi**, brand parfum lokal. Fungsi utama:

1. Menampilkan profil brand & katalog produk parfum (< 20 produk).
2. Pengunjung yang tertarik pada produk diarahkan ke WhatsApp untuk memesan (tidak ada sistem pembayaran/checkout di website — cukup redirect ke `wa.me` dengan pesan pre-filled).
3. Owner bisa menambah/mengubah/menghapus produk sendiri lewat panel admin, tanpa bantuan developer.
4. QRIS fisik akan ditempel di kemasan produk oleh owner (di luar scope website ini) — ketika discan, mengarahkan ke URL website. Website hanya perlu punya URL publik yang stabil; tidak ada logika pembayaran yang perlu dibangun.

**Skala:** sangat kecil. < 20 produk, traffic rendah-menengah, 1-2 admin (owner + developer). Semua keputusan teknis di bawah ini dioptimalkan untuk kesederhanaan, bukan untuk scale besar.

---

## 2. Tech Stack (FINAL — jangan diubah tanpa persetujuan user)

| Layer | Pilihan | Alasan |
|---|---|---|
| Frontend framework | **Next.js** (App Router, versi stabil terbaru) | SSG untuk performa & SEO bagus, ekosistem matang |
| Styling | **Tailwind CSS** (utility classes murni, TANPA component library seperti shadcn/ui) | Ringan, kontrol penuh atas desain |
| Backend + Database + Admin Panel | **Pocketbase** (self-hosted, single binary) | Auto-generate admin panel siap pakai, database SQLite built-in, auth built-in, file storage built-in — cocok untuk skala kecil tanpa perlu bangun backend custom |
| Hosting frontend (Next.js) | **Vercel** (free tier) | Auto-deploy dari Git, gratis untuk skala ini |
| Hosting backend (Pocketbase) | **Fly.io** (free allowance) | Pocketbase butuh proses yang nyala terus (bukan serverless), Fly.io menyediakan VM kecil gratis yang cocok |
| Image storage | **Pocketbase built-in file storage** (bukan Cloudinary) — lihat catatan di bawah | Karena sudah pakai Pocketbase, tidak perlu layanan storage terpisah; Pocketbase sudah bisa handle file upload & serve gambar langsung. Sederhanakan stack. |
| Domain | Custom domain (opsional di awal, bisa mulai dari subdomain gratis Vercel/Fly.io) | Keputusan bisnis owner, di luar scope teknis |

**Catatan penting soal image storage:** keputusan sebelumnya sempat menyebut Cloudinary, tapi karena backend sudah Pocketbase (yang punya file storage bawaan cukup baik untuk <20 produk dengan 1-2 foto masing-masing), gunakan storage bawaan Pocketbase saja. Ini mengurangi satu dependency eksternal tanpa kerugian berarti di skala ini.

### Yang SENGAJA TIDAK dipakai (dan kenapa)
- ❌ Supabase — terlalu berat untuk 1 tabel data & <20 produk, ada risiko auto-pause di free tier.
- ❌ NextAuth / Auth.js kompleks — cukup pakai autentikasi sederhana berbasis Pocketbase Auth (lihat bagian 5).
- ❌ shadcn/ui atau component library lain — user eksplisit minta Tailwind polos untuk kontrol desain penuh.
- ❌ Payment gateway apapun — QRIS diurus manual oleh owner secara fisik, di luar scope aplikasi.

---

## 3. Arsitektur & Alur Data

```
[Pengunjung Website] 
        │
        ▼
[Next.js di Vercel] ──(fetch data produk saat build/request)──▶ [Pocketbase API di Fly.io]
        │                                                              │
        │                                                              ▼
        │                                                    [SQLite file + gambar produk]
        ▼
[Klik "Pesan via WhatsApp"] ──▶ [Redirect ke wa.me dengan pesan pre-filled]

[Owner/Admin] ──▶ [Login ke Pocketbase Admin Panel (bawaan)] ──▶ [CRUD produk langsung dari sana]
```

**Poin penting:** Owner TIDAK perlu login ke Next.js untuk kelola produk. Owner cukup diberi URL admin panel Pocketbase (contoh: `https://sumberwangi-api.fly.dev/_/`) beserta kredensial. Panel ini sudah otomatis tersedia dari Pocketbase, tidak perlu dibangun manual.

Namun, user juga meminta ada halaman admin custom di sisi Next.js dengan login sendiri (lihat bagian 5) — ini opsional sebagai "wrapper" yang lebih ramah tampilan untuk owner, tapi Pocketbase admin panel bawaan tetap jadi fallback yang selalu berfungsi.

---

## 4. Skema Data (Pocketbase Collections)

### Collection: `products`

| Field | Tipe | Wajib? | Catatan |
|---|---|---|---|
| `name` | Text | Ya | Nama produk, misal "Sumber Wangi - Oud Royale" |
| `slug` | Text (unique) | Ya | URL-friendly identifier, misal `oud-royale`, untuk halaman detail produk |
| `description` | Editor/Text (long) | Ya | Deskripsi produk |
| `price` | Number | Ya | Harga dalam Rupiah (simpan sebagai integer, misal 150000) |
| `size_ml` | Number | Tidak | Ukuran botol dalam ml, opsional untuk ditampilkan |
| `image` | File (single, image) | Ya | 1 gambar utama produk |
| `image_gallery` | File (multiple, image) | Tidak | Opsional, 1-2 gambar tambahan |
| `category` | Select (opsional, misal: "Pria", "Wanita", "Unisex") | Tidak | Untuk filter di halaman katalog jika dibutuhkan |
| `is_available` | Bool | Ya (default true) | Untuk sembunyikan produk tanpa hapus data |
| `created` | Auto (built-in Pocketbase) | - | Otomatis |
| `updated` | Auto (built-in Pocketbase) | - | Otomatis |

### Collection: `_superusers` (bawaan Pocketbase)
Gunakan sistem auth bawaan Pocketbase untuk admin. Buat 1 akun superuser untuk owner + 1 untuk developer (atau share 1 akun, sesuai preferensi nanti).

### API Rules (Pocketbase Collection Rules)
- **List/View** (`products`): **public** (kosongkan rule / allow all) — supaya Next.js bisa fetch data tanpa auth, karena ini data publik untuk ditampilkan di website.
- **Create/Update/Delete** (`products`): **hanya authenticated superuser** — supaya CRUD hanya bisa dari admin panel yang sudah login.

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
   - Gambar (bisa galeri jika ada `image_gallery`), nama, deskripsi lengkap, harga, ukuran.
   - Tombol besar "Pesan via WhatsApp" — lihat format pesan di bagian 6.

4. **Halaman Tentang Kami (`/tentang`)** — opsional, bisa digabung ke homepage jika ingin lebih simpel.

5. **Halaman Kontak (`/kontak`)** — opsional, bisa cukup footer saja jika sederhana.

### Admin-facing

**Opsi utama (WAJIB ada, karena ini bawaan Pocketbase & tidak perlu effort tambahan):**
- Pocketbase Admin Panel bawaan di `https://[fly-app-url]/_/` — owner login dengan email/password, langsung bisa CRUD produk dengan UI yang sudah jadi (form, upload gambar, dll).

**Opsi tambahan (sesuai permintaan user — login terpisah di sisi Next.js):**
- Halaman `/admin/login` di Next.js: form login sederhana (email + password) yang memverifikasi ke Pocketbase Auth (`pb.collection('_superusers').authWithPassword()`).
- Setelah login berhasil, redirect ke `/admin/dashboard` yang menampilkan list produk dengan tombol tambah/edit/hapus.
- Form tambah/edit produk di `/admin/produk/baru` dan `/admin/produk/[id]/edit`.
- Proteksi route: gunakan middleware Next.js untuk cek session/token Pocketbase sebelum izinkan akses ke halaman `/admin/*` (kecuali `/admin/login`).
- Simpan auth token di **httpOnly cookie** (bukan localStorage) agar lebih aman dari XSS.

> **Catatan implementasi:** Karena Pocketbase admin panel bawaan sudah fully-functional, agent boleh memprioritaskan halaman publik terlebih dahulu, lalu admin panel Next.js custom sebagai tahap berikutnya jika waktu terbatas. Tapi kedua-duanya tetap dalam scope karena user sudah eksplisit meminta login terpisah di Next.js.

---

## 6. Integrasi WhatsApp

- Nomor WA: gunakan **dummy placeholder** dulu — simpan sebagai environment variable `NEXT_PUBLIC_WA_NUMBER` dengan nilai placeholder `6281234567890` (format internasional tanpa `+` atau `0` di depan). User akan mengganti sendiri nanti.
- Format link: `https://wa.me/{NEXT_PUBLIC_WA_NUMBER}?text={pesan_encoded}`
- Contoh pesan pre-filled (sesuaikan bahasa Indonesia santai tapi sopan):
  ```
  Halo Sumber Wangi, saya tertarik dengan produk "{nama_produk}" (Rp{harga}). Apakah masih tersedia?
  ```
- Gunakan `encodeURIComponent()` untuk encode pesan sebelum dimasukkan ke URL.
- Satu nomor WA berlaku untuk semua produk (tidak per-produk/kategori).

---

## 7. Environment Variables

### Next.js (`.env.local`)
```
NEXT_PUBLIC_POCKETBASE_URL=https://sumberwangi-api.fly.dev
NEXT_PUBLIC_WA_NUMBER=6281234567890
```

### Pocketbase (Fly.io)
Tidak butuh env var khusus untuk setup dasar — konfigurasi admin dilakukan lewat UI pertama kali setelah deploy (`/_/` akan minta buat akun superuser pertama kali diakses).

---

## 8. Deployment

### Pocketbase → Fly.io
1. Buat `Dockerfile` sederhana yang menjalankan binary Pocketbase (banyak contoh resmi tersedia di dokumentasi/komunitas Pocketbase untuk Fly.io).
2. Setup **volume persisten** di Fly.io (`fly volumes create`) agar data SQLite & file upload tidak hilang setiap re-deploy — ini WAJIB, jangan pakai ephemeral storage.
3. `fly launch` lalu `fly deploy`.
4. Setelah live, akses `https://[app-name].fly.dev/_/` untuk membuat akun superuser pertama.

### Next.js → Vercel
1. Push kode ke GitHub.
2. Import project di Vercel, set environment variables di atas.
3. Auto-deploy setiap push ke branch `main`.
4. Gunakan `generateStaticParams` untuk halaman detail produk agar bisa di-SSG, atau ISR (`revalidate`) dengan interval wajar (misal 60 detik-1 jam) supaya perubahan dari admin panel muncul tanpa perlu redeploy manual.

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
│   ├── pocketbase.ts                # Init Pocketbase client
│   └── whatsapp.ts                  # Helper generate link WA
├── middleware.ts                    # Proteksi route /admin/*
├── .env.local
└── tailwind.config.ts
```

---

## 10. Prioritas Pengerjaan (Urutan Disarankan)

1. Setup Pocketbase lokal dulu untuk development (jalankan binary di local, tidak perlu deploy dulu) — buat collection `products` sesuai skema.
2. Setup project Next.js + Tailwind, koneksikan ke Pocketbase lokal.
3. Bangun halaman publik: Homepage → Katalog → Detail Produk.
4. Implementasi tombol/link WhatsApp.
5. Deploy Pocketbase ke Fly.io (dengan volume persisten), pindahkan koneksi dari local ke URL Fly.io.
6. Deploy Next.js ke Vercel.
7. (Jika waktu memungkinkan) Bangun admin panel custom di Next.js sesuai bagian 5.
8. Testing end-to-end: tambah produk lewat admin panel Pocketbase bawaan → cek muncul di website live.

---

## 11. Hal yang EKSPLISIT DI LUAR SCOPE

Agar tidak ada scope creep, hal-hal berikut TIDAK perlu dibangun:
- Sistem pembayaran/checkout apapun (termasuk generate QRIS otomatis) — QRIS fisik diurus manual oleh owner.
- Sistem keranjang belanja (cart).
- Sistem akun/login untuk pengunjung biasa (hanya admin yang login).
- Multi-bahasa.
- Sistem review/rating produk.
- Newsletter/email marketing.

---

## 12. Ringkasan Biaya

| Item | Biaya |
|---|---|
| Vercel (Next.js hosting) | Gratis |
| Fly.io (Pocketbase hosting) | Gratis (dalam free allowance; perlu kartu kredit untuk verifikasi akun) |
| Pocketbase (software) | Gratis, open-source |
| Domain custom (opsional) | ~Rp100.000–200.000/tahun (di luar scope teknis, keputusan owner) |
| **Total bulanan** | **Rp0** (kecuali domain, itu pun tahunan bukan bulanan) |
