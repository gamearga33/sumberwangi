import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/products';
import { WhatsAppButton } from './WhatsAppButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  return (
    <div className="group flex flex-col bg-[#141414] border border-[#262420] transition-colors duration-300 hover:border-[#d4af37]/50">
      {/* Product Image Frame */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#1a1918]"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-103 opacity-95 group-hover:opacity-100"
          priority={false}
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Subtle Size & Concentration */}
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#d4af37]">
          <span>{product.size_ml ? `${product.size_ml} ml` : '35 ml'}</span>
          <span>·</span>
          <span>Eau De Parfum</span>
        </div>

        {/* Title */}
        <Link
          href={`/produk/${product.slug}`}
          className="mt-1.5 text-sm sm:text-base font-medium text-[#f2f0ea] tracking-tight hover:text-[#d4af37] transition-colors"
        >
          {product.name}
        </Link>

        {/* Price & Action */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-[#262420]">
          <span className="text-sm font-semibold text-[#d4af37]">
            {formatRupiah(product.price)}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/produk/${product.slug}`}
              className="text-xs uppercase tracking-wider text-[#9c9991] hover:text-[#f2f0ea] transition-colors"
            >
              Detail
            </Link>
            <span className="text-[#3b3832]">/</span>
            <WhatsAppButton
              productName={product.name}
              price={product.price}
              label="Pesan"
              variant="compact"
              className="text-[11px] px-2.5 py-1 tracking-wider uppercase font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
