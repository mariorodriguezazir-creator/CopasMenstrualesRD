import { WHATSAPP_NUMBER } from '@/lib/constants';

/**
 * Generate a pre-filled WhatsApp URL with the order ID.
 * Uses wa.me format compatible with RD (+1 NANP country code).
 */
export function generateWhatsAppURL(orderId: string): string {
  const message = `Mi número de orden es ${orderId}`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Generate a WhatsApp URL for a custom message.
 */
export function generateWhatsAppCustomURL(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
