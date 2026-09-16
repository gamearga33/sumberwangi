export type ProductCategory = 'Pria' | 'Wanita' | 'Unisex';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  size_ml?: number | null;
  image_url: string;
  image_gallery_urls?: string[] | null;
  category?: ProductCategory | null;
  is_available: boolean;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  size_ml?: number | null;
  category?: ProductCategory | null;
  is_available: boolean;
  is_featured?: boolean;
  image_url?: string;
  image_file?: File | null;
  image?: File | null; // Dukungan backward compatibility test
  image_gallery_urls?: string[];
  image_gallery_files?: File[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
