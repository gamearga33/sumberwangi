# Catatan Migrasi: Pocketbase → Supabase

Dokumen ini khusus untuk agent yang melanjutkan project yang **progress-nya sudah lumayan berjalan** dengan stack lama (Pocketbase + Fly.io). Baca ini SEBELUM mulai coding, sebagai pelengkap `SUMBER_WANGI_SPEC.md` (v2) yang jadi source of truth arsitektur baru.

---

## 1. Kenapa Migrasi Ini Terjadi

Singkatnya (untuk konteks, bukan untuk didebat/diubah lagi):
1. Rencana awal: Pocketbase (backend+admin panel otomatis) di-hosting di Fly.io (gratis).
2. Ternyata Fly.io sudah menghapus free allowance permanen sejak Oktober 2024 — akun baru cuma dapat trial 7 hari lalu wajib kartu kredit & bayar.
3. Alternatif Render.com free tier ditemukan **tidak menyediakan persistent disk** di paket gratis — artinya data SQLite (produk) dan file gambar produk akan **hilang setiap kali service di-redeploy atau restart**. Ini risiko yang tidak bisa diterima untuk data bisnis owner.
4. Keputusan akhir: pindah ke **Supabase**, yang menyediakan Postgres + Storage terkelola (managed) secara gratis dan permanen tanpa risiko kehilangan data seperti di atas.

---

## 2. Apa yang TETAP DIPAKAI (Tidak Perlu Diubah)

Bagian-bagian ini independen dari backend, jadi kemungkinan besar kode yang sudah ada bisa dipertahankan:

- Struktur halaman publik (`app/page.tsx`, `app/produk/page.tsx`, `app/produk/[slug]/page.tsx`) — layout & komponen visual (JSX/Tailwind) tidak perlu diubah, HANYA cara fetch data-nya yang berubah.
- `lib/whatsapp.ts` (helper generate link WhatsApp) — logic ini sepenuhnya independen dari backend, tidak menyentuh Pocketbase/Supabase sama sekali.
- Komponen UI murni: `ProductCard.tsx`, `WhatsAppButton.tsx`, `Navbar.tsx`, `Footer.tsx` — hanya props/tipe data yang mungkin perlu disesuaikan kalau ada perbedaan nama field.
- Semua styling Tailwind, struktur desain, dan copy/teks yang sudah dibuat.

## 3. Apa yang HARUS DIGANTI

### a) Dependency package
```bash
# Hapus (jika sudah terinstall)
npm uninstall pocketbase

# Install
npm install @supabase/supabase-js @supabase/ssr
```

### b) File koneksi backend
- **Hapus:** `lib/pocketbase.ts` (atau file sejenis yang inisialisasi Pocketbase client).
- **Buat baru:** `lib/supabase/client.ts` dan `lib/supabase/server.ts` sesuai contoh resmi `@supabase/ssr` untuk Next.js App Router (client terpisah untuk client component vs server component/route handler, ini pola standar Supabase — cari di dokumentasi resmi Supabase untuk Next.js App Router jika perlu referensi contoh kode terbaru).

### c) Cara fetch data produk
Ganti semua pemanggilan seperti:
```ts
// LAMA (Pocketbase)
const records = await pb.collection('products').getFullList({ filter: 'is_available = true' });
```
Menjadi:
```ts
// BARU (Supabase)
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_available', true);
```

### d) Field naming
Beberapa field berubah nama karena konvensi Postgres/Supabase berbeda dari Pocketbase:

| Pocketbase (lama) | Supabase (baru) | Catatan |
|---|---|---|
| `id` | `id` | Sama, tapi sekarang UUID Postgres, bukan Pocketbase ID |
| `image` (field file) | `image_url` (text, berisi URL publik) | Di Supabase, upload file dan simpan URL-nya terpisah dari record, bukan langsung sebagai field file |
| `image_gallery` (field file, multiple) | `image_gallery_urls` (text array) | Sama seperti di atas, array of URLs |
| `created` | `created_at` | Konvensi penamaan Postgres |
| `updated` | `updated_at` | Konvensi penamaan Postgres |
| Field lain (`name`, `slug`, `description`, `price`, `size_ml`, `category`, `is_available`) | Sama persis | Tidak berubah |

### e) Upload gambar
Ini perubahan paling signifikan secara logic. Di Pocketbase, file upload jadi satu dengan record produk (multipart form). Di Supabase, ini 2 langkah terpisah:

```ts
// 1. Upload file ke Supabase Storage terlebih dahulu
const { data: uploadData, error: uploadError } = await supabase.storage
  .from('product-images')
  .upload(`${Date.now()}-${file.name}`, file);

// 2. Ambil public URL dari file yang baru diupload
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(uploadData.path);

// 3. Baru simpan publicUrl sebagai field image_url saat insert/update record produk
const { error } = await supabase.from('products').insert({
  name, slug, description, price, image_url: publicUrl, /* ...dst */
});
```

### f) Autentikasi admin
```ts
// LAMA (Pocketbase)
await pb.collection('_superusers').authWithPassword(email, password);

// BARU (Supabase)
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

Middleware proteksi route (`middleware.ts`) perlu ditulis ulang mengikuti pola resmi `@supabase/ssr` untuk Next.js — cari contoh terbaru di dokumentasi Supabase karena pola SSR auth ini cukup spesifik dan sensitif terhadap versi package.

### g) File deployment yang sudah dibuat (bisa dihapus/diarsipkan)
File-file berikut dari setup Fly.io sebelumnya **tidak lagi dipakai** dan boleh dihapus dari project (atau dipindah ke folder `_archive/` jika ingin disimpan sebagai referensi):
- `pocketbase-deploy/Dockerfile`
- `pocketbase-deploy/fly.toml`
- `pocketbase-deploy/pb_migrations/` (folder migrasi Pocketbase)
- Binary `pocketbase.exe` atau `pocketbase/` folder lokal (jika ada, untuk development lokal)
- Script `scripts/setup-db.js` (jika isinya spesifik untuk insert data ke Pocketbase) — perlu ditulis ulang untuk Supabase kalau masih dibutuhkan (misal untuk seed data awal 11 varian parfum yang disebutkan sudah pernah dibuat).

**PENTING:** Sebelum menghapus, agent harus memastikan **tidak ada data produk yang hilang** — kalau saat ini sudah ada data produk (misal 11 varian parfum yang disebutkan sempat di-setup) yang tersimpan di Pocketbase lokal/cloud, agent harus:
1. Export data tersebut dulu (nama, deskripsi, harga, dll — bisa manual dicatat atau lewat Pocketbase Admin UI export).
2. Buat ulang sebagai seed data untuk Supabase (SQL insert atau script Node.js baru yang insert ke Supabase).
3. Baru setelah data dipastikan ter-migrate, hapus file-file Pocketbase lama.

---

## 4. Checklist Migrasi

- [ ] Project Supabase baru sudah dibuat, tabel `products` + RLS policy sudah dijalankan (lihat `SUMBER_WANGI_SPEC.md` v2 bagian 4).
- [ ] Bucket `product-images` sudah dibuat dan public, storage policy sudah diterapkan.
- [ ] Akun admin sudah dibuat manual lewat Supabase Dashboard.
- [ ] Data produk yang sudah ada (jika ada) sudah berhasil di-migrate, tidak ada yang hilang.
- [ ] `package.json` sudah update: `pocketbase` dihapus, `@supabase/supabase-js` + `@supabase/ssr` ditambahkan.
- [ ] Semua pemanggilan `pb.collection(...)` sudah diganti ke Supabase client.
- [ ] Field `image`/`image_gallery` sudah diganti ke `image_url`/`image_gallery_urls` di semua tempat yang mereferensikan (termasuk TypeScript types/interfaces kalau ada).
- [ ] Halaman admin login & CRUD sudah pakai Supabase Auth, bukan Pocketbase Auth.
- [ ] `middleware.ts` sudah pakai pola `@supabase/ssr`, bukan cek token Pocketbase manual.
- [ ] Environment variables sudah diganti (`NEXT_PUBLIC_POCKETBASE_URL` → `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- [ ] File-file Fly.io/Pocketbase deployment lama sudah diarsipkan/dihapus (setelah data dipastikan aman ter-migrate).
- [ ] Testing end-to-end ulang: halaman publik tampil data dari Supabase, admin bisa login & CRUD, WhatsApp button tetap berfungsi.
- [ ] Catat ringkasan migrasi ini (apa yang diganti, kapan) sebagai entry baru di `DECISIONS.md`.

---

## 5. Setelah Migrasi Selesai

File `SUMBER_WANGI_SPEC.md` versi lama (Pocketbase) sebaiknya diganti total dengan isi `SUMBER_WANGI_SPEC_V2.md` (rename jadi `SUMBER_WANGI_SPEC.md`, timpa yang lama) supaya tidak ada 2 sumber kebenaran yang beda di repo. Dokumen `MIGRATION_NOTES.md` ini boleh tetap disimpan sebagai catatan historis, atau dipindah ke `_archive/` setelah checklist di atas selesai semua.
