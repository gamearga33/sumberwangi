import { publicSupabase } from './supabase/public';
import { Product } from './types';

/**
 * Mendapatkan URL lengkap gambar produk dari Supabase Storage atau fallback file lokal.
 */
export function getProductImageUrl(
  product?: Pick<Product, 'image_url' | 'slug'> | { image_url?: string; slug?: string } | null
): string {
  if (!product) {
    return '/images/logo.png';
  }

  const url = product.image_url;
  if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'))) {
    return url;
  }

  if (product.slug) {
    return `/images/products/${product.slug}.jpg`;
  }

  return '/images/logo.png';
}

/**
 * Cek apakah kredensial Supabase sudah terisi dan bukan nilai placeholder
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes('placeholder') || anonKey.includes('placeholder')) return false;

  return true;
}

/**
 * Fetch semua produk yang tersedia (is_available = true) untuk halaman publik.
 * Dilengkapi try-catch dan pesan ramah untuk graceful degradation.
 */
export async function getAvailableProducts(category?: string): Promise<{
  data: Product[];
  error: string | null;
}> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: [],
        error: 'Koneksi Supabase belum dikonfigurasi. Silakan lengkapi environment variables.',
      };
    }

    let query = publicSupabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (category && category !== 'Semua') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Supabase Error] Gagal mengambil daftar produk:', error.message);
      return {
        data: [],
        error: 'Produk sedang tidak dapat dimuat saat ini. Silakan coba beberapa saat lagi.',
      };
    }

    return {
      data: (data as Product[]) || [],
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Supabase Error] Gagal mengambil daftar produk:', message);
    return {
      data: [],
      error: 'Produk sedang tidak dapat dimuat saat ini. Silakan coba beberapa saat lagi.',
    };
  }
}

/**
 * Fetch produk unggulan / populer untuk Homepage (is_featured = true)
 */
export async function getFeaturedProducts(limit = 8): Promise<{
  data: Product[];
  error: string | null;
}> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: [],
        error: 'Koneksi Supabase belum dikonfigurasi. Silakan lengkapi environment variables.',
      };
    }

    // 1. Coba ambil produk yang dipilih manual sebagai unggulan/populer
    const { data: featuredData, error: featuredErr } = await publicSupabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (featuredErr) {
      console.error('[Supabase Error] Gagal mengambil produk unggulan:', featuredErr.message);
    }

    if (featuredData && featuredData.length > 0) {
      return {
        data: featuredData as Product[],
        error: null,
      };
    }

    // 2. Fallback: jika belum ada produk yang dicentang is_featured, ambil produk aktif terbaru
    const { data: fallbackData, error: fallbackErr } = await publicSupabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fallbackErr) {
      console.error('[Supabase Error] Gagal mengambil produk fallback:', fallbackErr.message);
      return {
        data: [],
        error: 'Produk unggulan sedang tidak dapat dimuat saat ini.',
      };
    }

    return {
      data: (fallbackData as Product[]) || [],
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Supabase Error] Gagal mengambil produk unggulan:', message);
    return {
      data: [],
      error: 'Produk unggulan sedang tidak dapat dimuat saat ini.',
    };
  }
}

/**
 * Fetch detail satu produk berdasarkan slug unik
 */
export async function getProductBySlug(slug: string): Promise<{
  data: Product | null;
  error: string | null;
}> {
  try {
    if (!isSupabaseConfigured()) {
      return {
        data: null,
        error: 'Koneksi Supabase belum dikonfigurasi.',
      };
    }

    const { data, error } = await publicSupabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      // Postgres single() code PGRST116 indicates row not found
      if (error.code === 'PGRST116') {
        return {
          data: null,
          error: null,
        };
      }
      console.error(`[Supabase Error] Gagal mengambil detail produk [${slug}]:`, error.message);
      return {
        data: null,
        error: 'Detail produk tidak dapat diakses saat ini.',
      };
    }

    return {
      data: data as Product,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Supabase Error] Gagal mengambil detail produk [${slug}]:`, message);
    return {
      data: null,
      error: 'Detail produk tidak dapat diakses saat ini.',
    };
  }
}
