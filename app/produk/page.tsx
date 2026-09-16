import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAvailableProducts } from '@/lib/products';
import { ProductCatalog } from '@/components/ProductCatalog';
import { ProductGridSkeleton } from '@/components/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Katalog Parfum — CV Sumber Wangi Madiun Group',
  description:
    'Koleksi lengkap parfum artisanal CV Sumber Wangi Madiun Group dengan aroma mewah dan tahan lama.',
};

export const revalidate = 60; // ISR revalidate data setiap 60 detik

export default async function KatalogPage() {
  // Fetch semua produk aktif sekali via ISR (disimpan di Edge Cache)
  const { data: products, error } = await getAvailableProducts();

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

        {/* Filter interaktif client-side dibungkus Suspense agar halaman tetap Static SSG/ISR */}
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductCatalog initialProducts={products} error={error} />
        </Suspense>
      </div>
    </div>
  );
}
