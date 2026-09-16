import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Award, ShieldCheck, HeartHandshake, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Tentang Kami — Sumber Wangi | Seni Wewangian Artisanal Nusantara',
  description:
    'Mengenal lebih dekat Sumber Wangi, dedikasi kami dalam menghadirkan wewangian artisanal berkualitas tinggi dengan bibit murni dan ketahanan aroma luar biasa.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-12 md:py-20 dark:bg-stone-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Kisah & Nilai Kami</span>
          </div>

          <h1 className="font-serif text-4xl font-extrabold text-stone-900 sm:text-5xl dark:text-white leading-tight">
            Menghadirkan Keharuman Nusantara yang Abadi
          </h1>

          <p className="text-base text-stone-600 sm:text-lg dark:text-stone-300 leading-relaxed">
            Sumber Wangi berawal dari sebuah keyakinan sederhana: bahwa wewangian mewah berkelas dunia
            seharusnya bisa dinikmati oleh siapa saja tanpa harus membayar mahal untuk nama label internasional.
          </p>
        </div>

        {/* Story Section dengan Showcase Visual */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4 text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
              Seni Meracik Wewangian
            </h2>
            <p>
              Indonesia adalah salah satu penghasil bahan baku parfum terindah di dunia—dari nilam terbaik di
              Sumatera, kayu gaharu mistis dari pedalaman Kalimantan, hingga melati putih harum dari tanah Jawa.
            </p>
            <p>
              Di Sumber Wangi, kami meracik setiap botol dengan perpaduan kehangatan rempah lokal dan teknik
              perfumery modern. Kami menolak penggunaan bibit oplosan berkualitas rendah. Seluruh racikan kami
              menggunakan konsentrat bibit wewangian murni berstandar tinggi.
            </p>
            <p>
              Hasilnya adalah karakter aroma yang elegan, tidak menusuk hidung (headache-free), serta
              memiliki daya tahan yang konsisten sepanjang hari hingga 14 jam lebih.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-stone-200 shadow-xl dark:border-stone-800">
              <Image
                src="/images/products/oud-royale.jpg"
                alt="Sumber Wangi Perfumery"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                <span className="font-serif font-bold text-amber-300 text-sm block mb-1">
                  100% Konsentrasi Eau De Parfum
                </span>
                Racikan higienis dan aman untuk penggunaan sehari-hari.
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pilar Kualitas */}
        <div className="space-y-8 pt-6">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-stone-900 dark:text-white">
              Komitmen Kualitas Sumber Wangi
            </h2>
            <p className="mt-2 text-xs text-stone-500">Standar yang kami pegang teguh di setiap botol</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                  Bibit Parfum Murni Pilihan
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Kami mengimpor dan menyeleksi bibit konsentrat terbaik yang diformulasikan khusus
                  agar menghasilkan transisi aroma (top, middle, base notes) yang bergradasi sempurna.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                  Longevity 12 - 14+ Jam
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Formulasi Eau De Parfum (EDP) konsentrasi tinggi memastikan keharuman tetap menempel
                  di kulit dan serat pakaian sepanjang hari saat beraktivitas di iklim tropis.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                  Ramah Kulit & Tanpa Noda
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Menggunakan pelarut ethyl alkohol food-grade tanpa pewarna kimia berbahaya,
                  sehingga aman untuk kulit sensitif dan tidak meninggalkan bercak kuning di pakaian putih.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-stone-900 dark:text-white text-base">
                  Layanan WhatsApp yang Bersahabat
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  Kami mengutamakan hubungan personal dengan setiap pelanggan. Anda selalu bisa berdiskusi
                  dan meminta saran aroma yang sesuai dengan gaya hidup dan karakter Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Hubungi Kami */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-700 to-amber-900 p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Siap Menemukan Aroma Khas Anda?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto leading-relaxed">
            Jelajahi katalog lengkap kami atau konsultasikan aroma yang paling sesuai dengan selera Anda langsung bersama kami via WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/produk"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-semibold text-stone-900 transition hover:bg-stone-100"
            >
              <span>Buka Katalog Parfum</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
