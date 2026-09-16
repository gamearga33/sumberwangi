import { describe, expect, it } from 'vitest';
import { formatRupiah, generateSlug, validateProductData } from './utils';

describe('formatRupiah', () => {
  it('harus memformat angka ribuan dengan titik pemisah', () => {
    expect(formatRupiah(185000)).toBe('Rp185.000');
    expect(formatRupiah(1500000)).toBe('Rp1.500.000');
    expect(formatRupiah(500)).toBe('Rp500');
    expect(formatRupiah(0)).toBe('Rp0');
  });

  it('harus menangani angka desimal dengan pembulatan rapi', () => {
    expect(formatRupiah(149999.8)).toBe('Rp150.000');
  });

  it('harus menangani nilai tidak valid', () => {
    expect(formatRupiah(NaN)).toBe('Rp0');
    // @ts-expect-error intentional null test for runtime safety
    expect(formatRupiah(null)).toBe('Rp0');
  });
});

describe('generateSlug', () => {
  it('harus mengubah nama produk menjadi format slug URL aman', () => {
    expect(generateSlug('Sumber Wangi - Oud Royale')).toBe('sumber-wangi-oud-royale');
    expect(generateSlug('Jasmine & White Musk Sensual!')).toBe('jasmine-white-musk-sensual');
    expect(generateSlug('Parfum Élite 2026')).toBe('parfum-elite-2026');
  });

  it('harus menghilangkan spasi ganda dan tanda hubung beruntun', () => {
    expect(generateSlug('  Vanilla   Velvet --- Luxury  ')).toBe('vanilla-velvet-luxury');
  });

  it('harus mengembalikan string kosong untuk input kosong', () => {
    expect(generateSlug('')).toBe('');
  });
});

describe('validateProductData', () => {
  it('harus meloloskan data produk yang lengkap dan valid', () => {
    const validData = {
      name: 'Sumber Wangi - Oud Royale',
      slug: 'oud-royale',
      description: 'Deskripsi lengkap parfum oud nusantara.',
      price: 185000,
      size_ml: 50,
      is_available: true,
      image: new File(['mock'], 'oud.jpg', { type: 'image/jpeg' }),
    };

    const result = validateProductData(validData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('harus mendeteksi nama dan deskripsi kosong', () => {
    const result = validateProductData({
      name: '',
      slug: 'oud-royale',
      description: '   ',
      price: 100000,
      image: new File(['mock'], 'oud.jpg', { type: 'image/jpeg' }),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.description).toBeDefined();
  });

  it('harus menolak harga negatif atau 0', () => {
    const result = validateProductData({
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: -50000,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBe('Harga produk harus lebih besar dari 0');
  });

  it('harus memvalidasi format slug URL yang tidak valid', () => {
    const result = validateProductData({
      name: 'Parfum Keren',
      slug: 'Parfum Keren!', // invalid: ada spasi & tanda seru & uppercase
      description: 'Deskripsi parfum',
      price: 100000,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.slug).toBeDefined();
  });

  it('harus menolak harga desimal atau bukan bilangan bulat', () => {
    const result = validateProductData({
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: 20000.5,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.price).toBe('Harga produk harus berupa bilangan bulat (tanpa desimal)');
  });

  it('harus memvalidasi ukuran botol size_ml sebagai bilangan bulat positif jika diisi', () => {
    const invalidDecimal = validateProductData({
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: 20000,
      size_ml: 35.5,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });
    expect(invalidDecimal.isValid).toBe(false);
    expect(invalidDecimal.errors.size_ml).toBe('Ukuran botol harus berupa angka bulat positif dalam ml');

    const invalidNegative = validateProductData({
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: 20000,
      size_ml: -10,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });
    expect(invalidNegative.isValid).toBe(false);

    const validSize = validateProductData({
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: 20000,
      size_ml: 35,
      image: new File(['mock'], 'test.jpg', { type: 'image/jpeg' }),
    });
    expect(validSize.isValid).toBe(true);
  });

  it('harus mewajibkan gambar saat create baru, tetapi opsional saat update', () => {
    const dataWithoutImage = {
      name: 'Parfum Keren',
      slug: 'parfum-keren',
      description: 'Deskripsi parfum',
      price: 100000,
    };

    const createResult = validateProductData(dataWithoutImage, false);
    expect(createResult.isValid).toBe(false);
    expect(createResult.errors.image).toBeDefined();

    const updateResult = validateProductData(dataWithoutImage, true);
    expect(updateResult.isValid).toBe(true);
  });
});
