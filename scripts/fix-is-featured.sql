-- ==============================================================================
-- FIX: Tambahkan Kolom is_featured & image_gallery_urls ke Tabel products
-- Jalankan query singkat ini pada SQL Editor di Dashboard Supabase:
-- https://supabase.com/dashboard/project/ghosopesjhwxqkafnsrf/sql/new
-- ==============================================================================

alter table if exists products add column if not exists is_featured boolean not null default false;
alter table if exists products add column if not exists image_gallery_urls text[];
alter table if exists products add column if not exists size_ml integer;
alter table if exists products add column if not exists category text;
alter table if exists products add column if not exists is_available boolean not null default true;
create unique index if not exists products_slug_idx on products (slug);

-- Muat ulang cache schema PostgREST
notify pgrst, 'reload schema';
