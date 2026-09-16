-- ==============================================================================
-- SEED DATA 11 VARIAN PARFUM RESMI SUMBER WANGI
-- Jalankan skrip ini pada SQL Editor di Dashboard Supabase:
-- https://supabase.com/dashboard/project/ghosopesjhwxqkafnsrf/sql/new
-- Skrip ini sepenuhnya idempotent & aman dijalankan berulang kali.
-- ==============================================================================

-- 1. Pastikan tabel products sudah ada jika schema.sql belum dijalankan
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

-- 2. Pastikan kolom is_featured dan kolom pendukung lainnya sudah ada jika tabel sudah terlanjur dibuat
alter table if exists products add column if not exists is_featured boolean not null default false;
alter table if exists products add column if not exists image_gallery_urls text[];
alter table if exists products add column if not exists size_ml integer;
alter table if exists products add column if not exists category text;
alter table if exists products add column if not exists is_available boolean not null default true;

-- 3. Pastikan unique index pada slug ada agar klausa ON CONFLICT (slug) selalu berhasil
create unique index if not exists products_slug_idx on products (slug);

-- 4. Aktifkan Row Level Security (RLS) dan pastikan kebijakan select publik aktif
alter table products enable row level security;

drop policy if exists "Public can view available products" on products;
create policy "Public can view available products"
on products for select
using (is_available = true);

-- 5. Masukkan / perbarui 11 varian resmi Sumber Wangi
insert into products (name, slug, description, price, size_ml, image_url, category, is_available, is_featured)
values
  (
    'Romanwish',
    'romanwish',
    '<p>Aroma feminin, manis, lembut dan romantis. Karakter wangi manis yang menawan, memberikan nuansa hangat dan menyenangkan untuk menemani aktivitas harian Anda.</p><p><strong>Karakter Aroma:</strong> Manis, Floral Lembut, Romantis<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/romanwish.jpg',
    'Wanita',
    true,
    true
  ),
  (
    'Bulgari Aqua',
    'bulgari-aqua',
    '<p>Aroma fresh, aquatic dan bersih. Sensasi kesegaran laut yang maskulin, dinamis, dan memberikan rasa percaya diri serta kesegaran maksimal sepanjang hari.</p><p><strong>Karakter Aroma:</strong> Fresh Aquatic, Marine, Bersih<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/bulgari-aqua.jpg',
    'Pria',
    true,
    true
  ),
  (
    'Nagita',
    'nagita',
    '<p>Aroma feminin, manis dan elegan. Sentuhan floral dan gourmand berkelas yang memancarkan aura anggun, mewah, dan memikat tanpa rasa berlebihan.</p><p><strong>Karakter Aroma:</strong> Manis, Mewah, Elegan<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/nagita.jpg',
    'Wanita',
    true,
    true
  ),
  (
    'Vanilla Ice',
    'vanilla-ice',
    '<p>Aroma vanilla manis, lembut dan hangat. Perpaduan keharuman vanilla manis berpadu sensasi dingin segar yang menenangkan dan ramah digunakan siapa saja.</p><p><strong>Karakter Aroma:</strong> Sweet Vanilla, Cool, Comforting<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/vanilla-ice.jpg',
    'Unisex',
    true,
    true
  ),
  (
    'Melati Keraton',
    'melati-keraton',
    '<p>Aroma melati lembut, anggun dan klasik. Keharuman melati tradisional Nusantara yang khas, sejuk, dan memancarkan wibawa kecantikan putri keraton.</p><p><strong>Karakter Aroma:</strong> White Floral, Melati Tradisional, Anggun<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/melati-keraton.jpg',
    'Wanita',
    true,
    false
  ),
  (
    'Harajuku Love',
    'harajuku-love',
    '<p>Aroma manis, fruity dan ceria. Sentuhan buah-buahan manis segar yang memberi energi dan keceriaan di setiap momen pergaulan dan aktivitas harian.</p><p><strong>Karakter Aroma:</strong> Fruity Sweet, Ceria, Segar<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/harajuku-love.jpg',
    'Wanita',
    true,
    false
  ),
  (
    'Sakura',
    'sakura',
    '<p>Aroma floral lembut, fresh dan feminin. Kesegaran kelopak bunga sakura musim semi yang mekar anggun, menenangkan dan memikat tanpa menusuk hidung.</p><p><strong>Karakter Aroma:</strong> Soft Floral, Fresh Spring, Feminin<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/sakura.jpg',
    'Wanita',
    true,
    true
  ),
  (
    'Avril',
    'avril',
    '<p>Aroma feminin, lembut dan elegan. Wangi manis lembut yang memancarkan karisma modern, bebas, dan percaya diri sepanjang hari.</p><p><strong>Karakter Aroma:</strong> Soft Elegant, Floral Gourmand<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/avril.jpg',
    'Wanita',
    true,
    false
  ),
  (
    'Shisi',
    'shisi',
    '<p>Aroma fresh, ringan dan nyaman. Kesegaran lembut yang netral dan menyejukkan, cocok untuk pria maupun wanita yang menyukai wangi bersih seharian.</p><p><strong>Karakter Aroma:</strong> Clean Fresh, Ringan, Menyejukkan<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/shisi.jpg',
    'Unisex',
    true,
    false
  ),
  (
    'JLO Still',
    'jlo-still',
    '<p>Aroma floral, fresh dan feminin. Kombinasi aroma bunga putih segar dan sentuhan daun teh yang berkelas, bersih, dan memikat.</p><p><strong>Karakter Aroma:</strong> White Floral, Tea Note, Berkelas<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/jlo-still.jpg',
    'Wanita',
    true,
    false
  ),
  (
    'Dunhill Blue',
    'dunhill-blue',
    '<p>Aroma fresh, clean dan maskulin. Wangi segar sitrun, embun pagi, dan kayu aromatik yang memancarkan ketegasan dan karisma pria modern.</p><p><strong>Karakter Aroma:</strong> Fresh Clean, Citrus Woody, Maskulin<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    20000,
    35,
    '/images/products/dunhill-blue.jpg',
    'Pria',
    true,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  size_ml = excluded.size_ml,
  image_url = excluded.image_url,
  category = excluded.category,
  is_available = excluded.is_available,
  is_featured = excluded.is_featured,
  updated_at = now();

-- 6. Muat ulang cache schema PostgREST
notify pgrst, 'reload schema';
