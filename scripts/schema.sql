-- ==============================================================================
-- SCHEMA & POLICIES DATABASE SUPABASE — SUMBER WANGI
-- Jalankan skrip ini pada SQL Editor di Dashboard Supabase
-- ==============================================================================

-- 1. Tabel Produk
create table if not exists products (
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

-- 2. Trigger auto-update timestamp updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on products;
create trigger set_updated_at
before update on products
for each row execute function update_updated_at_column();

-- 3. Row Level Security (RLS) pada Tabel products
alter table products enable row level security;

-- Policy Select Publik: Pengunjung hanya dapat melihat produk yang aktif/tersedia
drop policy if exists "Public can view available products" on products;
create policy "Public can view available products"
on products for select
using (is_available = true);

-- Policy Admin: Pengguna yang terautentikasi (admin) dapat melakukan CRUD penuh
drop policy if exists "Authenticated users can do everything" on products;
create policy "Authenticated users can do everything"
on products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- 4. Setup Storage Bucket 'product-images'
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Policy Storage: Publik dapat melihat foto produk
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Policy Storage: Hanya admin terautentikasi yang dapat mengunggah foto produk
drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Policy Storage: Hanya admin terautentikasi yang dapat mengubah foto produk
drop policy if exists "Authenticated users can modify product images" on storage.objects;
create policy "Authenticated users can modify product images"
on storage.objects for update
using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- Policy Storage: Hanya admin terautentikasi yang dapat menghapus foto produk
drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and auth.role() = 'authenticated');
