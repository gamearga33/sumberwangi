/**
 * PocketBase Setup and Seed Script for Sumber Wangi
 * Run: node scripts/setup-db.js
 */

const fs = require('fs');
const path = require('path');

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'admin@sumberwangi.com';
const ADMIN_PASS = 'SumberWangi123!';

async function run() {
  console.log(`[setup-db] Menghubungkan ke PocketBase di ${PB_URL}...`);

  // 1. Auth as superuser
  const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS }),
  });

  if (!authRes.ok) {
    throw new Error(`Gagal login superuser: ${authRes.status} ${await authRes.text()}`);
  }

  const authData = await authRes.json();
  const token = authData.token;
  console.log(`[setup-db] Login superuser berhasil sebagai ${authData.record.email}`);

  // 2. Cek apakah koleksi 'products' sudah ada
  const collectionsRes = await fetch(`${PB_URL}/api/collections`, {
    headers: { Authorization: token },
  });
  const collectionsData = await collectionsRes.json();
  let productsCollection = collectionsData.items.find((c) => c.name === 'products');

  const collectionPayload = {
    name: 'products',
    type: 'base',
    listRule: '',
    viewRule: '',
    createRule: "@request.auth.id != ''",
    updateRule: "@request.auth.id != ''",
    deleteRule: "@request.auth.id != ''",
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'slug',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        type: 'editor',
        required: true,
      },
      {
        name: 'price',
        type: 'number',
        required: true,
      },
      {
        name: 'size_ml',
        type: 'number',
        required: false,
      },
      {
        name: 'image',
        type: 'file',
        required: true,
        maxSelect: 1,
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
      {
        name: 'image_gallery',
        type: 'file',
        required: false,
        maxSelect: 5,
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
      {
        name: 'category',
        type: 'select',
        required: false,
        values: ['Pria', 'Wanita', 'Unisex'],
      },
      {
        name: 'is_available',
        type: 'bool',
        required: false,
      },
      {
        name: 'is_featured',
        type: 'bool',
        required: false,
      },
      {
        name: 'created',
        type: 'autodate',
        onCreate: true,
        onUpdate: false,
      },
      {
        name: 'updated',
        type: 'autodate',
        onCreate: true,
        onUpdate: true,
      },
    ],
    indexes: ['CREATE UNIQUE INDEX `idx_products_slug` ON `products` (`slug`)'],
  };

  if (!productsCollection) {
    console.log("[setup-db] Membuat koleksi 'products'...");
    const createRes = await fetch(`${PB_URL}/api/collections`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionPayload),
    });

    if (!createRes.ok) {
      throw new Error(`Gagal membuat koleksi products: ${createRes.status} ${await createRes.text()}`);
    }
    productsCollection = await createRes.json();
    console.log(`[setup-db] Koleksi 'products' berhasil dibuat dengan ID ${productsCollection.id}`);
  } else {
    console.log(`[setup-db] Koleksi 'products' sudah ada (ID: ${productsCollection.id})`);
    const hasFeatured = productsCollection.fields?.some((f) => f.name === 'is_featured');
    if (!hasFeatured) {
      console.log("[setup-db] Menambahkan field 'is_featured' ke koleksi 'products'...");
      const createdIdx = productsCollection.fields.findIndex((f) => f.name === 'created');
      const newField = { name: 'is_featured', type: 'bool', required: false };
      if (createdIdx !== -1) {
        productsCollection.fields.splice(createdIdx, 0, newField);
      } else {
        productsCollection.fields.push(newField);
      }
      await fetch(`${PB_URL}/api/collections/${productsCollection.id}`, {
        method: 'PATCH',
        headers: { Authorization: token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: productsCollection.fields }),
      });
      console.log("[setup-db] Field 'is_featured' berhasil ditambahkan.");
    }
  }

  // 3. Hapus data produk lama agar sinkron dengan daftar varian baru dari user
  console.log('[setup-db] Membersihkan data produk lama...');
  const existingRes = await fetch(`${PB_URL}/api/collections/products/records?perPage=100`, {
    headers: { Authorization: token },
  });
  const existingData = await existingRes.json();
  if (existingData.items && existingData.items.length > 0) {
    for (const item of existingData.items) {
      await fetch(`${PB_URL}/api/collections/products/records/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
    }
    console.log(`[setup-db] ${existingData.items.length} produk lama berhasil dibersihkan.`);
  }

  console.log('[setup-db] Memasukkan 11 varian parfum resmi Sumber Wangi...');

  // 11 Varian resmi dari owner sesuai HTML
  const officialProducts = [
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

  for (const item of officialProducts) {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('slug', item.slug);
    formData.append('description', item.description);
    formData.append('price', String(item.price));
    formData.append('size_ml', String(item.size_ml));
    formData.append('category', item.category);
    formData.append('is_available', 'true');
    formData.append('is_featured', item.is_featured ? 'true' : 'false');

    const imagePath = path.join(__dirname, 'assets', item.imageFile);
    if (fs.existsSync(imagePath)) {
      const buffer = fs.readFileSync(imagePath);
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      formData.append('image', blob, item.imageFile);
    }

    const insertRes = await fetch(`${PB_URL}/api/collections/products/records`, {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error(`Gagal insert produk ${item.name}: ${insertRes.status} ${errText}`);
    } else {
      const created = await insertRes.json();
      console.log(`[setup-db] Berhasil menambahkan: ${created.name} (${created.category} - Rp${created.price})`);
    }
  }

  console.log('[setup-db] Selesai sinkronisasi 11 varian parfum Sumber Wangi!');
}

run().catch((err) => {
  console.error('[setup-db] Error:', err);
  process.exit(1);
});
