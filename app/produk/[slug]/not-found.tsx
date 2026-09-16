import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-6">
        <Sparkles className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
        404 — Tidak Ditemukan
      </span>

      <h1 className="mt-2 font-serif text-3xl font-extrabold text-stone-900 sm:text-4xl dark:text-white">
        Parfum Tidak Ditemukan
      </h1>

      <p className="mt-3 max-w-md text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
        Maaf, varian parfum yang Anda cari mungkin telah berganti nama, tidak lagi tersedia,
        atau tautan yang Anda akses kurang tepat.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/produk"
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs font-semibold text-white transition hover:bg-amber-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Katalog Parfum</span>
        </Link>

        <a
          href={getWhatsAppConsultationUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-xs font-semibold text-stone-800 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          <MessageCircle className="h-4 w-4 text-emerald-600" />
          <span>Tanya Admin via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
