import { describe, expect, it } from 'vitest';
import { getProductImageUrl } from './products';

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
