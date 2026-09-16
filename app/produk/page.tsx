import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableProducts } from '@/lib/pocketbase';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export const metadata: Metadata = {
  title: 'Katalog Produk — Sumber Wangi',
  description:
    'Koleksi lengkap parfum artisanal Sumber Wangi untuk pria, wanita, dan unisex.',
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
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Page Header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[#706f6a] block">
            Koleksi
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141413]">
            Katalog Produk
          </h1>
          <p className="text-xs sm:text-sm text-[#706f6a] max-w-xl leading-relaxed">
            Diformulasikan dalam konsentrasi Eau De Parfum dengan ketahanan 12 hingga 14+ jam.
          </p>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="mb-12 flex flex-wrap items-center gap-6 border-b border-[#e8e6df] pb-4 text-xs uppercase tracking-wider">
          {categories.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
            const href = cat === 'Semua' ? '/produk' : `/produk?kategori=${encodeURIComponent(cat)}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`transition-colors ${
                  isSelected
                    ? 'font-semibold text-[#141413] border-b-2 border-[#141413] pb-4 -mb-[18px]'
                    : 'text-[#706f6a] hover:text-[#141413]'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Content handling */}
        {error ? (
          <ErrorMessage
            title="Katalog sedang tidak dapat dimuat"
            message={error}
            showWhatsAppFallback={true}
          />
        ) : products.length === 0 ? (
          <div className="p-16 text-center border border-[#e8e6df] bg-white space-y-4">
            <h3 className="text-sm font-medium text-[#141413]">
              Belum ada produk untuk kategori {currentCategory}
            </h3>
            <p className="text-xs text-[#706f6a]">
              Silakan pilih kategori lain atau lihat seluruh katalog kami.
            </p>
            <div className="pt-2">
              <Link
                href="/produk"
                className="inline-flex items-center bg-[#141413] px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-white hover:bg-[#282826]"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between text-xs text-[#706f6a]">
              <span>{products.length} varian parfum</span>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
