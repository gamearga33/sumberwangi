import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getProductBySlug, getAvailableProducts, getProductImageUrl } from '@/lib/pocketbase';
import { formatRupiah } from '@/lib/utils';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

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

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Simple Breadcrumb */}
        <div className="mb-10">
          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#706f6a] hover:text-[#141413] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        {/* 2-Column Product Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left: Product Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square w-full overflow-hidden bg-[#f4f3ef] border border-[#e8e6df]">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Editorial Product Details */}
          <div className="space-y-8 lg:col-span-6 lg:pl-4">
            {/* Header info */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#706f6a]">
                {product.category && <span>{product.category}</span>}
                {product.category && product.size_ml && <span> · </span>}
                {product.size_ml && <span>{product.size_ml} ml</span>}
                <span> · Eau De Parfum</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
                {product.name}
              </h1>

              <div className="pt-2">
                <span className="text-2xl font-semibold text-[#141413]">
                  {formatRupiah(product.price)}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3 pt-2">
              <WhatsAppButton
                productName={product.name}
                price={product.price}
                label="Pesan via WhatsApp"
                size="lg"
                variant="primary"
                className="w-full text-center justify-center py-4"
              />

              <p className="text-xs text-[#706f6a] text-center">
                Pemesanan diproses langsung oleh admin kami. Pembayaran melalui QRIS.
              </p>
            </div>

            {/* Product Description */}
            <div className="pt-6 border-t border-[#e8e6df] space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-[#706f6a] font-medium">
                Deskripsi & Catatan Aroma
              </h3>
              <div
                className="prose prose-sm max-w-none text-xs sm:text-sm text-[#141413] leading-relaxed [&_p]:mb-3 [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Specification list */}
            <div className="pt-6 border-t border-[#e8e6df]">
              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-[#706f6a] uppercase tracking-wider text-[10px]">Konsentrasi</dt>
                  <dd className="font-medium text-[#141413] mt-0.5">Eau De Parfum (EDP)</dd>
                </div>
                <div>
                  <dt className="text-[#706f6a] uppercase tracking-wider text-[10px]">Daya Tahan</dt>
                  <dd className="font-medium text-[#141413] mt-0.5">12 - 14+ Jam</dd>
                </div>
                <div>
                  <dt className="text-[#706f6a] uppercase tracking-wider text-[10px]">Ukuran</dt>
                  <dd className="font-medium text-[#141413] mt-0.5">{product.size_ml || 50} ml spray</dd>
                </div>
                <div>
                  <dt className="text-[#706f6a] uppercase tracking-wider text-[10px]">Pengiriman</dt>
                  <dd className="font-medium text-[#141413] mt-0.5">Seluruh Indonesia</dd>
                </div>
              </dl>
            </div>

            {/* Consultation Note */}
            <div className="pt-4 border-t border-[#e8e6df] flex items-center justify-between text-xs text-[#706f6a]">
              <span>Ragu dengan aroma ini?</span>
              <a
                href={getWhatsAppConsultationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-[#141413] hover:opacity-70 uppercase tracking-wider"
              >
                <span>Konsultasi</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
