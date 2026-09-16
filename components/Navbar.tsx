'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/produk' },
    { name: 'Tentang', href: '/tentang' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e8e6df] bg-[#fbfbf9]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
        {/* Brand Logo - Minimalist Clean Typography */}
        <Link
          href="/"
          className="flex flex-col tracking-[0.22em] text-[#141413] hover:opacity-80 transition-opacity"
        >
          <span className="text-sm sm:text-base font-semibold uppercase">
            SUMBER WANGI
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs uppercase tracking-widest transition-colors ${
                isActive(link.href)
                  ? 'text-[#141413] font-semibold border-b border-[#141413] pb-0.5'
                  : 'text-[#706f6a] hover:text-[#141413]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Action */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={getWhatsAppConsultationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#141413] hover:opacity-70 transition-opacity"
          >
            <span>WhatsApp</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 text-[#141413] hover:opacity-70 focus:outline-none"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-b border-[#e8e6df] bg-[#fbfbf9] px-6 py-6 md:hidden">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm tracking-wider uppercase transition-colors ${
                  isActive(link.href)
                    ? 'font-semibold text-[#141413]'
                    : 'text-[#706f6a] hover:text-[#141413]'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#e8e6df]">
              <a
                href={getWhatsAppConsultationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#141413]"
              >
                <span>Kontak WhatsApp</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
