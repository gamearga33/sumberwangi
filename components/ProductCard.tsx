import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/pocketbase';
import { WhatsAppButton } from './WhatsAppButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = getProductImageUrl(product);

  const categoryBadgeColors: Record<string, string> = {
    Pria: 'bg-stone-800 text-stone-200 border-stone-700',
    Wanita: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    Unisex: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
  };

  const badgeColor =
    (product.category && categoryBadgeColors[product.category]) ||
    'bg-stone-800 text-stone-300 border-stone-700';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-950/5 dark:border-stone-800 dark:bg-stone-900/90 dark:hover:border-amber-500/50">
      {/* Container Gambar */}
      <Link
        href={`/produk/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-stone-100 dark:bg-stone-950"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Overlay gradasi lembut saat hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge Kategori */}
        {product.category && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-md ${badgeColor}`}
            >
              <Sparkles className="w-3 h-3" />
              {product.category}
            </span>
          </div>
        )}

        {/* Badge Ukuran */}
        {product.size_ml && (
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-stone-900/80 px-2.5 py-0.5 text-xs font-medium text-stone-300 backdrop-blur-md">
              {product.size_ml} ml
            </span>
          </div>
        )}
      </Link>

      {/* Konten Info Produk */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <Link
            href={`/produk/${product.slug}`}
            className="line-clamp-1 font-serif text-lg font-bold tracking-tight text-stone-900 transition-colors hover:text-amber-700 dark:text-stone-100 dark:hover:text-amber-400"
          >
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {product.description.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-xs text-stone-600 dark:text-stone-400">Harga</span>
            <span className="text-lg font-bold font-serif text-amber-700 dark:text-amber-400">
              {formatRupiah(product.price)}
            </span>
          </div>

          {/* Action Buttons: Detail & Pesan via WA */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/produk/${product.slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
            >
              <span>Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <WhatsAppButton
              productName={product.name}
              price={product.price}
              label="Pesan WA"
              variant="compact"
              className="w-full py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
