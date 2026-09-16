'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  Loader2,
  Sparkles,
  Save,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { generateSlug, validateProductData } from '@/lib/utils';

export default function TambahProdukBaruPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>(20000);
  const [sizeMl, setSizeMl] = useState<number | ''>(35);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(val));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Ukuran foto maksimal 5MB' }));
      return;
    }

    setImageFile(file);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setErrors({});

    const formData = {
      name,
      slug,
      description,
      price: price === '' ? 0 : Number(price),
      size_ml: sizeMl === '' ? undefined : Number(sizeMl),
      category: null,
      is_available: isAvailable,
      is_featured: isFeatured,
      image_file: imageFile,
    };

    const validation = validateProductData(formData, false);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setGeneralError('Harap periksa kolom yang ditandai merah di bawah.');
      return;
    }

    if (!imageFile) {
      setErrors((prev) => ({ ...prev, image: 'Foto utama produk wajib diunggah' }));
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // 1. Upload foto ke Supabase Storage bucket 'product-images'
      const fileExt = imageFile.name.split('.').pop() || 'jpg';
      const storagePath = `${Date.now()}-${slug}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(storagePath, imageFile, {
          contentType: imageFile.type,
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
      }

      // 2. Dapatkan public URL dari foto yang baru diunggah
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(uploadData.path);

      // 3. Simpan record produk ke tabel products
      const { error: insertError } = await supabase.from('products').insert({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price: Math.round(Number(price)),
        size_ml: sizeMl === '' ? null : Math.round(Number(sizeMl)),
        category: null,
        image_url: publicUrl,
        is_available: isAvailable,
        is_featured: isFeatured,
      });

      if (insertError) {
        if (insertError.message.includes('unique') || insertError.message.includes('slug')) {
          setErrors((prev) => ({ ...prev, slug: 'Slug URL ini sudah digunakan oleh produk lain.' }));
        }
        throw new Error(insertError.message);
      }

      // Berhasil, kembali ke dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGeneralError(`Terjadi kesalahan: ${msg}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f2f0ea] py-10">
      <div className="mx-auto max-w-3xl px-6">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#85837b] hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 border-b border-[#262420] pb-6">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#d4af37] font-semibold block">
            Katalog Produk
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f2f0ea]">
            Tambah Varian Parfum Baru
          </h1>
          <p className="text-xs text-[#85837b] mt-1">
            Isi rincian aroma, harga, dan unggah foto kemasan parfum.
          </p>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div className="mb-6 flex items-start gap-3 border border-red-900/60 bg-red-950/40 p-4 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1 leading-relaxed">{generalError}</div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="border border-[#262420] bg-[#141414] p-8 space-y-6">
          {/* 1. Nama & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
                Nama Varian Parfum <span className="text-[#d4af37]">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Romanwish"
                className={`w-full border bg-[#0d0d0d] px-3.5 py-2.5 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500' : 'border-[#262420] focus:border-[#d4af37]'
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="slug" className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
                  Slug URL <span className="text-[#d4af37]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSlug(generateSlug(name))}
                  className="inline-flex items-center gap-1 text-[10px] text-[#d4af37] hover:underline"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>Auto-generate</span>
                </button>
              </div>
              <input
                id="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="romanwish"
                className={`w-full border bg-[#0d0d0d] px-3.5 py-2.5 text-xs font-mono text-[#f2f0ea] placeholder-[#52504b] focus:outline-none transition-colors ${
                  errors.slug ? 'border-red-500' : 'border-[#262420] focus:border-[#d4af37]'
                }`}
              />
              {errors.slug && <p className="text-[11px] text-red-400">{errors.slug}</p>}
            </div>
          </div>

          {/* 2. Harga & Ukuran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
                Harga (Rupiah) <span className="text-[#d4af37]">*</span>
              </label>
              <input
                id="price"
                type="number"
                min="1000"
                step="1000"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="20000"
                className={`w-full border bg-[#0d0d0d] px-3.5 py-2.5 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:outline-none transition-colors ${
                  errors.price ? 'border-red-500' : 'border-[#262420] focus:border-[#d4af37]'
                }`}
              />
              {errors.price && <p className="text-[11px] text-red-400">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="sizeMl" className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
                Ukuran Botol (ml)
              </label>
              <input
                id="sizeMl"
                type="number"
                min="1"
                value={sizeMl}
                onChange={(e) => setSizeMl(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="35"
                className="w-full border border-[#262420] bg-[#0d0d0d] px-3.5 py-2.5 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3. Deskripsi & Notes */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
              Deskripsi & Karakter Aroma <span className="text-[#d4af37]">*</span>
            </label>
            <textarea
              id="description"
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="<p>Aroma feminin, manis, lembut dan romantis...</p>"
              className={`w-full border bg-[#0d0d0d] p-3.5 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:outline-none transition-colors ${
                errors.description ? 'border-red-500' : 'border-[#262420] focus:border-[#d4af37]'
              }`}
            />
            {errors.description && <p className="text-[11px] text-red-400">{errors.description}</p>}
            <p className="text-[11px] text-[#52504b]">
              Bisa menyertakan tag HTML dasar seperti &lt;p&gt;, &lt;strong&gt;, &lt;br/&gt;.
            </p>
          </div>

          {/* 4. Upload Foto Produk */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium">
              Foto Produk (Supabase Storage) <span className="text-[#d4af37]">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8">
                <label
                  htmlFor="product-image"
                  className={`flex flex-col items-center justify-center border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    errors.image
                      ? 'border-red-500/80 bg-red-950/20'
                      : 'border-[#262420] hover:border-[#d4af37] bg-[#0d0d0d]'
                  }`}
                >
                  <Upload className="h-6 w-6 text-[#85837b] mb-2" />
                  <span className="text-xs text-[#f2f0ea] font-medium">
                    {imageFile ? imageFile.name : 'Pilih file gambar untuk diunggah'}
                  </span>
                  <span className="text-[10px] text-[#52504b] mt-1">
                    Format JPG, PNG, atau WEBP (Maksimal 5MB)
                  </span>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                {errors.image && <p className="text-[11px] text-red-400 mt-1">{errors.image}</p>}
              </div>

              {/* Image Preview */}
              <div className="sm:col-span-4 flex items-center justify-center">
                <div className="relative h-32 w-32 bg-[#0d0d0d] border border-[#262420] overflow-hidden flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Pratinjau Foto"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-[#52504b] text-center px-2">
                      Belum ada foto dipilih
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Toggles: Tersedia & Unggulan */}
          <div className="pt-4 border-t border-[#262420] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 border border-[#262420] bg-[#0d0d0d] cursor-pointer hover:border-[#d4af37]/40 transition-colors">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="h-4 w-4 rounded accent-[#d4af37]"
              />
              <div>
                <span className="text-xs font-medium text-[#f2f0ea] block">Tersedia untuk Dipesan</span>
                <span className="text-[10px] text-[#85837b]">Tampilkan di katalog belanja publik</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border border-[#262420] bg-[#0d0d0d] cursor-pointer hover:border-[#d4af37]/40 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 rounded accent-[#d4af37]"
              />
              <div>
                <span className="text-xs font-medium text-[#f2f0ea] block">Varian Populer (Unggulan)</span>
                <span className="text-[10px] text-[#85837b]">Tampilkan di beranda depan</span>
              </div>
            </label>
          </div>

          {/* 6. Action Buttons */}
          <div className="pt-6 border-t border-[#262420] flex items-center justify-end gap-3">
            <Link
              href="/admin/dashboard"
              className="border border-[#262420] px-5 py-2.5 text-xs uppercase tracking-wider text-[#a3a099] hover:text-[#f2f0ea] transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#d4af37] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan ke Supabase...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Produk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
