import { FormValidationResult, ProductFormData } from './types';

/**
 * Format angka ke format Rupiah Indonesia (contoh: Rp185.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp0';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}

/**
 * Buat slug URL-friendly dari teks
 * Mengubah ke lowercase, menghapus karakter khusus, mengganti spasi/garis bawah dengan tanda hubung
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Normalisasi unicode karakter beraksen
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter non-alphanumeric selain spasi dan dash
    .replace(/[\s_]+/g, '-') // Ganti spasi/underscore dengan -
    .replace(/-+/g, '-') // Hilangkan multiple dash berulang
    .replace(/^-+|-+$/g, ''); // Trim dash di awal dan akhir
}

/**
 * Validasi form data produk
 */
export function validateProductData(
  data: Partial<ProductFormData>,
  isUpdate: boolean = false
): FormValidationResult {
  const errors: Record<string, string> = {};

  // Validasi Nama
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Nama produk wajib diisi';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Nama produk minimal 3 karakter';
  }

  // Validasi Slug
  if (!data.slug || data.slug.trim().length === 0) {
    errors.slug = 'Slug URL wajib diisi';
  } else {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(data.slug.trim())) {
      errors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)';
    }
  }

  // Validasi Deskripsi
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Deskripsi produk wajib diisi';
  }

  // Validasi Harga (wajib berupa angka bulat positif sesuai kolom integer Postgres)
  if (data.price === undefined || data.price === null || isNaN(Number(data.price))) {
    errors.price = 'Harga produk wajib diisi angka';
  } else if (Number(data.price) <= 0) {
    errors.price = 'Harga produk harus lebih besar dari 0';
  } else if (!Number.isInteger(Number(data.price))) {
    errors.price = 'Harga produk harus berupa bilangan bulat (tanpa desimal)';
  }

  // Validasi Ukuran (opsional, tapi jika diisi harus angka bulat positif)
  if (data.size_ml !== undefined && data.size_ml !== null && String(data.size_ml).trim() !== '') {
    if (isNaN(Number(data.size_ml)) || Number(data.size_ml) <= 0 || !Number.isInteger(Number(data.size_ml))) {
      errors.size_ml = 'Ukuran botol harus berupa angka bulat positif dalam ml';
    }
  }

  // Validasi Gambar utama (wajib saat create baru)
  const hasImage = Boolean(data.image || data.image_file || data.image_url);
  if (!isUpdate && !hasImage) {
    errors.image = 'Gambar utama produk wajib diunggah';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
