/**
 * Script untuk upload 11 foto parfum ke Supabase Storage (bucket: product-images)
 * dan meng-insert/upsert 11 varian produk resmi ke tabel products di Supabase.
 *
 * Jalankan:
 * node scripts/seed-supabase.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Baca environment variables dari .env.local jika ada
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...rest] = trimmed.split('=');
        const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnvLocal();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const supabaseKey = serviceRoleKey || anonKey;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase belum dikonfigurasi!');
  console.error('Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diatur di .env.local.');
  console.error('Alternatif: Anda dapat menjalankan skrip scripts/schema.sql dan scripts/seed.sql langsung di SQL Editor Supabase Dashboard (paling mudah & tanpa setup script).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const productsData = [
  {
    name: 'Romanwish',
    slug: 'romanwish',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma feminin, manis, lembut dan romantis. Karakter wangi manis yang menawan, memberikan nuansa hangat dan menyenangkan untuk menemani aktivitas harian Anda.</p><p><strong>Karakter Aroma:</strong> Manis, Floral Lembut, Romantis<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'romanwish.jpg',
    is_featured: true,
  },
  {
    name: 'Bulgari Aqua',
    slug: 'bulgari-aqua',
    category: 'Pria',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma fresh, aquatic dan bersih. Sensasi kesegaran laut yang maskulin, dinamis, dan memberikan rasa percaya diri serta kesegaran maksimal sepanjang hari.</p><p><strong>Karakter Aroma:</strong> Fresh Aquatic, Marine, Bersih<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'bulgari-aqua.jpg',
    is_featured: true,
  },
  {
    name: 'Nagita',
    slug: 'nagita',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma feminin, manis dan elegan. Sentuhan floral dan gourmand berkelas yang memancarkan aura anggun, mewah, dan memikat tanpa rasa berlebihan.</p><p><strong>Karakter Aroma:</strong> Manis, Mewah, Elegan<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'nagita.jpg',
    is_featured: true,
  },
  {
    name: 'Vanilla Ice',
    slug: 'vanilla-ice',
    category: 'Unisex',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma vanilla manis, lembut dan hangat. Perpaduan keharuman vanilla manis berpadu sensasi dingin segar yang menenangkan dan ramah digunakan siapa saja.</p><p><strong>Karakter Aroma:</strong> Sweet Vanilla, Cool, Comforting<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'vanilla-ice.jpg',
    is_featured: true,
  },
  {
    name: 'Melati Keraton',
    slug: 'melati-keraton',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma melati lembut, anggun dan klasik. Keharuman melati tradisional Nusantara yang khas, sejuk, dan memancarkan wibawa kecantikan putri keraton.</p><p><strong>Karakter Aroma:</strong> White Floral, Melati Tradisional, Anggun<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'melati-keraton.jpg',
    is_featured: false,
  },
  {
    name: 'Harajuku Love',
    slug: 'harajuku-love',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma manis, fruity dan ceria. Sentuhan buah-buahan manis segar yang memberi energi dan keceriaan di setiap momen pergaulan dan aktivitas harian.</p><p><strong>Karakter Aroma:</strong> Fruity Sweet, Ceria, Segar<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'harajuku-love.jpg',
    is_featured: false,
  },
  {
    name: 'Sakura',
    slug: 'sakura',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma floral lembut, fresh dan feminin. Kesegaran kelopak bunga sakura musim semi yang mekar anggun, menenangkan dan memikat tanpa menusuk hidung.</p><p><strong>Karakter Aroma:</strong> Soft Floral, Fresh Spring, Feminin<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'sakura.jpg',
    is_featured: true,
  },
  {
    name: 'Avril',
    slug: 'avril',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma feminin, lembut dan elegan. Wangi manis lembut yang memancarkan karisma modern, bebas, dan percaya diri sepanjang hari.</p><p><strong>Karakter Aroma:</strong> Soft Elegant, Floral Gourmand<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'avril.jpg',
    is_featured: false,
  },
  {
    name: 'Shisi',
    slug: 'shisi',
    category: 'Unisex',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma fresh, ringan dan nyaman. Kesegaran lembut yang netral dan menyejukkan, cocok untuk pria maupun wanita yang menyukai wangi bersih seharian.</p><p><strong>Karakter Aroma:</strong> Clean Fresh, Ringan, Menyejukkan<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'shisi.jpg',
    is_featured: false,
  },
  {
    name: 'JLO Still',
    slug: 'jlo-still',
    category: 'Wanita',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma floral, fresh dan feminin. Kombinasi aroma bunga putih segar dan sentuhan daun teh yang berkelas, bersih, dan memikat.</p><p><strong>Karakter Aroma:</strong> White Floral, Tea Note, Berkelas<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'jlo-still.jpg',
    is_featured: false,
  },
  {
    name: 'Dunhill Blue',
    slug: 'dunhill-blue',
    category: 'Pria',
    price: 20000,
    size_ml: 35,
    description:
      '<p>Aroma fresh, clean dan maskulin. Wangi segar sitrun, embun pagi, dan kayu aromatik yang memancarkan ketegasan dan karisma pria modern.</p><p><strong>Karakter Aroma:</strong> Fresh Clean, Citrus Woody, Maskulin<br/><strong>Daya Tahan:</strong> 12 - 14+ Jam<br/><strong>Konsentrasi:</strong> Eau De Parfum</p>',
    imageFile: 'dunhill-blue.jpg',
    is_featured: true,
  },
];

async function seed() {
  console.log(`[seed-supabase] Menghubungkan ke Supabase di ${supabaseUrl}...`);

  if (!serviceRoleKey && adminEmail && adminPassword) {
    console.log(`[seed-supabase] Mengautentikasi sebagai admin (${adminEmail})...`);
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    if (authErr) {
      console.warn(`⚠️ Autentikasi admin gagal (${authErr.message}). Melanjutkan dengan anon key...`);
    } else {
      console.log(`✅ Berhasil login sebagai admin untuk upload dan insert.`);
    }
  } else if (!serviceRoleKey) {
    console.log(
      'ℹ️ Catatan: Menjalankan dengan anon key tanpa kredensial admin. Jika RLS menolak akses, jalankan scripts/seed.sql di SQL Editor Supabase Dashboard, atau setel SUPABASE_SERVICE_ROLE_KEY di .env.local.'
    );
  }

  for (const item of productsData) {
    let finalImageUrl = `/images/products/${item.imageFile}`;

    // Coba upload file ke Supabase Storage bucket 'product-images'
    const imagePath = path.join(__dirname, 'assets', item.imageFile);
    if (fs.existsSync(imagePath)) {
      const fileBuffer = fs.readFileSync(imagePath);
      const storageFilename = `${item.slug}.jpg`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(storageFilename, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadErr) {
        console.warn(`⚠️ Gagal upload foto ${item.imageFile} ke storage (${uploadErr.message}), menggunakan fallback URL lokal.`);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(uploadData.path);
        finalImageUrl = publicUrlData.publicUrl;
        console.log(`✅ Foto ${item.imageFile} berhasil diunggah ke storage: ${finalImageUrl}`);
      }
    }

    // Upsert record ke tabel products berdasarkan slug unik
    const { error: upsertErr } = await supabase.from('products').upsert(
      {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        size_ml: item.size_ml,
        category: item.category,
        image_url: finalImageUrl,
        is_available: true,
        is_featured: item.is_featured,
      },
      { onConflict: 'slug' }
    );

    if (upsertErr) {
      console.error(`❌ Gagal menyimpan produk ${item.name}:`, upsertErr.message);
    } else {
      console.log(`✨ Produk ${item.name} berhasil disimpan ke database.`);
    }
  }

  console.log('[seed-supabase] Seluruh 11 varian parfum Sumber Wangi selesai diproses.');
}

seed().catch((err) => {
  console.error('[seed-supabase] Fatal error:', err);
  process.exit(1);
});
