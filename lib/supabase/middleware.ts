import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseUrl, getSupabaseAnonKey } from './utils';

/**
 * Memperbarui auth session Supabase dan memproteksi route admin
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  // Jika URL Supabase belum diisi credential asli (masih placeholder)
  const isPlaceholderConfig =
    supabaseUrl === 'https://placeholder.supabase.co' ||
    supabaseAnonKey === 'placeholder-anon-key' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const normalizedPath = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  const isAccessingAdmin = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/');
  const isLoginPage = normalizedPath === '/admin/login';

  // Jika bukan rute admin, kembalikan response langsung tanpa memanggil auth API Supabase
  if (!isAccessingAdmin) {
    return supabaseResponse;
  }

  if (isPlaceholderConfig) {
    if (isAccessingAdmin && !isLoginPage) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Wajib panggil getUser() untuk me-refresh token session rute admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Jika mengakses /admin atau /admin/ secara langsung, arahkan ke dashboard jika login atau login jika belum
  if (normalizedPath === '/admin') {
    const url = new URL(user ? '/admin/dashboard' : '/admin/login', request.url);
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Proteksi route admin
  if (isAccessingAdmin && !isLoginPage && !user) {
    const url = new URL('/admin/login', request.url);
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Jika sudah login tapi mengakses /admin/login, redirect ke dashboard
  if (isLoginPage && user) {
    const url = new URL('/admin/dashboard', request.url);
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
