import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getSupabaseUrl, getSupabaseAnonKey } from './utils';

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

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
