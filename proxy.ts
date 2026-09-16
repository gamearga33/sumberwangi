import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Proteksi autentikasi hanya diperlukan untuk rute panel admin (/admin/*).
     * Rute publik (/, /produk, /tentang, /api/*) bebas dari overhead middleware,
     * sehingga dapat disajikan instan langsung dari Vercel Edge Cache tanpa memotong kuota Edge Middleware.
     */
    '/admin',
    '/admin/:path*',
  ],
};
