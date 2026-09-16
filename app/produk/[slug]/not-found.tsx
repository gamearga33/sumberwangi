import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center space-y-4">
      <span className="text-xs uppercase tracking-[0.22em] text-[#706f6a]">
        404 — Produk Tidak Ditemukan
      </span>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
        Varian parfum tidak ditemukan
      </h1>

      <p className="max-w-md text-xs sm:text-sm text-[#706f6a] leading-relaxed">
        Parfum yang Anda cari mungkin tidak lagi tersedia atau alamat URL kurang sesuai.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/produk"
          className="inline-flex items-center gap-1.5 bg-[#141413] px-5 py-3 text-xs uppercase tracking-wider text-[#fbfbf9] hover:bg-[#2c2b28] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>

        <a
          href={getWhatsAppConsultationUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-[#141413] px-5 py-3 text-xs uppercase tracking-wider text-[#141413] hover:bg-[#141413] hover:text-white transition-colors"
        >
          <span>Tanya via WhatsApp</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
