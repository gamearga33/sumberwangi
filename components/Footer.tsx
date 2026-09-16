import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e8e6df] bg-[#fbfbf9] text-[#141413]">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-6">
            <span className="text-sm font-semibold tracking-[0.22em] uppercase text-[#141413]">
              SUMBER WANGI
            </span>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#706f6a]">
              Artisanal perfumery dari Nusantara. Diformulasikan dengan konsentrat
              bibit wewangian murni untuk menghadirkan aroma berkarakter dengan daya
              tahan tinggi.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:col-span-3">
            <span className="text-xs uppercase tracking-widest text-[#706f6a] block">
              Menu
            </span>
            <ul className="space-y-2 text-xs uppercase tracking-wider">
              <li>
                <Link href="/" className="hover:opacity-60 transition-opacity">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:opacity-60 transition-opacity">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:opacity-60 transition-opacity">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 md:col-span-3">
            <span className="text-xs uppercase tracking-widest text-[#706f6a] block">
              Layanan
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 uppercase tracking-wider hover:opacity-60 transition-opacity"
                >
                  <span>Pesan via WhatsApp</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li className="text-[#706f6a]">Pembayaran QRIS saat pemesanan</li>
              <li className="text-[#706f6a]">Pengiriman ke seluruh Indonesia</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#e8e6df] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#706f6a]">
          <span>&copy; {currentYear} Sumber Wangi. Hak cipta dilindungi.</span>
          <span className="tracking-wide text-[11px]">Eau De Parfum Artisanal</span>
        </div>
      </div>
    </footer>
  );
};
