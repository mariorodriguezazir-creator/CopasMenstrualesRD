import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { applyDiscount, isPromotionActive } from '@/lib/utils/price';
import type { Promotion } from '@/types';

export async function GET() {
  const supabase = await createClient();

  // Fetch active products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, description, price, images, stock, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (productsError) {
    return NextResponse.json(
      { error: 'Error al cargar productos' },
      { status: 500 }
    );
  }

  // Fetch active promotions
  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true);

  // Compute final prices server-side — NEVER expose discount logic
  const productsWithPrices = (products ?? []).map((product) => {
    const activePromo = (promotions ?? []).find(
      (promo: Promotion) =>
        promo.product_ids.includes(product.id) && isPromotionActive(promo)
    );

    const { finalPrice, originalPrice, hasPromotion } = applyDiscount(
      product.price,
      activePromo ?? null
    );

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      stock: product.stock,
      is_active: product.is_active,
      created_at: product.created_at,
      price: finalPrice,
      original_price: hasPromotion ? originalPrice : null,
      has_promotion: hasPromotion,
      // NEVER return: discount_value, discount_type, promo details
    };
  });

  return NextResponse.json(productsWithPrices);
}
