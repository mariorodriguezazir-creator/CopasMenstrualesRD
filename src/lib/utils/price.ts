import type { Promotion } from '@/types';

/**
 * Calculate the final price after applying a promotion discount.
 * This function runs SERVER-SIDE ONLY — never expose discount logic to the client.
 */
export function applyDiscount(
  originalPrice: number,
  promotion: Promotion | null
): { finalPrice: number; originalPrice: number; hasPromotion: boolean } {
  if (!promotion || !isPromotionActive(promotion)) {
    return {
      finalPrice: originalPrice,
      originalPrice,
      hasPromotion: false,
    };
  }

  let finalPrice: number;

  if (promotion.discount_type === 'percentage') {
    const discountAmount = (originalPrice * promotion.discount_value) / 100;
    finalPrice = originalPrice - discountAmount;
  } else {
    // Fixed discount
    finalPrice = originalPrice - promotion.discount_value;
  }

  // Ensure price never goes below 0
  finalPrice = Math.max(0, Math.round(finalPrice * 100) / 100);

  return {
    finalPrice,
    originalPrice,
    hasPromotion: true,
  };
}

/**
 * Check if a promotion is currently active based on dates and is_active flag.
 */
export function isPromotionActive(promotion: Promotion): boolean {
  if (!promotion.is_active) return false;

  const now = new Date();
  const start = new Date(promotion.start_date);
  const end = new Date(promotion.end_date);

  // Set end date to end of day
  end.setHours(23, 59, 59, 999);

  return now >= start && now <= end;
}

/**
 * Calculate order totals from items with prices.
 */
export function calculateOrderTotal(
  items: { finalPrice: number; quantity: number }[]
): { subtotal: number; total: number } {
  const subtotal = items.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(subtotal * 100) / 100,
  };
}
