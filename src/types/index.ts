import type { PaymentMethod, PaymentStatus } from '@/lib/constants';

// ── Product Types ──────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  is_active: boolean;
  created_at: string;
  // Computed server-side
  final_price?: number;
  original_price?: number;
  has_promotion?: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  price_override: number | null;
}

// ── Cart Types ──────────────────────────────────────────
export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  finalPrice: number;
  image: string;
  quantity: number;
  maxStock: number;
  size?: string;
  color?: string;
}

// ── Order Types ─────────────────────────────────────────
export interface CreateOrderPayload {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  paymentMethod: PaymentMethod;
  deliveryZoneId?: string;
  deliveryReference?: string;
  clientTotal: number;
}

export interface Order {
  id: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  delivery_zone_id: string | null;
  delivery_reference: string | null;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  whatsapp_notified: boolean;
  notes: string | null;
  created_at: string;
}

// ── Promotion Types ────────────────────────────────────
export interface Promotion {
  id: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product_ids: string[];
}

// ── Delivery Zone Types ─────────────────────────────────
export interface DeliveryZone {
  id: string;
  name: string;
  zone_type: 'plaza' | 'avenida' | 'sector';
  is_active: boolean;
  created_at: string;
}
