'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Jika sudah memiliki sesi aktif, arahkan langsung ke dashboard
  React.useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Hard navigation diperlukan agar seluruh cookie sesi Supabase terkirim utuh ke middleware server
          window.location.href = '/admin/dashboard';
        }
      });
    } catch {
      // Abaikan jika konfigurasi belum lengkap
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('Email atau kata sandi salah. Silakan periksa kembali.');
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          setErrorMessage(
            'Email belum dikonfirmasi di Supabase. Silakan buka menu Authentication → Users di Dashboard Supabase, dan pastikan centang "Auto Confirm User?" saat menambahkan user.'
          );
        } else if (error.message.includes('fetch')) {
          setErrorMessage(
            'Gagal menghubungi server Supabase. Pastikan koneksi internet aktif dan restart server development lokal (npm run dev).'
          );
        } else {
          setErrorMessage(error.message);
        }
        setIsLoading(false);
        return;
      }

      if (!data?.session) {
        setErrorMessage(
          'Sesi login tidak terbentuk. Pastikan akun admin telah berstatus confirmed di Supabase.'
        );
        setIsLoading(false);
        return;
      }

      // Login berhasil: gunakan window.location.href agar seluruh cookie sesi terkirim segar ke middleware server
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Hard navigation diperlukan agar seluruh cookie sesi Supabase terkirim utuh ke middleware server
      window.location.href = '/admin/dashboard';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`Terjadi kesalahan sistem: ${msg}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-[#0a0a0a] text-[#f2f0ea]">
      <div className="w-full max-w-md space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#85837b] hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda Website</span>
          </Link>
        </div>

        {/* Card Header with Logo */}
        <div className="text-center space-y-3">
          <div className="mx-auto relative h-16 w-16">
            <Image
              src="/images/logo.png"
              alt="Logo Sumber Wangi"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
              Panel Pengelola
            </span>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#f2f0ea]">
              Masuk Admin
            </h1>
            <p className="mt-1 text-xs text-[#85837b]">
              Akses khusus owner dan staf resmi CV Sumber Wangi Madiun Group
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="border border-[#262420] bg-[#141414] p-8 shadow-2xl">
          {(!process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder')) && (
            <div className="mb-6 flex items-start gap-3 border border-amber-900/60 bg-amber-950/30 p-4 text-xs text-amber-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong className="text-amber-300">Supabase belum dikonfigurasi.</strong> Harap lengkapi <code className="text-[#d4af37]">NEXT_PUBLIC_SUPABASE_URL</code> dan <code className="text-[#d4af37]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di <code className="text-[#d4af37]">.env.local</code> dengan Project URL dan Anon Key dari Dashboard Supabase Anda sebelum masuk.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 border border-red-900/60 bg-red-950/40 p-4 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium"
              >
                Alamat Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#52504b]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sumberwangi.com"
                  className="w-full border border-[#262420] bg-[#0d0d0d] py-3 pl-10 pr-3 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:border-[#d4af37] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-wider text-[#a3a099] font-medium"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#52504b]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-[#262420] bg-[#0d0d0d] py-3 pl-10 pr-3 text-xs text-[#f2f0ea] placeholder-[#52504b] focus:border-[#d4af37] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-[#d4af37] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e2bd46] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-[#52504b]">
          Sesi admin diamankan dengan otentikasi Supabase Auth & Row Level Security.
        </p>
      </div>
    </div>
  );
}
