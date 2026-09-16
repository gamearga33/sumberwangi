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
    console.log(`[setup-db] Koleksi 'products' sudah ada (ID: ${productsCollection.id}), memperbarui rules...`);
    await fetch(`${PB_URL}/api/collections/${productsCollection.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listRule: '',
        viewRule: '',
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
      }),
    });
  }

  // 3. Cek apakah sudah ada data produk
  const listRes = await fetch(`${PB_URL}/api/collections/products/records?perPage=1`, {
    headers: { Authorization: token },
  });
  const listData = await listRes.json();

  if (listData.totalItems > 0) {
    console.log(`[setup-db] Sudah ada ${listData.totalItems} produk di database. Skip seed.`);
    return;
  }

  console.log('[setup-db] Melakukan seed data produk awal Sumber Wangi...');

  const sampleProducts = [
    {
      name: 'Sumber Wangi - Oud Royale',
      slug: 'oud-royale',
      description:
        '<p><strong>Oud Royale</strong> adalah mahakarya wewangian mewah persembahan Sumber Wangi. Memadukan keagungan kayu gaharu (oud) Nusantara berkualitas tinggi dengan kehangatan amber murni dan sentuhan manis mawar Damaskus.</p><p>Memberikan aura berkarisma, misterius, dan meninggalkan jejak keharuman elegan yang bertahan hingga lebih dari 14 jam. Pilihan sempurna untuk perayaan istimewa dan kehadiran berkesan di setiap pertemuan penting.</p><p><strong>Fragrance Notes:</strong><br/>• Top: Damask Rose, Saffron, Fresh Bergamot<br/>• Middle: Cambodian Agarwood (Oud), Indonesian Patchouli<br/>• Base: Warm Amber, Madagascar Vanilla, Sandalwood</p>',
      price: 185000,
      size_ml: 50,
      category: 'Unisex',
      is_available: true,
      imageFile: 'oud-royale.jpg',
    },
    {
      name: 'Sumber Wangi - Jasmine Sensual',
      slug: 'jasmine-sensual',
      description:
        '<p><strong>Jasmine Sensual</strong> menghadirkan pesona anggun keharuman melati putih Indonesia pilihan. Dikombinasikan dengan sentuhan kesegaran citrus bergamot di awal dan diakhiri dengan kehangatan lembut white musk yang memikat.</p><p>Karakter aromanya menenangkan, feminin, dan memancarkan kecantikan abadi tanpa aroma yang berlebihan. Sangat ideal untuk penggunaan harian di kantor, kencan romantis, hingga santai sore.</p><p><strong>Fragrance Notes:</strong><br/>• Top: Italian Bergamot, Dewy Green Leaves<br/>• Middle: Indonesian Sambac Jasmine, Royal Tuberose<br/>• Base: White Musk, Soft Cedarwood, Tonka Bean</p>',
      price: 165000,
      size_ml: 50,
      category: 'Wanita',
      is_available: true,
      imageFile: 'jasmine-sensual.jpg',
    },
    {
      name: 'Sumber Wangi - Citrus Bloom',
      slug: 'citrus-bloom',
      description:
        '<p><strong>Citrus Bloom</strong> adalah hembusan energi segar yang membangkitkan semangat. Perpaduan harmonis antara segarnya jeruk mandarin tropis, lemon zest, dan daun teh hijau pegunungan yang menyejukkan.</p><p>Dirancang khusus untuk menemani gaya hidup aktif di iklim tropis, memberikan sensasi dingin yang menyegarkan sejak semprotan pertama dan menjaga tubuh tetap segar wangi seharian.</p><p><strong>Fragrance Notes:</strong><br/>• Top: Mandarin Orange, Sicilian Lemon, Crisp Apple<br/>• Middle: Green Tea Leaf, Orange Blossom, Neroli<br/>• Base: Clean Vetiver, Soft White Amber</p>',
      price: 145000,
      size_ml: 30,
      category: 'Unisex',
      is_available: true,
      imageFile: 'citrus-bloom.jpg',
    },
    {
      name: 'Sumber Wangi - Midnight Gentleman',
      slug: 'midnight-gentleman',
      description:
        '<p><strong>Midnight Gentleman</strong> memancarkan wibawa dan maskulinitas sejati. Dibuka dengan kesegaran pedas lada hitam dan kapulaga, disusul kehangatan daun tembakau cerutu pilihan dan aroma kulit (leather) yang memikat.</p><p>Aroma pekat yang berkelas ini ditutup dengan keanggunan kayu cedar dan dark patchouli, menjadikannya senjata andalan pria percaya diri untuk malam hari yang berkesan.</p><p><strong>Fragrance Notes:</strong><br/>• Top: Black Pepper, Cardamom, Pink Peppercorn<br/>• Middle: Tobacco Leaf, Aged Leather, Iris<br/>• Base: Virginia Cedarwood, Dark Amber, Patchouli</p>',
      price: 195000,
      size_ml: 50,
      category: 'Pria',
      is_available: true,
      imageFile: 'midnight-gentleman.jpg',
    },
  ];

  for (const item of sampleProducts) {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('slug', item.slug);
    formData.append('description', item.description);
    formData.append('price', String(item.price));
    formData.append('size_ml', String(item.size_ml));
    formData.append('category', item.category);
    formData.append('is_available', String(item.is_available));

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
      console.log(`[setup-db] Produk berhasil ditambahkan: ${created.name} (id: ${created.id}, slug: ${created.slug})`);
    }
  }

  console.log('[setup-db] Selesai setup dan seed produk Sumber Wangi!');
}

run().catch((err) => {
  console.error('[setup-db] Error:', err);
  process.exit(1);
});
