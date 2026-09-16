import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppConsultationUrl, getWhatsAppOrderUrl } from '@/lib/whatsapp';

export interface WhatsAppButtonProps {
  productName?: string;
  price?: number;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isConsultation?: boolean;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  productName,
  price,
  label,
  variant = 'primary',
  size = 'md',
  className = '',
  isConsultation = false,
}) => {
  const url = isConsultation || !productName || price === undefined
    ? getWhatsAppConsultationUrl()
    : getWhatsAppOrderUrl({ productName, price });

  const defaultLabel = isConsultation
    ? 'Konsultasi via WhatsApp'
    : label || 'Pesan via WhatsApp';

  // Styling varian warna
  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all duration-200 active:scale-[0.98]',
    secondary:
      'bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md shadow-amber-950/20 hover:shadow-lg transition-all duration-200 active:scale-[0.98]',
    outline:
      'border border-emerald-600/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-200',
    compact:
      'bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3 py-1.5 rounded-lg transition-all duration-150 active:scale-95',
  };

  // Ukuran tombol
  const sizeStyles = {
    sm: 'text-xs px-3 py-2 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
  };

  const currentSize = variant === 'compact' ? '' : sizeStyles[size];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center select-none cursor-pointer text-center ${variantStyles[variant]} ${currentSize} ${className}`}
      aria-label={`${defaultLabel} ${productName ? `untuk ${productName}` : ''}`}
    >
      <MessageCircle
        className={
          variant === 'compact'
            ? 'w-3.5 h-3.5'
            : size === 'lg'
            ? 'w-5 h-5'
            : size === 'sm'
            ? 'w-4 h-4'
            : 'w-4 h-4'
        }
      />
      <span>{defaultLabel}</span>
    </a>
  );
};
