import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#262420] bg-[#0a0a0a] text-[#f2f0ea]">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Info with Logo */}
          <div className="space-y-4 md:col-span-6">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Logo Sumber Wangi Madiun Group"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-semibold tracking-[0.22em] text-[#f2f0ea] uppercase">
                  CV SUMBER WANGI
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#d4af37] uppercase font-medium">
                  MADIUN GROUP
                </span>
              </div>
            </div>

            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#a3a099]">
              Rumah produksi wewangian artisanal Nusantara. Diformulasikan dari konsentrat
              bibit murni dengan ketahanan 12 hingga 14+ jam, menghadirkan keharuman
              berkelas dan nyaman di kulit.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:col-span-3">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] block font-medium">
              Navigasi
            </span>
            <ul className="space-y-2 text-xs uppercase tracking-wider">
              <li>
                <Link href="/" className="text-[#a3a099] hover:text-[#d4af37] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="text-[#a3a099] hover:text-[#d4af37] transition-colors">
                  Katalog Parfum
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-[#a3a099] hover:text-[#d4af37] transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Services */}
          <div className="space-y-3 md:col-span-3">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] block font-medium">
              Layanan Pesanan
            </span>
            <ul className="space-y-2 text-xs text-[#a3a099]">
              <li>
                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#d4af37] hover:text-[#e8c96c] transition-colors uppercase tracking-wider"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp: 0813-3322-6161</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>Pembayaran praktis via QRIS</li>
              <li>Pengiriman aman ke seluruh Nusantara</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#262420] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e6b63]">
          <span>&copy; {currentYear} CV Sumber Wangi Madiun Group. All rights reserved.</span>
          <span className="tracking-wide text-[11px] text-[#d4af37]">Eau De Parfum Artisanal</span>
        </div>
      </div>
    </footer>
  );
};
