'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { filterProductsByCategory } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';

const CATEGORIES = ['Semua', 'Pria', 'Wanita', 'Unisex'] as const;

interface ProductCatalogProps {
  initialProducts?: Product[];
  error: string | null;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialProducts = [],
  error,
}) => {
  const searchParams = useSearchParams();

  // Single source of truth: URL query parameter
  const selectedCategory = searchParams.get('kategori') || 'Semua';

  // Filter produk secara instan di memori tanpa request ulang ke Supabase
  const filteredProducts = useMemo(() => {
    return filterProductsByCategory(initialProducts, selectedCategory);
  }, [initialProducts, selectedCategory]);

  if (error) {
    return (
      <ErrorMessage
        title="Katalog sedang tidak dapat dimuat"
        message={error}
        showWhatsAppFallback={true}
      />
    );
  }

  const activeCategoryTitle =
    CATEGORIES.find((c) => c.toLowerCase() === selectedCategory.toLowerCase()) ||
    selectedCategory;

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="mb-12 flex flex-wrap items-center gap-6 border-b border-[#262420] pb-4 text-xs uppercase tracking-wider">
        {CATEGORIES.map((cat) => {
          const isSelected =
            selectedCategory.toLowerCase() === cat.toLowerCase();
          const href =
            cat.toLowerCase() === 'semua'
              ? '/produk'
              : `/produk?kategori=${encodeURIComponent(cat)}`;

          return (
            <Link
              key={cat}
              href={href}
              replace
              scroll={false}
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

      {/* Catalog Content */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center border border-[#262420] bg-[#141414] space-y-4">
          <h3 className="text-sm font-medium text-[#f2f0ea]">
            Belum ada produk untuk kategori {activeCategoryTitle}
          </h3>
          <p className="text-xs text-[#a3a099]">
            Silakan pilih kategori lain atau lihat seluruh katalog kami.
          </p>
          <div className="pt-2">
            <Link
              href="/produk"
              replace
              scroll={false}
              className="inline-flex items-center bg-[#d4af37] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46]"
            >
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Header Summary */}
          <div className="mb-6 flex items-center justify-between text-xs text-[#85837b]">
            <span>{filteredProducts.length} varian parfum tersedia</span>
            {selectedCategory.toLowerCase() !== 'semua' && (
              <span className="text-[#d4af37]">Kategori: {activeCategoryTitle}</span>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
