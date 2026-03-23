export const WHATSAPP_NUMBER = '18094670365';
export const WHATSAPP_URL_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

export const BUSINESS_HOURS = {
  weekdays: '9:00 AM - 6:00 PM',
  saturday: '9:00 AM - 2:00 PM',
  sunday: 'Cerrado',
} as const;

export const PAYMENT_METHODS = {
  paypal: 'PayPal',
  transfer: 'Transferencia Bancaria',
  cod: 'Contra Entrega',
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;

export const ZONE_TYPES = {
  plaza: 'Plaza / Centro Comercial',
  avenida: 'Avenida',
  sector: 'Sector',
} as const;

export type ZoneType = keyof typeof ZONE_TYPES;

export const PAYMENT_STATUS = {
  PAID: 'PAID',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PENDING_COD: 'PENDING_COD',
  CONFIRMED: 'CONFIRMED',
} as const;

export type PaymentStatus = keyof typeof PAYMENT_STATUS;

export const SITE_CONFIG = {
  name: 'CopasMenstrualesRD',
  description: 'Tu copa menstrual ideal, entregada en Santo Domingo',
  url: 'https://copasmenstrualesrd.com',
} as const;
