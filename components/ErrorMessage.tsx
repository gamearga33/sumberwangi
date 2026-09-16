import React from 'react';
import { AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showWhatsAppFallback?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Gagal Memuat Produk',
  message = 'Katalog produk sedang tidak dapat dimuat saat ini. Silakan periksa koneksi Anda atau hubungi kami langsung.',
  onRetry,
  showWhatsAppFallback = true,
}) => {
  return (
    <div className="mx-auto my-8 max-w-lg rounded-2xl border border-amber-200/60 bg-amber-50/50 p-6 text-center backdrop-blur-sm dark:border-amber-900/40 dark:bg-stone-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
        <AlertCircle className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </button>
        )}

        {showWhatsAppFallback && (
          <a
            href={getWhatsAppConsultationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Tanya via WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
};
