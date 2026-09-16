export type ProductCategory = 'Pria' | 'Wanita' | 'Unisex';

export interface Product {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  size_ml?: number;
  image: string;
  image_gallery?: string[];
  category?: ProductCategory;
  is_available: boolean;
  is_featured?: boolean;
  created: string;
  updated: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  size_ml?: number;
  category?: ProductCategory;
  is_available: boolean;
  is_featured?: boolean;
  image?: File | null;
  image_gallery?: File[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
