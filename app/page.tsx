import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  ArrowRight,
  Award,
  HeartHandshake,
  MessageCircle,
  CheckCircle2,
  Package,
  QrCode,
  Truck,
} from 'lucide-react';
import { getFeaturedProducts } from '@/lib/pocketbase';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

export const revalidate = 60; // ISR revalidate setiap 60 detik

export default async function HomePage() {
  const { data: featuredProducts, error } = await getFeaturedProducts(4);

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-stone-50 to-stone-50 pt-12 pb-20 md:pt-20 md:pb-28 dark:from-amber-950/20 dark:via-stone-950 dark:to-stone-950">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-transparent blur-3xl opacity-60 dark:opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Teks Hero */}
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Koleksi Parfum Artisanal Nusantara</span>
              </div>

              <h1 className="font-serif text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.15]">
                Sentuhan Keharuman{' '}
                <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-amber-500">
                  Abadi & Memikat
                </span>
              </h1>

              <p className="max-w-2xl text-base text-stone-600 sm:text-lg dark:text-stone-300 leading-relaxed mx-auto lg:mx-0">
                Diramu dengan dedikasi tinggi dari bibit wewangian murni berkualitas prima.
                Menghadirkan aroma berkelas yang tahan 12 hingga 14+ jam, menemani setiap jejak
                langkah Anda dengan penuh percaya diri.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/produk"
                  className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-stone-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-950/20 transition-all duration-200 hover:bg-amber-700 hover:shadow-xl active:scale-[0.98] dark:bg-amber-600 dark:hover:bg-amber-700"
                >
                  <span>Lihat Semua Parfum</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={getWhatsAppConsultationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border border-stone-300 bg-white px-7 py-3.5 text-sm font-semibold text-stone-800 shadow-sm transition-all duration-200 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98] dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-emerald-400"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Konsultasi via WhatsApp</span>
                </a>
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 dark:border-stone-800/80">
                <div>
                  <p className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400">
                    14+ Jam
                  </p>
                  <p className="text-xs text-stone-500">Ketahanan Aroma</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400">
                    100%
                  </p>
                  <p className="text-xs text-stone-500">Bibit Konsentrat</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400">
                    Halal
                  </p>
                  <p className="text-xs text-stone-500">Aman di Kulit</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-amber-500/20 bg-stone-900 shadow-2xl shadow-amber-950/20">
                <Image
                  src="/images/products/oud-royale.jpg"
                  alt="Sumber Wangi Oud Royale Eau De Parfum"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-amber-500/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                    Signature Blend
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-amber-100">
                    Oud Royale Eau De Parfum
                  </h3>
                  <p className="mt-1 text-xs text-stone-300">
                    Kemewahan gaharu Nusantara, hangat amber, & keanggunan mawar Damaskus
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-amber-300">
                      Rp185.000
                    </span>
                    <Link
                      href="/produk/oud-royale"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-stone-900"
                    >
                      <span>Lihat Produk</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KOLEKSI UNGGULAN (FEATURED PRODUCTS) */}
      <section className="py-20 bg-white dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Koleksi Terfavorit</span>
              </div>
              <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl dark:text-white">
                Pilihan Terbaik Sumber Wangi
              </h2>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                Racikan wewangian paling digemari dengan karakter aroma yang khas dan memikat.
              </p>
            </div>

            <Link
              href="/produk"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 group"
            >
              <span>Lihat Semua Koleksi</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Grid Produk atau Pesan Error */}
          {error ? (
            <ErrorMessage
              title="Gagal Memuat Produk Unggulan"
              message={error}
              showWhatsAppFallback={true}
            />
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 p-12 text-center dark:border-stone-800">
              <p className="text-stone-500">Belum ada produk unggulan yang tersedia saat ini.</p>
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

      {/* 3. ALUR CARA PEMESANAN PRAKTIS VIA WHATSAPP */}
      <section className="py-20 bg-stone-100/70 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Mudah & Tanpa Ribet
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold text-stone-900 sm:text-4xl dark:text-white">
              Cara Pemesanan di Sumber Wangi
            </h2>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              Nikmati kemudahan berbelanja langsung via WhatsApp dengan layanan personal ramah.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-serif font-bold text-lg mb-4">
                1
              </div>
              <Package className="h-6 w-6 text-stone-700 dark:text-stone-300 mb-2" />
              <h3 className="font-serif font-bold text-stone-900 dark:text-white mb-2">
                Pilih Parfum Favorit
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Jelajahi katalog dan temukan aroma yang paling cocok dengan karakter dan suasana hati Anda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-serif font-bold text-lg mb-4">
                2
              </div>
              <MessageCircle className="h-6 w-6 text-emerald-600 mb-2" />
              <h3 className="font-serif font-bold text-stone-900 dark:text-white mb-2">
                Klik Pesan via WA
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Sistem otomatis menyiapkan pesan pemesanan lengkap dengan nama produk dan harga.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-serif font-bold text-lg mb-4">
                3
              </div>
              <QrCode className="h-6 w-6 text-stone-700 dark:text-stone-300 mb-2" />
              <h3 className="font-serif font-bold text-stone-900 dark:text-white mb-2">
                Bayar Praktis via QRIS
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Konfirmasi alamat pengiriman dan lakukan pembayaran mudah melalui QRIS tanpa biaya admin.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-stone-200 shadow-sm dark:bg-stone-900 dark:border-stone-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-serif font-bold text-lg mb-4">
                4
              </div>
              <Truck className="h-6 w-6 text-stone-700 dark:text-stone-300 mb-2" />
              <h3 className="font-serif font-bold text-stone-900 dark:text-white mb-2">
                Pengiriman Aman
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Parfum dikemas bubble wrap tebal dan box kokoh, diantar aman hingga ke depan pintu rumah Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEDIKASI KUALITAS / FILOSOFI BRAND */}
      <section className="py-20 bg-white dark:bg-stone-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Tentang Sumber Wangi
              </span>
              <h2 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl dark:text-white leading-snug">
                Harmoni Kemewahan Alam Nusantara & Sentuhan Modern
              </h2>
              <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                Lahir dari kecintaan mendalam terhadap kekayaan aroma bumi Nusantara—dari rempah
                kayu gaharu, nilam hangat, hingga bunga melati putih mekar—Sumber Wangi hadir
                untuk menyajikan parfum berkualitas mahakarya dengan harga yang masuk akal.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Racikan Presisi:</strong> Dibuat secara higienis menggunakan alkohol food-grade ramah kulit yang tidak menyebabkan iritasi.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Sillage Kuat:</strong> Meninggalkan jejak keharuman yang berkarisma tanpa aroma yang menusuk hidung.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="text-xs text-stone-700 dark:text-stone-300">
                    <strong>Garansi Kualitas:</strong> Setiap botol melalui kontrol kualitas ketat sebelum sampai di tangan pelanggan.
                  </p>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400"
                >
                  <span>Pelajari Kisah Lengkap Kami</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800">
                  <Image
                    src="/images/products/jasmine-sensual.jpg"
                    alt="Sumber Wangi Jasmine Sensual"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-5 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
                  <Award className="h-6 w-6 mx-auto text-amber-700 dark:text-amber-400 mb-2" />
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Bibit Asli Murni
                  </h4>
                  <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400">
                    Tanpa campuran pelarut berlebih
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-5 text-center dark:border-emerald-900/30 dark:bg-emerald-950/20">
                  <HeartHandshake className="h-6 w-6 mx-auto text-emerald-700 dark:text-emerald-400 mb-2" />
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                    Layanan Personal
                  </h4>
                  <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400">
                    Konsultasi langsung dengan admin ramah
                  </p>
                </div>
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl border border-stone-200 dark:border-stone-800">
                  <Image
                    src="/images/products/midnight-gentleman.jpg"
                    alt="Sumber Wangi Midnight Gentleman"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONSULTATION CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              Bantuan Memilih Aroma
            </span>
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">
              Bingung Menentukan Parfum yang Paling Pas?
            </h2>
            <p className="text-sm text-amber-100/90 leading-relaxed">
              Ceritakan preferensi wangi Anda (manis, segar, maskulin, atau floral).
              Tim wewangian Sumber Wangi siap membantu Anda memilih aroma yang sesuai karakter Anda.
            </p>
            <div className="pt-4">
              <a
                href={getWhatsAppConsultationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-emerald-500 hover:shadow-xl active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Konsultasi Gratis via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
