import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const revalidate = 60; // ISR revalidate setiap 60 detik

export default async function HomePage() {
  const { data: featuredProducts, error } = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col bg-[#0d0d0d] text-[#f2f0ea]">
      {/* 1. HERO SECTION — Logo Showcase & Black/Gold Aesthetic */}
      <section className="border-b border-[#262420] pt-14 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left: Typography */}
            <div className="space-y-6 lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block">
                CV SUMBER WANGI MADIUN GROUP
              </span>

              <h1 className="text-4xl font-semibold tracking-tight text-[#f2f0ea] sm:text-5xl lg:text-6xl leading-[1.1]">
                Temukan Aroma <span className="text-[#d4af37]">Favoritmu.</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#a3a099]">
                Parfum pilihan berkualitas dengan keharuman elegan dan harga terjangkau.
                Semua varian parfum hanya <strong className="text-[#d4af37] font-semibold">Rp20.000</strong>.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 bg-[#d4af37] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
                >
                  <span>Lihat Semua Parfum</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#d4af37]/60 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0d0d] transition-all duration-200"
                >
                  <span>Pesan via WA: 0813-3322-6161</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Sub-details */}
              <div className="pt-8 border-t border-[#262420] grid grid-cols-3 gap-6 text-xs text-[#a3a099]">
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">Rp20.000</span>
                  <span className="text-[11px]">Harga seragam</span>
                </div>
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">11 Varian</span>
                  <span className="text-[11px]">Aroma Pilihan</span>
                </div>
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">12 - 14+ Jam</span>
                  <span className="text-[11px]">Ketahanan wangi</span>
                </div>
              </div>
            </div>

            {/* Right: Official Logo Showcase (Transparent, tanpa kotak pembatas) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px]">
                <Image
                  src="/images/logo.png"
                  alt="Logo Resmi CV Sumber Wangi Madiun Group"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KOLEKSI PARFUM PILIHAN */}
      <section className="py-20 border-b border-[#262420] bg-[#0f0f0f]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] block font-medium">
                Koleksi Pilihan
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#f2f0ea]">
                Varian Parfum Populer
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#a3a099]">
                Semua parfum hanya <span className="text-[#d4af37] font-semibold">Rp20.000</span>
              </p>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#d4af37] hover:text-[#e8c96c] transition-colors"
            >
              <span>Lihat 11 Varian</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {error ? (
            <ErrorMessage
              title="Produk sedang tidak dapat dimuat"
              message={error}
              showWhatsAppFallback={true}
            />
          ) : featuredProducts.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#a3a099]">
              Belum ada produk yang ditampilkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. TENTANG SUMBER WANGI — Sesuai HTML */}
      <section className="py-20 md:py-24 border-b border-[#262420] bg-[#0d0d0d]">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] block font-medium">
            Tentang Sumber Wangi
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f2f0ea]">
            Parfum Pilihan dengan Harga Terjangkau
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#a3a099] pt-2">
            Sumber Wangi menyediakan berbagai pilihan parfum dengan aroma pilihan dan harga
            yang terjangkau bagi semua kalangan.
          </p>
          <div className="pt-4">
            <Link
              href="/tentang"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#d4af37] hover:text-[#e8c96c] transition-colors"
            >
              <span>Pelajari Profil Kami</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CARA PEMESANAN */}
      <section className="py-16 md:py-20 border-b border-[#262420] bg-[#121212]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] block font-medium">
              Alur Pembelian
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-[#f2f0ea]">
              Langkah Pemesanan Mudah
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs font-semibold text-[#d4af37] block">01</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Pilih Aroma Favorit</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Pilih dari 11 varian aroma wangi pilihan yang sesuai dengan selera Anda.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs font-semibold text-[#d4af37] block">02</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Pesan via WhatsApp</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Klik tombol pesan untuk mengirimkan detail pesanan otomatis ke WhatsApp.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs font-semibold text-[#d4af37] block">03</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Konfirmasi & Kirim</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Konfirmasi pesanan via WhatsApp dan paket dikirim aman ke alamat Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KONTAK PESAN SEKARANG */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f2f0ea]">
            Pesan Sekarang
          </h2>
          <p className="text-xs sm:text-sm text-[#a3a099] max-w-md mx-auto leading-relaxed">
            Pilih aroma favoritmu dan hubungi kami langsung melalui WhatsApp (0813-3322-6161).
          </p>
          <div className="pt-2">
            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#d4af37] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
            >
              <span>WhatsApp Sumber Wangi</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
