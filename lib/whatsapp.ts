import { formatRupiah } from './utils';

export const DEFAULT_WA_NUMBER = '6281333226161';

/**
 * Normalisasi nomor WhatsApp ke format internasional (misal 6281234567890)
 * Menangani input dengan awalan +62, 08, atau spasi/tanda hubung.
 */
export function normalizeWhatsAppNumber(rawNumber?: string): string {
  if (!rawNumber || typeof rawNumber !== 'string') {
    return DEFAULT_WA_NUMBER;
  }

  // Hapus semua karakter non-digit
  let cleaned = rawNumber.replace(/\D/g, '');

  if (!cleaned) {
    return DEFAULT_WA_NUMBER;
  }

  // Jika diawali 08, ubah ke 628
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }

  // Jika belum diawali 62 tapi sudah format 8xxx, tambahkan 62
  if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}

export interface WhatsAppOrderParams {
  productName: string;
  price: number;
  customNumber?: string;
}

/**
 * Format teks pesan pre-filled untuk pemesanan produk via WhatsApp
 * Format sesuai SUMBER_WANGI_SPEC.md:
 * "Halo Sumber Wangi, saya tertarik dengan produk \"{nama_produk}\" ({harga}). Apakah masih tersedia?"
 */
export function generateWhatsAppMessage(productName: string, price: number): string {
  const formattedPrice = formatRupiah(price);
  return `Halo Sumber Wangi, saya tertarik dengan produk "${productName}" (${formattedPrice}). Apakah masih tersedia?`;
}

/**
 * Menghasilkan link wa.me lengkap dengan nomor tujuan dan pesan yang sudah di-encode
 */
export function getWhatsAppOrderUrl({
  productName,
  price,
  customNumber,
}: WhatsAppOrderParams): string {
  const envNumber = process.env.NEXT_PUBLIC_WA_NUMBER;
  const targetNumber = normalizeWhatsAppNumber(customNumber || envNumber);
  const message = generateWhatsAppMessage(productName, price);
  const encodedText = encodeURIComponent(message);

  return `https://wa.me/${targetNumber}?text=${encodedText}`;
}

/**
 * Link WhatsApp untuk konsultasi aroma umum (bukan per produk)
 */
export function getWhatsAppConsultationUrl(customNumber?: string): string {
  const envNumber = process.env.NEXT_PUBLIC_WA_NUMBER;
  const targetNumber = normalizeWhatsAppNumber(customNumber || envNumber);
  const message =
    'Halo Sumber Wangi, saya ingin berkonsultasi mengenai pilihan aroma parfum yang cocok untuk saya.';
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
