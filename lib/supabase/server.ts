import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function cleanSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

/**
 * Supabase client untuk Server Components, Server Actions, dan Route Handlers
 */
export async function createClient() {
  const cookieStore = await cookies();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseUrl = cleanSupabaseUrl(rawUrl);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Method `setAll` dipanggil dari Server Component.
          // Hal ini aman diabaikan karena session diperbarui oleh middleware.
        }
      },
    },
  });
}
