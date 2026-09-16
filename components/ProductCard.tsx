import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/pocketbase';
import { WhatsAppButton } from './WhatsAppButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  return (
    <div className="group flex flex-col">
      {/* Product Image Frame */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-[#f4f3ef]"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-103"
          priority={false}
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col pt-3 pb-1">
        {/* Subtle Category & Size */}
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#706f6a]">
          {product.category && <span>{product.category}</span>}
          {product.category && product.size_ml && <span>·</span>}
          {product.size_ml && <span>{product.size_ml} ml</span>}
        </div>

        {/* Title */}
        <Link
          href={`/produk/${product.slug}`}
          className="mt-1 text-sm sm:text-base font-medium text-[#141413] tracking-tight hover:opacity-70 transition-opacity"
        >
          {product.name}
        </Link>

        {/* Price & Action */}
        <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#e8e6df]">
          <span className="text-sm font-semibold text-[#141413]">
            {formatRupiah(product.price)}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/produk/${product.slug}`}
              className="text-xs uppercase tracking-wider text-[#706f6a] hover:text-[#141413] transition-colors"
            >
              Detail
            </Link>
            <span className="text-stone-300">/</span>
            <WhatsAppButton
              productName={product.name}
              price={product.price}
              label="Pesan"
              variant="compact"
              className="text-[11px] px-2.5 py-1 tracking-wider uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
