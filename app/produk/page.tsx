import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAvailableProducts } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';

export const metadata: Metadata = {
  title: 'Katalog Parfum — CV Sumber Wangi Madiun Group',
  description:
    'Koleksi lengkap parfum artisanal CV Sumber Wangi Madiun Group untuk pria, wanita, dan unisex.',
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
    <div className="min-h-screen bg-[#0d0d0d] text-[#f2f0ea] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Page Header */}
        <div className="mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.22em] text-[#d4af37] block font-medium">
            Katalog Produk
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#f2f0ea]">
            Koleksi Parfum Artisanal
          </h1>
          <p className="text-xs sm:text-sm text-[#a3a099] max-w-xl leading-relaxed">
            Diformulasikan dalam konsentrasi Eau De Parfum dengan ketahanan 12 hingga 14+ jam.
          </p>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="mb-12 flex flex-wrap items-center gap-6 border-b border-[#262420] pb-4 text-xs uppercase tracking-wider">
          {categories.map((cat) => {
            const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
            const href = cat === 'Semua' ? '/produk' : `/produk?kategori=${encodeURIComponent(cat)}`;

            return (
              <Link
                key={cat}
                href={href}
                className={`transition-colors ${
                  isSelected
                    ? 'font-semibold text-[#d4af37] border-b-2 border-[#d4af37] pb-4 -mb-[18px]'
                    : 'text-[#85837b] hover:text-[#d4af37]'
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
          <div className="p-16 text-center border border-[#262420] bg-[#141414] space-y-4">
            <h3 className="text-sm font-medium text-[#f2f0ea]">
              Belum ada produk untuk kategori {currentCategory}
            </h3>
            <p className="text-xs text-[#a3a099]">
              Silakan pilih kategori lain atau lihat seluruh katalog kami.
            </p>
            <div className="pt-2">
              <Link
                href="/produk"
                className="inline-flex items-center bg-[#d4af37] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46]"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between text-xs text-[#85837b]">
              <span>{products.length} varian parfum tersedia</span>
              {currentCategory !== 'Semua' && (
                <span className="text-[#d4af37]">Kategori: {currentCategory}</span>
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
