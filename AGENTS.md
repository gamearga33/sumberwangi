# AGENTS.md — Sumber Wangi

File ini dibaca otomatis oleh Antigravity di awal setiap sesi kerja di repo ini. Isinya adalah aturan wajib, bukan saran — agent bekerja **otonom tanpa review manual per-step** dari user, jadi standar di bawah ini adalah gerbang kualitas yang harus dipenuhi sebelum kode dianggap selesai. User mengecek hasil akhir, bukan proses.

## Dokumen Terkait (WAJIB dibaca juga)

- **`SUMBER_WANGI_SPEC.md`** (di root repo yang sama) — berisi spesifikasi fitur lengkap: tech stack final, skema database, struktur halaman, alur WhatsApp, rencana deployment, dan batasan scope. Baca dokumen ini SEBELUM mulai coding apapun. File `AGENTS.md` ini hanya berisi aturan *cara kerja & standar kualitas*, bukan spesifikasi *apa yang dibangun* — dua-duanya harus dipatuhi bersamaan.
- **`MIGRATION_NOTES.md`** (jika ada di root repo) — kalau file ini ada, artinya project sedang dalam proses migrasi dari stack lama ke stack baru yang dijelaskan di `SUMBER_WANGI_SPEC.md`. WAJIB dibaca dan diikuti sebelum mengubah kode terkait backend/database, supaya tidak ada data yang hilang atau langkah migrasi yang terlewat.

---

## 1. Prinsip Utama

1. **Jangan berhenti untuk bertanya hal kecil.** Kalau ada ambiguitas minor (nama variabel, urutan file, dsb), ambil keputusan yang wajar sesuai konvensi industri dan lanjutkan. Catat asumsi yang diambil di commit message atau comment jika signifikan.
2. **Jangan diam-diam mengubah keputusan arsitektur besar** (stack, struktur database, dsb) yang sudah ditetapkan di `SUMBER_WANGI_SPEC.md`. Kalau menemukan alasan kuat untuk mengubah, tulis alasannya jelas di `DECISIONS.md` (lihat bagian 8) alih-alih diam-diam menyimpang.
3. **Selesai bukan berarti "jalan sekali di kondisi ideal".** Kode dianggap selesai kalau sudah menangani kasus gagal yang realistis (lihat bagian 3).
4. **Konsisten lebih penting daripada kreatif.** Ikuti satu pola penamaan, satu gaya struktur file, satu cara handling error di seluruh proyek — jangan berubah gaya di tengah jalan.

---

## 2. Standar Kode — Readability & Maintainability

- **Bahasa penamaan:** kode & nama variabel/fungsi dalam **Bahasa Inggris** (konvensi umum industri), tapi teks yang tampil ke user (UI copy) dalam **Bahasa Indonesia**.
- **TypeScript wajib strict mode** (`strict: true` di `tsconfig.json`). Tidak boleh ada `any` tanpa alasan eksplisit yang dikomentari.
- **Penamaan konsisten:**
  - Komponen React: `PascalCase` (`ProductCard.tsx`)
  - Fungsi & variabel: `camelCase`
  - File utilitas/helper: `camelCase.ts`
  - Konstanta global: `UPPER_SNAKE_CASE`
- **Komponen kecil & fokus.** Kalau satu file komponen sudah > 150-200 baris, pertimbangkan pecah jadi sub-komponen.
- **Tidak ada "magic values".** Angka atau string yang berulang (misal format pesan WA, warna brand, dsb) taruh di konstanta bernama, bukan hardcoded berulang di banyak tempat.
- **Comment hanya untuk "kenapa", bukan "apa".** Kode harus cukup jelas dari penamaan tanpa butuh comment yang menjelaskan hal obvious. Comment dipakai untuk menjelaskan keputusan non-obvious (misal "pakai ISR 60 detik karena Pocketbase free tier sensitif rate limit").
- **Format otomatis:** setup **Prettier** + **ESLint** (pakai config default Next.js `eslint-config-next` sebagai basis) sejak awal proyek, bukan belakangan. Semua kode harus lolos lint tanpa warning sebelum dianggap selesai.
- **Import terorganisir:** urutan import konsisten (built-in → external packages → internal/local), gunakan alias `@/` untuk import internal alih-alih relative path panjang (`../../../`).

---

## 3. Standar "Production-Ready"

### Error Handling
- **Setiap pemanggilan Pocketbase API harus dibungkus try-catch** dengan pesan error yang jelas — jangan biarkan error mentah dari SDK tampil ke user.
- **Loading state & error state wajib ada** di setiap komponen yang fetch data (halaman katalog, detail produk, admin dashboard) — jangan biarkan halaman kosong/blank saat data belum/gagal dimuat.
- **Halaman 404 custom** untuk produk yang slug-nya tidak ditemukan (`app/produk/[slug]/not-found.tsx`), bukan crash atau halaman kosong.
- **Graceful degradation:** kalau Pocketbase (backend) down, halaman publik harus tetap menampilkan pesan yang masuk akal ("Produk sedang tidak dapat dimuat, silakan coba lagi nanti"), bukan error stack trace ke user.

### Validasi Input
- **Semua form (khususnya form tambah/edit produk di admin) wajib divalidasi di client DAN diandalkan validasi server-side Pocketbase juga** (jangan hanya percaya validasi client).
- Validasi minimal: field wajib tidak boleh kosong, `price` harus angka positif, `slug` harus format URL-safe (lowercase, dash, tanpa spasi/karakter spesial), gambar harus format yang didukung (jpg/png/webp) dengan batas ukuran wajar (misal maks 5MB).
- Tampilkan pesan error validasi yang spesifik per-field, bukan generic "Form tidak valid".

### Keamanan
- **Autentikasi admin di Next.js:** token Pocketbase disimpan di **httpOnly cookie**, bukan localStorage/sessionStorage (mencegah akses via JavaScript/XSS).
- **Middleware wajib memvalidasi token di server**, bukan hanya cek keberadaan cookie di client.
- **Environment variables sensitif** (kalau ada nanti) tidak boleh di-commit ke git — pastikan `.env.local` ada di `.gitignore` sejak commit pertama.
- **Rate limiting kasar** pada halaman login admin jika memungkinkan (Pocketbase punya built-in protection dasar, manfaatkan itu, tidak perlu bangun sendiri dari nol untuk skala ini).
- Sanitize/escape semua data yang berasal dari database sebelum ditampilkan (Next.js/React sudah escape otomatis by default — jangan gunakan `dangerouslySetInnerHTML` kecuali benar-benar perlu, dan kalau perlu, sanitize dulu).

### Performa
- Gambar produk pakai komponen `next/image` (bukan tag `<img>` biasa) agar otomatis dioptimasi.
- Gunakan SSG/ISR untuk halaman publik sesuai spec proyek (bukan client-side fetching untuk data yang seharusnya statis).

---

## 4. Testing — Porsi yang Disarankan

Untuk skala proyek ini (company profile kecil, <20 produk), testing penuh (coverage tinggi, E2E lengkap) **overkill**. Tapi testing nol juga berisiko karena agent bekerja otonom tanpa review manual — kesalahan logic bisa lolos tanpa ketahuan. Rekomendasi: **testing minimal yang menyasar bagian paling rawan salah**, bukan menyasar semua baris kode.

**Yang WAJIB ditest (unit test, pakai Vitest atau Jest):**
- Fungsi generate link WhatsApp (`lib/whatsapp.ts`) — pastikan format URL & encoding pesan benar untuk berbagai kasus (nama produk dengan karakter spesial, harga dengan format rupiah, dsb).
- Fungsi validasi form produk (harga harus positif, slug format benar, dsb).
- Fungsi slug generator (jika ada auto-generate slug dari nama produk).

**Yang OPSIONAL (boleh dilewati untuk skala ini):**
- Unit test untuk komponen UI murni (tampilan doang, tanpa logic kompleks).
- E2E testing (Playwright/Cypress) — nice to have tapi tidak wajib untuk skala <20 produk. Kalau ada waktu lebih, prioritaskan 1 E2E flow paling kritis saja: "pengunjung buka katalog → klik produk → klik pesan WA → link WA benar".

**Yang TIDAK PERLU:**
- Load testing / stress testing (traffic proyek ini kecil).
- Test coverage requirement dalam persentase tertentu (misal "harus 80% coverage") — tidak relevan di skala ini, fokus ke area rawan saja.

---

## 5. Git & Commit Hygiene

- Commit kecil dan sering, bukan 1 commit raksasa di akhir. Setiap commit harus representasikan 1 perubahan logis (misal "Add product catalog page", bukan "update stuff").
- Commit message format: `<tipe>: <deskripsi singkat>` — tipe seperti `feat`, `fix`, `refactor`, `docs`, `chore`. Contoh: `feat: add WhatsApp redirect button on product detail page`.
- Jangan commit file yang seharusnya di-ignore: `node_modules/`, `.env.local`, `.next/`, file build lainnya. Pastikan `.gitignore` benar sejak commit pertama.
- Branch `main` harus selalu dalam kondisi yang bisa di-deploy (tidak ada kode setengah jadi yang break build).

---

## 6. Struktur Dokumentasi yang Harus Dihasilkan Agent

Selain kode, agent wajib menghasilkan dokumen-dokumen berikut di root proyek:

1. **`README.md`** — wajib berisi:
   - Deskripsi singkat proyek.
   - Cara menjalankan proyek secara lokal (step by step, termasuk cara jalankan Pocketbase lokal).
   - Daftar environment variables yang dibutuhkan (tanpa isi credential asli).
   - Struktur folder singkat.
   - Cara deploy (ringkas, rujuk ke bagian 8 `SUMBER_WANGI_SPEC.md` untuk detail).

2. **`DECISIONS.md`** — log keputusan teknis yang diambil agent secara mandiri selama development (bukan yang sudah ditentukan di spec), beserta alasannya. Ini penting supaya user yang cek hasil akhir tahu kenapa suatu keputusan diambil tanpa harus baca semua kode. Contoh entry:
   ```
   ## 2026-09-16 — Pakai ISR revalidate 300 detik untuk halaman katalog
   Alasan: keseimbangan antara data fresh (owner update produk) dan menghindari 
   rate limit Pocketbase free tier di Fly.io.
   ```

3. **Comment `// TODO:`** untuk hal yang sengaja belum sempurna karena keterbatasan waktu/scope, supaya kelihatan jelas saat user review, bukan tersembunyi diam-diam.

---

## 7. Checklist "Definisi Selesai" (Definition of Done)

Agent harus menganggap sebuah fitur/halaman SELESAI hanya jika semua ini terpenuhi:

- [ ] Lolos lint & format check tanpa warning.
- [ ] Tidak ada `console.log` sisa debugging yang tertinggal di kode final.
- [ ] Ada loading state & error state (untuk komponen yang fetch data).
- [ ] Responsive — tampil baik di mobile (karena kemungkinan besar banyak pengunjung dari HP, apalagi via scan QRIS).
- [ ] Input form (kalau ada) divalidasi.
- [ ] Tidak ada data sensitif (token, password) yang ter-expose di client-side code atau ter-commit ke git.
- [ ] Sudah dicoba jalan end-to-end minimal sekali secara manual oleh agent sebelum ditandai selesai.

---

## 8. Kalau Agent Menyimpang dari Spec

Kalau selama pengerjaan agent menemukan bahwa sesuatu di `SUMBER_WANGI_SPEC.md` ternyata tidak ideal atau perlu disesuaikan (misal ternyata butuh dependency tambahan, atau pendekatan tertentu lebih baik), **agent BOLEH menyesuaikan**, tapi WAJIB:
1. Catat perubahan & alasannya di `DECISIONS.md`.
2. Pastikan perubahan tidak melanggar batasan eksplisit di bagian "Hal yang Eksplisit di Luar Scope" pada `SUMBER_WANGI_SPEC.md`.
3. Tidak menambah biaya bulanan/dependency berbayar baru tanpa mencatatnya jelas sebagai flag untuk user cek nanti.
