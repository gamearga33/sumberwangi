'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { ErrorMessage } from '@/components/ErrorMessage';

interface ProductCatalogProps {
  initialProducts?: Product[];
  error: string | null;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialProducts = [],
  error,
}) => {
  if (error) {
    return (
      <ErrorMessage
        title="Katalog sedang tidak dapat dimuat"
        message={error}
        showWhatsAppFallback={true}
      />
    );
  }

  return (
    <div>
      {/* Catalog Content */}
      {initialProducts.length === 0 ? (
        <div className="p-16 text-center border border-[#262420] bg-[#141414] space-y-4">
          <h3 className="text-sm font-medium text-[#f2f0ea]">
            Belum ada produk yang tersedia saat ini
          </h3>
          <p className="text-xs text-[#a3a099]">
            Silakan hubungi kami langsung via WhatsApp untuk informasi ketersediaan aroma parfum.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center bg-[#d4af37] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46]"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Header Summary */}
          <div className="mb-6 flex items-center justify-between text-xs text-[#85837b] border-b border-[#262420] pb-4">
            <span>{initialProducts.length} varian parfum tersedia</span>
            <span className="text-[#d4af37]">Eau De Parfum Artisanal</span>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
