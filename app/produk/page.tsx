import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Filter, PackageSearch } from 'lucide-react';
import { getAvailableProducts } from '@/lib/pocketbase';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export const metadata: Metadata = {
  title: 'Katalog Parfum Lengkap — Sumber Wangi',
  description:
    'Jelajahi seluruh koleksi aroma parfum Sumber Wangi. Temukan racikan mewah untuk pria, wanita, dan unisex dengan ketahanan aroma luar biasa.',
};

export const revalidate = 60; // Revalidate data setiap 60 detik

interface PageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function KatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.kategori || 'Semua';

  const { data: products, error } = await getAvailableProducts(
    currentCategory === 'Semua' ? undefined : currentCategory
  );

  const categories = ['Semua', 'Pria', 'Wanita', 'Unisex'];

  return (
    <div className="min-h-screen bg-stone-50 py-12 dark:bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Koleksi Eksklusif</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900 sm:text-4xl lg:text-5xl dark:text-white">
            Katalog Parfum Sumber Wangi
          </h1>
          <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
            Setiap botol diracik dengan presisi menggunakan bibit pilihan murni, menghadirkan
            pengalaman wewangian mewah yang memikat dan bertahan seharian.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 mr-2 text-xs font-semibold text-stone-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter Kategori:</span>
          </div>

          {categories.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
            const href = cat === 'Semua' ? '/produk' : `/produk?kategori=${encodeURIComponent(cat)}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-md shadow-amber-950/20 dark:bg-amber-600'
                    : 'border border-stone-300 bg-white text-stone-700 hover:border-amber-600/40 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Handling Error / Empty / Data */}
        {error ? (
          <ErrorMessage
            title="Katalog Sedang Tidak Dapat Dimuat"
            message={error}
            showWhatsAppFallback={true}
          />
        ) : products.length === 0 ? (
          <div className="mx-auto my-12 max-w-md rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 mb-4">
              <PackageSearch className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white">
              Belum Ada Produk di Kategori Ini
            </h3>
            <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Kami sedang menyiapkan racikan wewangian terbaru untuk kategori{' '}
              <strong>{currentCategory}</strong>. Silakan periksa kategori lainnya atau hubungi kami.
            </p>
            <div className="mt-6">
              <Link
                href="/produk"
                className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                Tampilkan Semua Parfum
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-stone-500">
              <span>Menampilkan {products.length} produk parfum pilihan</span>
              {currentCategory !== 'Semua' && (
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Filter: {currentCategory}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
