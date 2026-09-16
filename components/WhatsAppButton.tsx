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
  const url =
    isConsultation || !productName || price === undefined
      ? getWhatsAppConsultationUrl()
      : getWhatsAppOrderUrl({ productName, price });

  const defaultLabel = isConsultation
    ? 'Konsultasi WhatsApp'
    : label || 'Pesan via WhatsApp';

  // Minimalist modern styling
  const variantStyles = {
    primary:
      'bg-[#141413] text-[#fbfbf9] hover:bg-[#2c2b28] transition-colors font-medium',
    secondary:
      'bg-[#2c2b28] text-white hover:bg-[#141413] transition-colors font-medium',
    outline:
      'border border-[#141413] text-[#141413] hover:bg-[#141413] hover:text-[#fbfbf9] transition-colors font-medium',
    compact:
      'bg-[#141413] text-[#fbfbf9] hover:bg-[#2c2b28] transition-colors font-medium text-xs px-3 py-1.5',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-2 gap-1.5',
    md: 'text-xs uppercase tracking-wider px-5 py-3 gap-2',
    lg: 'text-xs uppercase tracking-wider px-7 py-3.5 gap-2.5 font-medium',
  };

  const currentSize = variant === 'compact' ? '' : sizeStyles[size];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center select-none cursor-pointer text-center transition-all duration-150 ${variantStyles[variant]} ${currentSize} ${className}`}
      aria-label={`${defaultLabel} ${productName ? `untuk ${productName}` : ''}`}
    >
      <MessageCircle
        className={
          variant === 'compact'
            ? 'w-3.5 h-3.5'
            : size === 'lg'
            ? 'w-4 h-4'
            : 'w-3.5 h-3.5'
        }
      />
      <span>{defaultLabel}</span>
    </a>
  );
};
