-- ==============================================================================
-- SEED DATA 11 VARIAN PARFUM RESMI SUMBER WANGI
-- Jalankan skrip ini pada SQL Editor di Dashboard Supabase setelah menjalankan schema.sql
-- ==============================================================================

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
