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
