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
    <div className="flex flex-col">
      {/* 1. HERO SECTION - Minimalist Editorial */}
      <section className="border-b border-[#e8e6df] pt-14 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left: Typography */}
            <div className="space-y-6 lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.25em] text-[#706f6a] font-medium block">
                Artisanal Perfumery
              </span>

              <h1 className="text-4xl font-semibold tracking-tight text-[#141413] sm:text-5xl lg:text-6xl leading-[1.1]">
                Keharuman dengan karakter abadi.
              </h1>

              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#706f6a]">
                Diformulasikan dari bibit wewangian murni berkonsentrasi tinggi.
                Aroma berkarakter elegan yang menyatu halus dan bertahan sepanjang hari.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Link
                  href="/produk"
                  className="inline-flex items-center gap-2 bg-[#141413] px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#fbfbf9] hover:bg-[#2c2b28] transition-colors"
                >
                  <span>Jelajahi Katalog</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#141413] hover:opacity-60 transition-opacity"
                >
                  <span>Konsultasi Aroma</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Clean Sub-details */}
              <div className="pt-8 border-t border-[#e8e6df] flex gap-8 text-xs text-[#706f6a]">
                <div>
                  <span className="font-semibold text-[#141413] block">Eau De Parfum</span>
                  <span>Konsentrasi tinggi</span>
                </div>
                <div>
                  <span className="font-semibold text-[#141413] block">12 - 14+ Jam</span>
                  <span>Daya tahan aroma</span>
                </div>
                <div>
                  <span className="font-semibold text-[#141413] block">Food Grade</span>
                  <span>Aman di kulit</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Bottle Showcase */}
            <div className="lg:col-span-5">
              <div className="relative aspect-square w-full overflow-hidden bg-[#f4f3ef]">
                <Image
                  src="/images/products/oud-royale.jpg"
                  alt="Sumber Wangi Oud Royale"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 border border-[#e8e6df] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#706f6a] block">
                      Varian Utama
                    </span>
                    <span className="text-sm font-medium text-[#141413]">
                      Oud Royale
                    </span>
                  </div>
                  <Link
                    href="/produk/oud-royale"
                    className="text-xs uppercase tracking-wider text-[#141413] hover:opacity-60"
                  >
                    Lihat &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KOLEKSI PILIHAN */}
      <section className="py-20 border-b border-[#e8e6df]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#706f6a] block">
                Koleksi
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
                Pilihan Terbaik
              </h2>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#706f6a] hover:text-[#141413] transition-colors"
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
            <div className="p-12 text-center text-xs text-[#706f6a]">
              Belum ada produk yang ditampilkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FILOSOFI BRAND — Clean Editorial */}
      <section className="py-20 md:py-28 border-b border-[#e8e6df]">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#706f6a] block">
            Filosofi
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#141413] leading-snug">
            Kekayaan wewangian Nusantara, diracik dengan presisi artisanal modern.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#706f6a] max-w-2xl mx-auto">
            Dari kehangatan gaharu dan nilam hingga kesegaran melati dan citrus tropis.
            Setiap botol Sumber Wangi memadukan bibit murni berstandar tinggi tanpa pelarut
            berlebih, menghasilkan aroma yang bersih, berkelas, dan nyaman dipakai sehari-hari.
          </p>
          <div className="pt-2">
            <Link
              href="/tentang"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-[#141413] hover:opacity-60 transition-opacity"
            >
              <span>Baca Cerita Lengkap</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CARA PEMESANAN — Simple Clean Steps */}
      <section className="py-16 md:py-20 border-b border-[#e8e6df] bg-[#f7f6f2]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12">
            <span className="text-xs uppercase tracking-widest text-[#706f6a] block">
              Pemesanan
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-[#141413]">
              Alur Belanja Sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs font-semibold text-[#141413] block">01</span>
              <h3 className="text-sm font-semibold text-[#141413]">Pilih Varian</h3>
              <p className="text-xs leading-relaxed text-[#706f6a]">
                Tentukan aroma yang sesuai dengan karakter Anda di halaman katalog.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs font-semibold text-[#141413] block">02</span>
              <h3 className="text-sm font-semibold text-[#141413]">Pesan via WhatsApp</h3>
              <p className="text-xs leading-relaxed text-[#706f6a]">
                Klik tombol pesan untuk mengirimkan detail produk ke customer service kami.
              </p>
            </div>

            <div className="space-y-2 border-t border-[#141413] pt-4">
              <span className="text-xs font-semibold text-[#141413] block">03</span>
              <h3 className="text-sm font-semibold text-[#141413]">Bayar QRIS & Kirim</h3>
              <p className="text-xs leading-relaxed text-[#706f6a]">
                Selesaikan pembayaran melalui QRIS fisik/digital dan pesanan segera dikirim.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL CONSULTATION CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#141413]">
            Ingin berkonsultasi mengenai pilihan aroma?
          </h2>
          <p className="text-xs sm:text-sm text-[#706f6a] max-w-md mx-auto leading-relaxed">
            Ceritakan preferensi aroma Anda dan kami akan memberikan rekomendasi yang paling tepat.
          </p>
          <div className="pt-2">
            <a
              href={getWhatsAppConsultationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#141413] px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#fbfbf9] hover:bg-[#2c2b28] transition-colors"
            >
              <span>Hubungi via WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
