import { publicSupabase } from './supabase/public';
import { isSupabaseConfigured } from './products';

export interface KeepAlivePingResult {
  connected: boolean;
  sampleId?: string;
  latencyMs: number;
  error?: string;
}

/**
 * Memvalidasi otorisasi pemanggilan cron/keep-alive.
 * Jika CRON_SECRET disetel di environment variable, request wajib menyertakan
 * header `Authorization: Bearer <CRON_SECRET>` atau query parameter `?key=<CRON_SECRET>`.
 * Jika CRON_SECRET tidak disetel, request diizinkan (fleksibel untuk setup awal/gratis).
 */
export function verifyCronAuthorization(
  authHeader: string | null,
  queryKey: string | null,
  cronSecret?: string
): boolean {
  if (!cronSecret || cronSecret.trim() === '') {
    return true;
  }

  const expectedSecret = cronSecret.trim();

  // 1. Cek header Authorization: Bearer <token>
  if (authHeader) {
    const trimmed = authHeader.trim();
    if (trimmed.toLowerCase().startsWith('bearer ')) {
      const token = trimmed.slice(7).trim();
      if (token === expectedSecret) {
        return true;
      }
    }
  }

  // 2. Cek query param ?key=<token>
  if (queryKey && queryKey.trim() === expectedSecret) {
    return true;
  }

  return false;
}

/**
 * Menjalankan query ringan ke database Supabase untuk mereset counter auto-pause 7 hari.
 */
export async function pingSupabaseDatabase(): Promise<KeepAlivePingResult> {
  const startTime = Date.now();

  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      latencyMs: 0,
      error: 'Supabase credentials are not configured or still using placeholders.',
    };
  }

  try {
    // Query seminimal mungkin: hanya 1 kolom dan 1 baris dari tabel products
    const { data, error } = await publicSupabase
      .from('products')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      return {
        connected: false,
        latencyMs,
        error: error.message,
      };
    }

    return {
      connected: true,
      sampleId: data && data.length > 0 ? (data[0].id as string) : undefined,
      latencyMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      latencyMs: Date.now() - startTime,
      error: message,
    };
  }
}
