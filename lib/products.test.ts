import { describe, expect, it } from 'vitest';
import { getProductImageUrl } from './products';
import { Product } from './types';

describe('getProductImageUrl', () => {
  it('harus mengembalikan URL eksternal lengkap secara langsung', () => {
    const url = 'https://xyz.supabase.co/storage/v1/object/public/product-images/romanwish.jpg';
    expect(getProductImageUrl({ image_url: url, slug: 'romanwish' })).toBe(url);
  });

  it('harus mengembalikan path relatif jika dimulai dengan garis miring', () => {
    const localUrl = '/images/products/romanwish.jpg';
    expect(getProductImageUrl({ image_url: localUrl, slug: 'romanwish' })).toBe(localUrl);
  });

  it('harus fallback ke /images/products/{slug}.jpg jika image_url tidak valid atau kosong', () => {
    expect(getProductImageUrl({ image_url: '', slug: 'bulgari-aqua' })).toBe(
      '/images/products/bulgari-aqua.jpg'
    );
    expect(getProductImageUrl({ slug: 'nagita' })).toBe('/images/products/nagita.jpg');
  });

  it('harus fallback ke /images/logo.png jika objek produk kosong atau null', () => {
    expect(getProductImageUrl(null)).toBe('/images/logo.png');
    expect(getProductImageUrl(undefined)).toBe('/images/logo.png');
    expect(getProductImageUrl({})).toBe('/images/logo.png');
  });
});

describe('isSupabaseConfigured', () => {
  it('harus mendeteksi jika URL atau Anon Key masih berupa placeholder atau kosong', async () => {
    const { isSupabaseConfigured } = await import('./products');
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    try {
      // 1. Kedua env kosong
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      expect(isSupabaseConfigured()).toBe(false);

      // 2. URL placeholder
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'real-anon-key';
      expect(isSupabaseConfigured()).toBe(false);

      // 3. Anon key placeholder
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://real-project.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder-anon-key';
      expect(isSupabaseConfigured()).toBe(false);

      // 4. Keduanya terkonfigurasi dengan benar
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://real-project.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJh...real-key';
      expect(isSupabaseConfigured()).toBe(true);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });
});

describe('filterProductsByCategory', () => {
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Romanwish',
      slug: 'romanwish',
      category: 'Wanita',
      price: 20000,
      size_ml: 35,
      description: 'Manis',
      image_url: '/img/1.jpg',
      is_available: true,
      is_featured: true,
      created_at: '2026-09-16T00:00:00Z',
      updated_at: '2026-09-16T00:00:00Z',
    },
    {
      id: '2',
      name: 'Bulgari Aqua',
      slug: 'bulgari-aqua',
      category: 'Pria',
      price: 20000,
      size_ml: 35,
      description: 'Segar',
      image_url: '/img/2.jpg',
      is_available: true,
      is_featured: true,
      created_at: '2026-09-16T00:00:00Z',
      updated_at: '2026-09-16T00:00:00Z',
    },
    {
      id: '3',
      name: 'Vanilla Ice',
      slug: 'vanilla-ice',
      category: 'Unisex',
      price: 20000,
      size_ml: 35,
      description: 'Vanilla',
      image_url: '/img/3.jpg',
      is_available: true,
      is_featured: false,
      created_at: '2026-09-16T00:00:00Z',
      updated_at: '2026-09-16T00:00:00Z',
    },
  ];

  it('harus mengembalikan semua produk jika kategori Semua, kosong, null, atau undefined', async () => {
    const { filterProductsByCategory } = await import('./products');
    expect(filterProductsByCategory(sampleProducts, 'Semua')).toEqual(sampleProducts);
    expect(filterProductsByCategory(sampleProducts, 'semua')).toEqual(sampleProducts);
    expect(filterProductsByCategory(sampleProducts, '')).toEqual(sampleProducts);
    expect(filterProductsByCategory(sampleProducts, null)).toEqual(sampleProducts);
    expect(filterProductsByCategory(sampleProducts, undefined)).toEqual(sampleProducts);
  });

  it('harus menyaring produk secara tepat dan case-insensitive', async () => {
    const { filterProductsByCategory } = await import('./products');
    const pria = filterProductsByCategory(sampleProducts, 'pria');
    expect(pria).toHaveLength(1);
    expect(pria[0].name).toBe('Bulgari Aqua');

    const wanita = filterProductsByCategory(sampleProducts, 'WANITA');
    expect(wanita).toHaveLength(1);
    expect(wanita[0].name).toBe('Romanwish');
  });

  it('harus menangani whitespace pada kategori filter', async () => {
    const { filterProductsByCategory } = await import('./products');
    const unisex = filterProductsByCategory(sampleProducts, '  Unisex  ');
    expect(unisex).toHaveLength(1);
    expect(unisex[0].name).toBe('Vanilla Ice');
  });

  it('harus mengembalikan array kosong jika kategori tidak ada atau tidak cocok', async () => {
    const { filterProductsByCategory } = await import('./products');
    expect(filterProductsByCategory(sampleProducts, 'Anak-anak')).toHaveLength(0);
  });

  it('harus aman jika daftar produk kosong atau bernilai null/undefined', async () => {
    const { filterProductsByCategory } = await import('./products');
    expect(filterProductsByCategory([], 'Pria')).toEqual([]);
    expect(filterProductsByCategory(null, 'Pria')).toEqual([]);
    expect(filterProductsByCategory(undefined, 'Pria')).toEqual([]);
  });
});
