import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WA_NUMBER,
  generateWhatsAppMessage,
  getWhatsAppConsultationUrl,
  getWhatsAppOrderUrl,
  normalizeWhatsAppNumber,
} from './whatsapp';

describe('normalizeWhatsAppNumber', () => {
  it('harus mengembalikan default jika parameter kosong atau tidak valid', () => {
    expect(normalizeWhatsAppNumber('')).toBe(DEFAULT_WA_NUMBER);
    expect(normalizeWhatsAppNumber(undefined)).toBe(DEFAULT_WA_NUMBER);
  });

  it('harus mengubah nomor lokal 0812... menjadi 62812...', () => {
    expect(normalizeWhatsAppNumber('081234567890')).toBe('6281234567890');
  });

  it('harus membersihkan karakter spesial seperti spasi, plus, dan tanda hubung', () => {
    expect(normalizeWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('0812 3456 7890')).toBe('6281234567890');
    expect(normalizeWhatsAppNumber('(0812) 3456-7890')).toBe('6281234567890');
  });

  it('harus mempertahankan format 62 jika sudah benar', () => {
    expect(normalizeWhatsAppNumber('6289876543210')).toBe('6289876543210');
  });
});

describe('generateWhatsAppMessage', () => {
  it('harus menghasilkan teks pesan dengan format yang sesuai spec', () => {
    const msg = generateWhatsAppMessage('Sumber Wangi - Oud Royale', 185000);
    expect(msg).toBe(
      'Halo Sumber Wangi, saya tertarik dengan produk "Sumber Wangi - Oud Royale" (Rp185.000). Apakah masih tersedia?'
    );
  });

  it('harus menangani harga 0 atau bulat dengan tepat', () => {
    const msg = generateWhatsAppMessage('Parfum Sample', 0);
    expect(msg).toBe(
      'Halo Sumber Wangi, saya tertarik dengan produk "Parfum Sample" (Rp0). Apakah masih tersedia?'
    );
  });
});

describe('getWhatsAppOrderUrl', () => {
  it('harus menghasilkan URL wa.me yang di-encode dengan benar', () => {
    const url = getWhatsAppOrderUrl({
      productName: 'Sumber Wangi - Oud Royale',
      price: 185000,
      customNumber: '081234567890',
    });

    expect(url).toContain('https://wa.me/6281234567890?text=');
    expect(url).toContain(encodeURIComponent('Sumber Wangi - Oud Royale'));
    expect(url).toContain(encodeURIComponent('Rp185.000'));
  });

  it('harus meng-encode karakter spesial seperti kutip, dan, dan persen', () => {
    const url = getWhatsAppOrderUrl({
      productName: 'Parfum "Eksotis" & Segar (50% Pure)',
      price: 250000,
      customNumber: '6281234567890',
    });

    // Harus valid URL tanpa karakter mentah terlarang
    expect(url).not.toContain('"');
    expect(url).not.toContain(' ');
    expect(url).toContain('https://wa.me/6281234567890?text=');
  });
});

describe('getWhatsAppConsultationUrl', () => {
  it('harus menghasilkan link konsultasi umum', () => {
    const url = getWhatsAppConsultationUrl('081234567890');
    expect(url).toContain('https://wa.me/6281234567890?text=');
    expect(url).toContain(encodeURIComponent('konsultasi'));
  });
});
