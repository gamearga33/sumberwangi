import React from 'react';
import { RefreshCw, ArrowUpRight } from 'lucide-react';
import { getWhatsAppConsultationUrl } from '@/lib/whatsapp';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showWhatsAppFallback?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Tidak dapat memuat produk',
  message = 'Daftar produk sedang tidak dapat diakses saat ini. Silakan coba sesaat lagi atau hubungi kami langsung.',
  onRetry,
  showWhatsAppFallback = true,
}) => {
  return (
    <div className="mx-auto my-12 max-w-lg border border-[#262420] bg-[#141414] p-8 text-center">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#d4af37]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-[#a3a099]">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 border border-[#d4af37] px-4 py-2 text-xs uppercase tracking-wider text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0d0d] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Coba Lagi</span>
          </button>
        )}

        {showWhatsAppFallback && (
          <a
            href={getWhatsAppConsultationUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-[#d4af37] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0d0d0d] hover:bg-[#e8c96c] transition-colors"
          >
            <span>Hubungi WhatsApp</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};
