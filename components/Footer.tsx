import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, MapPin, Mail, ShieldCheck, Clock, Award } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-100 text-stone-700 transition-colors dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300">
      {/* Keunggulan Bar */}
      <div className="border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Bibit Parfum Berkualitas
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Konsentrasi Eau De Parfum murni & racikan higienis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Tahan 12 - 14+ Jam
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Jejak aroma elegan yang konsisten sepanjang hari
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                  Aman & Nyaman di Kulit
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  Tidak berbekas di pakaian & tidak membuat iritasi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-wider text-stone-900 dark:text-stone-100">
                SUMBER WANGI
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Sumber Wangi adalah brand wewangian artisanal lokal yang memadukan kehangatan
              aroma rempah Nusantara dengan keanggunan seni perfumery modern. Menghadirkan
              keharuman yang khas, berkarisma, dan abadi.
            </p>
            <div className="pt-2">
              <a
                href={getWhatsAppConsultationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Pesan Cepat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/produk"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  Katalog Lengkap
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-amber-600" />
                <span>Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>WhatsApp Customer Service</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-amber-600" />
                <span>halo@sumberwangi.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-8 sm:flex-row dark:border-stone-800/80">
          <p className="text-xs text-stone-500">
            &copy; {currentYear} Sumber Wangi. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex items-center gap-4 text-xs text-stone-500">
            <span>Pembayaran via QRIS saat konfirmasi WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
