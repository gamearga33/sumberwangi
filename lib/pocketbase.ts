import PocketBase, { ClientResponseError } from 'pocketbase';
import { Product } from './types';

// Default PocketBase URL
const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

/**
 * Buat instance PocketBase client dengan autoCancellation nonaktif
 * agar kompatibel dengan server-side fetching Next.js
 */
export function getPocketBaseClient(): PocketBase {
  const client = new PocketBase(PB_URL);
  client.autoCancellation(false);
  return client;
}

export const pb = getPocketBaseClient();

/**
 * Mendapatkan URL lengkap untuk gambar produk dari file storage PocketBase.
 * Jika file PocketBase tidak tersedia, gunakan fallback file lokal atau placeholder.
 */
export function getProductImageUrl(
  product: Pick<Product, 'id' | 'collectionId' | 'collectionName' | 'image' | 'slug'>,
  filename?: string,
  thumb?: string
): string {
  const file = filename || product.image;
  if (!file) {
    return `/images/products/${product.slug}.jpg`;
  }

  // Jika file berupa full URL (misalnya external URL)
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('/')) {
    return file;
  }

  try {
    const client = getPocketBaseClient();
    // Gunakan helper bawaan pb.files.getURL dengan type casting aman
    return client.files.getURL(
      product as unknown as Parameters<typeof client.files.getURL>[0],
      file,
      thumb ? { thumb } : undefined
    );
  } catch {
    return `/images/products/${product.slug}.jpg`;
  }
}

/**
 * Fetch semua produk yang tersedia (is_available = true)
 * Dilengkapi try-catch dan pesan ramah untuk graceful degradation.
 */
export async function getAvailableProducts(category?: string): Promise<{
  data: Product[];
  error: string | null;
}> {
  try {
    const client = getPocketBaseClient();
    let filter = 'is_available = true';
    if (category && category !== 'Semua') {
      filter += ` && category = "${category}"`;
    }

    const records = await client.collection('products').getFullList<Product>({
      filter,
      sort: '-created',
      requestKey: null,
    });

    return {
      data: records,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[PocketBase Error] Gagal mengambil daftar produk:', message);
    return {
      data: [],
      error: 'Produk sedang tidak dapat dimuat saat ini. Silakan coba beberapa saat lagi.',
    };
  }
}

/**
 * Fetch produk unggulan / populer untuk Homepage (berdasarkan is_featured = true yang dipilih manual oleh owner)
 */
export async function getFeaturedProducts(limit = 8): Promise<{
  data: Product[];
  error: string | null;
}> {
  try {
    const client = getPocketBaseClient();
    // 1. Coba ambil produk yang dipilih manual sebagai unggulan/populer
    let records = await client.collection('products').getList<Product>(1, limit, {
      filter: 'is_available = true && is_featured = true',
      sort: '-created',
      requestKey: null,
    });

    // 2. Fallback: jika belum ada produk yang dicentang is_featured, tampilkan produk aktif terbaru
    if (records.items.length === 0) {
      records = await client.collection('products').getList<Product>(1, limit, {
        filter: 'is_available = true',
        sort: '-created',
        requestKey: null,
      });
    }

    return {
      data: records.items,
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[PocketBase Error] Gagal mengambil produk unggulan:', message);
    return {
      data: [],
      error: 'Produk unggulan sedang tidak dapat dimuat saat ini.',
    };
  }
}

/**
 * Fetch detail satu produk berdasarkan slug yang unik
 */
export async function getProductBySlug(slug: string): Promise<{
  data: Product | null;
  error: string | null;
}> {
  try {
    const client = getPocketBaseClient();
    const record = await client.collection('products').getFirstListItem<Product>(`slug = "${slug}"`, {
      requestKey: null,
    });

    return {
      data: record,
      error: null,
    };
  } catch (err: unknown) {
    if (err instanceof ClientResponseError && err.status === 404) {
      return {
        data: null,
        error: null,
      };
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error(`[PocketBase Error] Gagal mengambil detail produk [${slug}]:`, message);
    return {
      data: null,
      error: 'Detail produk tidak dapat diakses saat ini.',
    };
  }
}
