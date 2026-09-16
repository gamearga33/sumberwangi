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

  it('harus mengubah nomor lokal 081333226161 menjadi 6281333226161', () => {
    expect(normalizeWhatsAppNumber('081333226161')).toBe('6281333226161');
  });

  it('harus membersihkan karakter spesial seperti spasi, plus, dan tanda hubung', () => {
    expect(normalizeWhatsAppNumber('+62 813-3322-6161')).toBe('6281333226161');
    expect(normalizeWhatsAppNumber('0813 3322 6161')).toBe('6281333226161');
    expect(normalizeWhatsAppNumber('(0813) 3322-6161')).toBe('6281333226161');
  });

  it('harus mempertahankan format 62 jika sudah benar', () => {
    expect(normalizeWhatsAppNumber('6281333226161')).toBe('6281333226161');
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
  it('harus menghasilkan URL wa.me yang di-encode dengan benar dengan nomor owner', () => {
    const url = getWhatsAppOrderUrl({
      productName: 'Sumber Wangi - Oud Royale',
      price: 185000,
      customNumber: '081333226161',
    });

    expect(url).toContain('https://wa.me/6281333226161?text=');
    expect(url).toContain(encodeURIComponent('Sumber Wangi - Oud Royale'));
    expect(url).toContain(encodeURIComponent('Rp185.000'));
  });

  it('harus meng-encode karakter spesial seperti kutip, dan, dan persen', () => {
    const url = getWhatsAppOrderUrl({
      productName: 'Parfum "Eksotis" & Segar (50% Pure)',
      price: 250000,
      customNumber: '6281333226161',
    });

    expect(url).not.toContain('"');
    expect(url).not.toContain(' ');
    expect(url).toContain('https://wa.me/6281333226161?text=');
  });
});

describe('getWhatsAppConsultationUrl', () => {
  it('harus menghasilkan link konsultasi umum dengan nomor owner', () => {
    const url = getWhatsAppConsultationUrl('081333226161');
    expect(url).toContain('https://wa.me/6281333226161?text=');
    expect(url).toContain(encodeURIComponent('konsultasi'));
  });
});
