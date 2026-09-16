import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseUrl, getSupabaseAnonKey } from './utils';

/**
 * Supabase client untuk Server Components, Server Actions, dan Route Handlers
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

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
