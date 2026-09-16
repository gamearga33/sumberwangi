/**
 * Normalisasi URL Supabase agar selalu berformat https://<project-ref>.supabase.co
 * Menghapus whitespace, trailing slashes, dan suffix endpoint REST seperti /rest/v1 atau /rest/v1/
 */
export function cleanSupabaseUrl(url?: string | null): string {
  if (!url) return '';
  return url
    .trim()
    .replace(/\/rest\/v1\/?$/, '')
    .replace(/\/+$/, '');
}

/**
 * Mendapatkan Supabase URL yang sudah dinormalisasi dari env
 */
export function getSupabaseUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  return cleanSupabaseUrl(rawUrl) || 'https://placeholder.supabase.co';
}

/**
 * Mendapatkan Supabase anon key dari env
 */
export function getSupabaseAnonKey(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key').trim();
}
