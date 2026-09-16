import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/pocketbase';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const revalidate = 60; // ISR revalidate setiap 60 detik

export default async function HomePage() {
  const { data: featuredProducts, error } = await getFeaturedProducts(4);

  return (
    <div className="flex flex-col bg-[#0d0d0d] text-[#f2f0ea]">
      {/* 1. HERO SECTION — Luxury Black & Gold */}
      <section className="border-b border-[#262420] pt-14 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left: Typography */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-medium block">
                  CV SUMBER WANGI MADIUN GROUP
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-[#f2f0ea] sm:text-5xl lg:text-6xl leading-[1.1]">
                Keharuman mewah dengan{' '}
                <span className="text-[#d4af37]">karakter abadi.</span>
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#a3a099]">
                Diformulasikan dari bibit wewangian murni berkonsentrasi tinggi.
                Aroma berkarakter elegan yang menyatu halus pada kulit dan bertahan sepanjang hari.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 bg-[#d4af37] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
                >
                  <span>Lihat Katalog Parfum</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#d4af37]/60 px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0d0d] transition-all duration-200"
                >
                  <span>Konsultasi WA: 0813-3322-6161</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Sub-details */}
              <div className="pt-8 border-t border-[#262420] grid grid-cols-3 gap-6 text-xs text-[#a3a099]">
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">Eau De Parfum</span>
                  <span className="text-[11px]">Konsentrasi murni</span>
                </div>
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">12 - 14+ Jam</span>
                  <span className="text-[11px]">Longevity teruji</span>
                </div>
                <div>
                  <span className="font-semibold text-[#d4af37] block text-sm">Food Grade</span>
                  <span className="text-[11px]">Aman di kulit</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Bottle Showcase */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square w-full overflow-hidden bg-[#141414] border border-[#262420]">
                <Image
                  src="/images/products/oud-royale.jpg"
                  alt="Sumber Wangi Oud Royale"
                  fill
                  priority
                  className="object-cover opacity-95"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#0d0d0d]/90 backdrop-blur-md p-4 border border-[#262420] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#d4af37] block font-medium">
                      Varian Unggulan
                    </span>
                    <span className="text-sm font-medium text-[#f2f0ea]">
                      Oud Royale Eau De Parfum
                    </span>
                  </div>
                  <Link
                    href="/produk/oud-royale"
                    className="text-xs uppercase tracking-wider font-semibold text-[#d4af37] hover:text-[#e8c96c]"
                  >
                    Detail &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KOLEKSI PILIHAN */}
      <section className="py-20 border-b border-[#262420] bg-[#0f0f0f]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] block font-medium">
                Koleksi Pilihan
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#f2f0ea]">
                Varian Terfavorit
              </h2>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#d4af37] hover:text-[#e8c96c] transition-colors"
            >
              <span>Semua Produk</span>
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

      {/* 3. FILOSOFI BRAND */}
      <section className="py-20 md:py-28 border-b border-[#262420] bg-[#0d0d0d]">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] block font-medium">
            Filosofi & Kualitas
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#f2f0ea] leading-snug">
            Kekayaan aroma Nusantara, diracik dengan presisi artisanal standar tinggi.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#a3a099] max-w-2xl mx-auto">
            Dari kedalaman aroma kayu gaharu dan nilam hingga kesegaran kelopak melati putih
            dan jeruk sitrun tropis. Sumber Wangi memadukan bibit murni berstandar tinggi
            tanpa campuran pelarut berbahaya, memberikan aroma yang berkelas dan tahan seharian.
          </p>
          <div className="pt-2">
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

      {/* 4. CARA PEMESANAN PRAKTIS */}
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
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Pilih Varian Aroma</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Temukan aroma favorit Anda dari katalog lengkap kami.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs font-semibold text-[#d4af37] block">02</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Klik Pesan via WhatsApp</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Format pesanan akan otomatis terkirim ke WhatsApp customer service kami.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#d4af37]/60 pt-4">
              <span className="text-xs font-semibold text-[#d4af37] block">03</span>
              <h3 className="text-sm font-semibold text-[#f2f0ea]">Bayar QRIS & Pengiriman</h3>
              <p className="text-xs leading-relaxed text-[#a3a099]">
                Selesaikan pembayaran aman via QRIS dan paket dikirim aman ke alamat Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KONSULTASI WHATSAPP CTA */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="mx-auto max-w-6xl px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#f2f0ea]">
            Ingin rekomendasi parfum yang pas untuk kepribadian Anda?
          </h2>
          <p className="text-xs sm:text-sm text-[#a3a099] max-w-md mx-auto leading-relaxed">
            Hubungi kami di WhatsApp (0813-3322-6161). Kami siap membantu memberikan rekomendasi terbaik.
          </p>
          <div className="pt-2">
            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#d4af37] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors"
            >
              <span>Konsultasi via WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
