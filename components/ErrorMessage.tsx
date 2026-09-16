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
    <div className="mx-auto my-12 max-w-lg border border-[#e8e6df] bg-white p-8 text-center">
      <h3 className="text-sm font-medium uppercase tracking-wider text-[#141413]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-relaxed text-[#706f6a]">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 border border-[#141413] px-4 py-2 text-xs uppercase tracking-wider text-[#141413] hover:bg-[#141413] hover:text-white transition-colors cursor-pointer"
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
            className="inline-flex items-center gap-1 bg-[#141413] px-4 py-2 text-xs uppercase tracking-wider text-white hover:bg-[#282826] transition-colors"
          >
            <span>Hubungi WhatsApp</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};
