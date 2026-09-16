import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center space-y-4 bg-[#0d0d0d] text-[#f2f0ea]">
      <span className="text-xs uppercase tracking-[0.22em] text-[#d4af37]">
        404 — Tidak Ditemukan
      </span>

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f2f0ea]">
        Varian parfum tidak ditemukan
      </h1>

      <p className="max-w-md text-xs sm:text-sm text-[#85837b] leading-relaxed">
        Parfum yang Anda cari mungkin tidak lagi tersedia atau tautan yang Anda tuju kurang tepat.
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/produk"
          className="inline-flex items-center gap-1.5 bg-[#d4af37] px-5 py-3 text-xs uppercase tracking-wider font-semibold text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Katalog</span>
        </Link>

        <a
          href={getWhatsAppConsultationUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-[#d4af37] px-5 py-3 text-xs uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0d0d] transition-colors"
        >
          <span>Tanya via WhatsApp</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
