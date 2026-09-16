import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Clock,
  QrCode,
  Truck,
  Droplets,
} from 'lucide-react';
import { getProductBySlug, getAvailableProducts, getProductImageUrl } from '@/lib/pocketbase';
import { formatRupiah } from '@/lib/utils';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const revalidate = 60; // ISR revalidation interval

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data: products } = await getAvailableProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: product } = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan — Sumber Wangi',
    };
  }

  const plainDesc = product.description.replace(/<[^>]*>?/gm, '').slice(0, 160);

  return {
    title: `${product.name} — Sumber Wangi`,
    description: plainDesc,
    openGraph: {
      title: `${product.name} — Sumber Wangi`,
      description: plainDesc,
      images: [
        {
          url: getProductImageUrl(product),
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { data: product } = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const mainImageUrl = getProductImageUrl(product);

  const categoryBadgeColors: Record<string, string> = {
    Pria: 'bg-stone-800 text-stone-200 border-stone-700',
    Wanita: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    Unisex: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
  };

  const badgeColor =
    (product.category && categoryBadgeColors[product.category]) ||
    'bg-stone-800 text-stone-300 border-stone-700';

  return (
    <div className="min-h-screen bg-stone-50 py-8 md:py-14 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Tombol Kembali */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center space-x-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link
              href="/produk"
              className="hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              Katalog
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900 dark:text-stone-200 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Konten Utama Produk */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Sisi Kiri: Gambar Produk */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-md dark:border-stone-800 dark:bg-stone-900">
                <Image
                  src={mainImageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                {/* Badge Kategori Melayang */}
                {product.category && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium backdrop-blur-md ${badgeColor}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {product.category}
                    </span>
                  </div>
                )}

                {/* Badge Ukuran Botol */}
                {product.size_ml && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-3.5 py-1 text-xs font-medium text-stone-200 backdrop-blur-md">
                      <Droplets className="w-3.5 h-3.5 text-amber-400" />
                      {product.size_ml} ml
                    </span>
                  </div>
                )}
              </div>

              {/* Jaminan Cepat */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 text-center dark:bg-stone-900 dark:border-stone-800">
                  <Clock className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                    Tahan 14+ Jam
                  </span>
                  <span className="text-[10px] text-stone-500">Eau De Parfum</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 text-center dark:bg-stone-900 dark:border-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                    Aman di Kulit
                  </span>
                  <span className="text-[10px] text-stone-500">Food-grade alcohol</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-stone-200 text-center dark:bg-stone-900 dark:border-stone-800">
                  <QrCode className="w-4 h-4 text-amber-600 mb-1" />
                  <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                    Bayar QRIS
                  </span>
                  <span className="text-[10px] text-stone-500">Semua e-wallet & bank</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Detail & Aksi Pemesanan */}
          <div className="space-y-8 lg:col-span-6">
            {/* Header Informasi */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Sumber Wangi Signature
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500">Koleksi Artisanal</span>
              </div>

              <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl dark:text-white">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="font-serif text-3xl font-extrabold text-amber-700 dark:text-amber-400">
                  {formatRupiah(product.price)}
                </span>
                {product.size_ml && (
                  <span className="text-xs text-stone-500">
                    Isi kemasan: <strong>{product.size_ml} ml</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Tombol CTA Pesan via WhatsApp */}
            <div className="rounded-3xl border border-emerald-600/30 bg-emerald-500/5 p-6 space-y-4 dark:border-emerald-500/20 dark:bg-emerald-950/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white">
                    Pesan Langsung via WhatsApp
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Konfirmasi stok & proses pesanan instan dengan admin kami
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Ready Stock
                </div>
              </div>

              <WhatsAppButton
                productName={product.name}
                price={product.price}
                label="Pesan Sekarang via WhatsApp"
                size="lg"
                variant="primary"
                className="w-full justify-center shadow-lg shadow-emerald-950/20"
              />

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  Kirim ke Seluruh Indonesia
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-stone-400" />
                  Bayar via QRIS
                </span>
              </div>
            </div>

            {/* Deskripsi Produk */}
            <div className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
                Tentang Aroma & Komposisi
              </h3>
              <div
                className="prose prose-sm max-w-none text-stone-600 dark:text-stone-300 leading-relaxed [&_p]:mb-3 [&_strong]:text-stone-900 dark:[&_strong]:text-white"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Cara Pemesanan Singkat */}
            <div className="space-y-3 rounded-3xl border border-stone-200 bg-stone-100/60 p-6 dark:border-stone-800 dark:bg-stone-900/60">
              <h4 className="font-serif text-sm font-bold text-stone-900 dark:text-white">
                Informasi Pemesanan & Pembayaran:
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">1.</span>
                  <span>
                    Klik tombol WhatsApp di atas untuk langsung mengirimkan detail pesanan Anda.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">2.</span>
                  <span>
                    Admin Sumber Wangi akan mengirimkan kode QRIS dan total ongkir sesuai kota tujuan.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">3.</span>
                  <span>
                    Scan QRIS dengan aplikasi bank atau e-wallet (GoPay, OVO, Dana, ShopeePay, BCA, dll).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-amber-700 dark:text-amber-400">4.</span>
                  <span>
                    Pesanan diproses dan nomor resi pengiriman akan diberikan langsung melalui WhatsApp.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
