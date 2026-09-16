import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Tentang Kami — Sumber Wangi',
  description:
    'Mengenal lebih dekat Sumber Wangi, dedikasi kami dalam menghadirkan wewangian artisanal berkualitas dengan konsentrasi tinggi.',
};

export default function TentangPage() {
  return (
    <div className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 space-y-20">
        {/* Header Hero */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.22em] text-[#706f6a] block">
            Tentang Kami
          </span>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#141413] leading-tight">
            Seni meracik wewangian dengan ketulusan dan ketahanan.
          </h1>
          <p className="text-base sm:text-lg text-[#706f6a] leading-relaxed max-w-2xl pt-2">
            Sumber Wangi didirikan untuk menghadirkan wewangian murni berkarakter tanpa
            markup label mewah yang berlebihan.
          </p>
        </div>

        {/* Editorial Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4 text-xs sm:text-sm text-[#141413] leading-relaxed">
            <h2 className="text-lg font-semibold tracking-tight">
              Bahan Baku & Karakter Aroma
            </h2>
            <p className="text-[#706f6a]">
              Kekayaan alam Nusantara menawarkan inspirasi tak terbatas—dari kehangatan nilam
              dan kayu gaharu pedalaman hingga kesegaran kelopak melati dan sitrun tropis.
            </p>
            <p className="text-[#706f6a]">
              Kami memilih hanya bibit wewangian murni berkonsentrasi tinggi. Setiap batch
              diracik dalam rasio Eau De Parfum yang tepat menggunakan pelarut berkualitas food-grade
              agar nyaman di kulit sensitif dan tidak meninggalkan noda pada pakaian.
            </p>
            <p className="text-[#706f6a]">
              Hasilnya adalah aroma yang bersih, berlapis indah dari top hingga base notes,
              serta memiliki daya tahan 12 hingga 14 jam lebih.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#f4f3ef] border border-[#e8e6df]">
              <Image
                src="/images/products/oud-royale.jpg"
                alt="Sumber Wangi Studio"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3 Principles */}
        <div className="border-t border-[#e8e6df] pt-12 space-y-8">
          <h2 className="text-xl font-semibold tracking-tight text-[#141413]">
            Prinsip Kami
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs uppercase tracking-wider text-[#706f6a] block">01</span>
              <h3 className="text-sm font-semibold text-[#141413]">Konsentrat Murni</h3>
              <p className="text-xs text-[#706f6a] leading-relaxed">
                Formula Eau De Parfum tanpa pengencer minyak berbahaya atau zat aditif murah.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs uppercase tracking-wider text-[#706f6a] block">02</span>
              <h3 className="text-sm font-semibold text-[#141413]">Daya Tahan Nyata</h3>
              <p className="text-xs text-[#706f6a] leading-relaxed">
                Ketahanan aroma 12 hingga 14+ jam yang telah teruji untuk iklim tropis.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs uppercase tracking-wider text-[#706f6a] block">03</span>
              <h3 className="text-sm font-semibold text-[#141413]">Layanan Bersahabat</h3>
              <p className="text-xs text-[#706f6a] leading-relaxed">
                Pemesanan dan konsultasi aroma dilayani langsung via WhatsApp dengan pembayaran QRIS.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-[#e8e6df] pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#141413]">
              Tertarik mencoba varian aroma kami?
            </h3>
            <p className="text-xs text-[#706f6a] mt-1">
              Buka katalog atau hubungi kami langsung di WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 bg-[#141413] px-5 py-3 text-xs uppercase tracking-wider text-white hover:bg-[#282826] transition-colors"
            >
              <span>Lihat Katalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#141413] hover:opacity-60 transition-opacity"
            >
              <span>WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
