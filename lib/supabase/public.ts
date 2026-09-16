import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function cleanSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseUrl = cleanSupabaseUrl(rawUrl);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Public Supabase client untuk query data publik tanpa sentuhan cookie.
 * Aman digunakan pada generateStaticParams, ISR, dan SSG Next.js.
 */
export const publicSupabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
