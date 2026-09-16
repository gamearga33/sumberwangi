import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Tentang Kami — CV Sumber Wangi Madiun Group',
  description:
    'Profil CV Sumber Wangi Madiun Group — dedikasi kami dalam menghadirkan wewangian artisanal berkualitas tinggi dengan bibit konsentrat murni.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f2f0ea] py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 space-y-20">
        {/* Header Hero */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo Sumber Wangi"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block">
              CV SUMBER WANGI MADIUN GROUP
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#f2f0ea] leading-tight">
            Seni meracik wewangian dengan ketulusan dan ketahanan abadi.
          </h1>

          <p className="text-base sm:text-lg text-[#a3a099] leading-relaxed max-w-2xl pt-2">
            CV Sumber Wangi Madiun Group didirikan untuk menghadirkan wewangian murni berkarakter mewah
            dengan ketahanan aroma luar biasa tanpa biaya markup label berlebih.
          </p>
        </div>

        {/* Editorial Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4 text-xs sm:text-sm text-[#c4c1b9] leading-relaxed">
            <h2 className="text-lg font-semibold tracking-tight text-[#f2f0ea]">
              Bahan Baku & Karakter Aroma
            </h2>
            <p className="text-[#a3a099]">
              Kekayaan alam Nusantara menawarkan inspirasi tak terbatas—dari kehangatan nilam
              dan kayu gaharu pedalaman hingga kesegaran kelopak melati dan sitrun tropis.
            </p>
            <p className="text-[#a3a099]">
              Kami memilih hanya bibit wewangian murni berkonsentrasi tinggi. Setiap batch
              diracik dalam konsentrasi Eau De Parfum yang presisi menggunakan pelarut food-grade
              agar ramah di kulit sensitif dan tidak meninggalkan noda pada pakaian.
            </p>
            <p className="text-[#a3a099]">
              Hasilnya adalah aroma berkelas yang berlapis indah dari top hingga base notes,
              serta memiliki daya tahan konsisten 12 hingga 14 jam lebih.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#141414] border border-[#262420]">
              <Image
                src="/images/products/oud-royale.jpg"
                alt="Sumber Wangi Perfumery"
                fill
                className="object-cover opacity-95"
              />
            </div>
          </div>
        </div>

        {/* 3 Principles */}
        <div className="border-t border-[#262420] pt-12 space-y-8">
          <h2 className="text-xl font-semibold tracking-tight text-[#f2f0ea]">
            Prinsip Mutu Kami
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-medium">01</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Konsentrat Murni</h3>
              <p className="text-xs text-[#a3a099] leading-relaxed">
                Formula Eau De Parfum murni tanpa pengencer berlebih atau zat aditif berbahaya.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-medium">02</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Daya Tahan 14+ Jam</h3>
              <p className="text-xs text-[#a3a099] leading-relaxed">
                Ketahanan aroma yang telah teruji untuk aktivitas di iklim tropis Indonesia.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs uppercase tracking-wider text-[#d4af37] block font-medium">03</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Pelayanan Bersahabat</h3>
              <p className="text-xs text-[#a3a099] leading-relaxed">
                Pemesanan dan konsultasi aroma personal langsung via WhatsApp dengan nomor 0813-3322-6161.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-[#262420] pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#f2f0ea]">
              Temukan aroma yang sesuai dengan Anda
            </h3>
            <p className="text-xs text-[#a3a099] mt-1">
              Buka katalog kami atau diskusikan aroma favorit Anda bersama kami.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 bg-[#d4af37] px-5 py-3 text-xs uppercase tracking-wider font-semibold text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
            >
              <span>Lihat Katalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#d4af37] hover:text-[#e8c96c] transition-colors"
            >
              <span>WhatsApp (0813-3322-6161)</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
