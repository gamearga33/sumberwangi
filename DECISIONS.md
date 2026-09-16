# DECISIONS.md — Log Keputusan Teknis Sumber Wangi

Dokumen ini mencatat keputusan teknis mandiri yang diambil selama pengembangan proyek Sumber Wangi (sesuai aturan di `AGENTS.md`).

---

## 2026-09-16 — Struktur Folder Root & PocketBase Lokal
- **Keputusan:** Meletakkan aplikasi Next.js langsung di root proyek (`c:\Projects\sumberwangi`), dan meletakkan binary serta data PocketBase di folder `pocketbase/` yang di-ignore oleh git (`pocketbase/pocketbase.exe`, `pocketbase/pb_data/`).
- **Alasan:** Memudahkan konfigurasi Vercel (karena root directory Next.js berada di `./` tanpa perlu setting sub-directory tambahan), sekaligus menjaga PocketBase lokal terisolasi dan mudah dijalankan untuk proses development lokal.

## 2026-09-16 — Penggunaan PocketBase v0.40.x
- **Keputusan:** Menggunakan PocketBase versi terbaru (v0.40.4) yang menggunakan koleksi `_superusers` bawaan untuk autentikasi admin/superuser sesuai spesifikasi di `SUMBER_WANGI_SPEC.md` bagian 4 & 5.
- **Alasan:** Sesuai dengan spesifikasi modern PocketBase dan mendukung API rules granular serta performa SQLite yang lebih stabil.
