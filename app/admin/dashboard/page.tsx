'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  LogOut,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { formatRupiah } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/products';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || 'Admin');
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setProducts((data as Product[]) || []);
      setErrorMessage(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Gagal memuat produk: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!ignore && user) {
          setUserEmail(user.email || 'Admin');
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        if (!ignore) {
          setProducts((data as Product[]) || []);
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : String(err);
          setErrorMessage(`Gagal memuat produk: ${msg}`);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchProducts();
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Hard navigation diperlukan agar sesi logout bersih total di server
      window.location.href = '/admin/login';
    } catch {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Hard navigation diperlukan agar sesi logout bersih total di server
      window.location.href = '/admin/login';
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    setActionLoadingId(product.id);
    try {
      const supabase = createClient();
      const updatedStatus = !product.is_available;

      const { error } = await supabase
        .from('products')
        .update({ is_available: updatedStatus })
        .eq('id', product.id);

      if (error) {
        throw new Error(error.message);
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: updatedStatus } : p))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal mengubah ketersediaan: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    setActionLoadingId(product.id);
    try {
      const supabase = createClient();
      const updatedFeatured = !product.is_featured;

      const { error } = await supabase
        .from('products')
        .update({ is_featured: updatedFeatured })
        .eq('id', product.id);

      if (error) {
        throw new Error(error.message);
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_featured: updatedFeatured } : p))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal mengubah status unggulan: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus parfum "${product.name}" secara permanen?`
    );
    if (!confirmed) return;

    setActionLoadingId(product.id);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('products').delete().eq('id', product.id);

      if (error) {
        throw new Error(error.message);
      }

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Gagal menghapus produk: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const availableCount = products.filter((p) => p.is_available).length;
  const featuredCount = products.filter((p) => p.is_featured).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f0ea]">
      {/* Admin Navbar */}
      <header className="border-b border-[#262420] bg-[#121212]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f2f0ea]">
                Panel Admin
              </span>
            </Link>
            <span className="hidden sm:inline text-xs text-[#52504b]">|</span>
            <span className="hidden sm:inline text-xs text-[#a3a099]">
              {userEmail}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/produk"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#a3a099] hover:text-[#d4af37] transition-colors"
            >
              <span>Lihat Website</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 border border-[#262420] px-3 py-1.5 text-xs text-[#a3a099] hover:text-red-400 hover:border-red-900/60 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#f2f0ea]">
              Manajemen Katalog Parfum
            </h1>
            <p className="text-xs text-[#85837b] mt-1">
              Kelola daftar varian parfum, harga, foto, dan ketersediaan stok
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 border border-[#262420] bg-[#141414] px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-[#a3a099] hover:text-[#f2f0ea] hover:border-[#d4af37]/40 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Segarkan</span>
            </button>

            <Link
              href="/admin/produk/baru"
              className="inline-flex items-center gap-2 bg-[#d4af37] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] transition-colors shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Parfum Baru</span>
            </Link>
          </div>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="border border-[#262420] bg-[#141414] p-4">
            <span className="text-[10px] uppercase tracking-widest text-[#85837b]">Total Varian</span>
            <div className="text-2xl font-bold text-[#f2f0ea] mt-1">{products.length}</div>
            <span className="text-[11px] text-[#52504b]">Terdaftar di database</span>
          </div>
          <div className="border border-[#262420] bg-[#141414] p-4">
            <span className="text-[10px] uppercase tracking-widest text-[#85837b]">Varian Tersedia</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{availableCount}</div>
            <span className="text-[11px] text-[#52504b]">Tampil di katalog publik</span>
          </div>
          <div className="border border-[#262420] bg-[#141414] p-4">
            <span className="text-[10px] uppercase tracking-widest text-[#85837b]">Varian Populer</span>
            <div className="text-2xl font-bold text-[#d4af37] mt-1">{featuredCount}</div>
            <span className="text-[11px] text-[#52504b]">Diprioritaskan di beranda</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 border border-red-900/60 bg-red-950/40 p-4 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Product Table / Cards */}
        {isLoading ? (
          <div className="border border-[#262420] bg-[#141414] p-16 text-center space-y-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#d4af37] mx-auto" />
            <p className="text-xs text-[#a3a099]">Memuat data produk dari Supabase...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-[#262420] bg-[#141414] p-16 text-center space-y-4">
            <h3 className="text-sm font-medium text-[#f2f0ea]">Belum ada produk di database</h3>
            <p className="text-xs text-[#85837b] max-w-sm mx-auto">
              Mulai tambahkan varian parfum pertama Anda atau jalankan skrip seed data untuk mengimpor 11 varian resmi.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/produk/baru"
                className="inline-flex items-center gap-2 bg-[#d4af37] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Produk Sekarang</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="border border-[#262420] bg-[#141414] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#262420] bg-[#1a1a1a] text-[10px] uppercase tracking-wider text-[#85837b]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Produk</th>
                    <th className="py-3.5 px-3">Ukuran & Konsentrasi</th>
                    <th className="py-3.5 px-3">Harga</th>
                    <th className="py-3.5 px-3 text-center">Status Stok</th>
                    <th className="py-3.5 px-3 text-center">Populer</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262420]">
                  {products.map((product) => {
                    const isBusy = actionLoadingId === product.id;
                    const imageUrl = getProductImageUrl(product);

                    return (
                      <tr key={product.id} className="hover:bg-[#171717] transition-colors">
                        {/* Image & Title */}
                        <td className="py-4 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 bg-[#0d0d0d] border border-[#262420] overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-[#f2f0ea]">{product.name}</div>
                              <div className="text-[10px] text-[#85837b] font-mono">/{product.slug}</div>
                            </div>
                          </div>
                        </td>

                        {/* Size & Concentration */}
                        <td className="py-4 px-3">
                          <div className="text-[#a3a099] font-medium">
                            {product.size_ml ? `${product.size_ml} ml` : '35 ml'}
                          </div>
                          <div className="text-[10px] text-[#52504b]">
                            Eau De Parfum
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-3 font-semibold text-[#d4af37]">
                          {formatRupiah(product.price)}
                        </td>

                        {/* Availability Toggle */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailable(product)}
                            disabled={isBusy}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                              product.is_available
                                ? 'border-emerald-800/80 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60'
                                : 'border-neutral-800 bg-neutral-900/40 text-neutral-500 hover:bg-neutral-800/60'
                            }`}
                          >
                            {product.is_available ? (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Tersedia</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                <span>Habis</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-4 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product)}
                            disabled={isBusy}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                              product.is_featured
                                ? 'border-[#d4af37]/80 bg-[#d4af37]/10 text-[#d4af37] hover:bg-[#d4af37]/20'
                                : 'border-neutral-800 bg-neutral-900/40 text-neutral-500 hover:bg-neutral-800/60'
                            }`}
                          >
                            <Star className={`h-3 w-3 ${product.is_featured ? 'fill-[#d4af37]' : ''}`} />
                            <span>{product.is_featured ? 'Ya' : 'Tidak'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/produk/${product.id}/edit`}
                              className="inline-flex items-center gap-1 border border-[#262420] px-2.5 py-1 text-[11px] text-[#a3a099] hover:text-[#d4af37] hover:border-[#d4af37]/50 transition-colors"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={isBusy}
                              className="inline-flex items-center gap-1 border border-[#262420] px-2.5 py-1 text-[11px] text-[#a3a099] hover:text-red-400 hover:border-red-900/60 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
