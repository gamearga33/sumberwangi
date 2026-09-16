'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/produk' },
    { name: 'Tentang Kami', href: '/tentang' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Sembunyikan Navbar di seluruh halaman admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262420] bg-[#0d0d0d]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-18">
        {/* Brand Logo - Official User Logo Image */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <div className="relative h-11 w-11 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Logo Sumber Wangi Madiun Group"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold tracking-[0.22em] text-[#f2f0ea] uppercase">
              SUMBER WANGI
            </span>
            <span className="text-[9px] tracking-[0.28em] text-[#d4af37] uppercase font-medium">
              Madiun Group
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                isActive(link.href)
                  ? 'text-[#d4af37] font-semibold border-b border-[#d4af37] pb-0.5'
                  : 'text-[#9c9991] hover:text-[#d4af37]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop WhatsApp Action */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={getWhatsAppConsultationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#d4af37]/70 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0d0d] transition-all duration-200"
          >
            <span>WhatsApp</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-[#f2f0ea] hover:text-[#d4af37] focus:outline-none"
            aria-expanded={isOpen}
            aria-label="Menu navigasi"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-[#262420] bg-[#121212] px-6 py-6 md:hidden">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  isActive(link.href)
                    ? 'font-semibold text-[#d4af37]'
                    : 'text-[#a3a099] hover:text-[#f2f0ea]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#262420]">
              <a
                href={getWhatsAppConsultationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 border border-[#d4af37] bg-[#d4af37]/10 px-4 py-3 text-xs font-medium uppercase tracking-wider text-[#d4af37]"
              >
                <span>Chat WhatsApp (0813-3322-6161)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
