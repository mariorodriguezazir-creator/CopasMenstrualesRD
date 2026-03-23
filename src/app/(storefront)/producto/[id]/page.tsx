import { createClient } from '@/lib/supabase/server';
import { applyDiscount, isPromotionActive } from '@/lib/utils/price';
import { ProductDetail } from '@/components/storefront/ProductDetail';
import { notFound } from 'next/navigation';
import type { Promotion } from '@/types';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
    },
  };
}

async function getProduct(id: string) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !product) return null;

  // Fetch variants
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', id);

  // Fetch active promotions
  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true);

  const activePromo = (promotions ?? []).find(
    (promo: Promotion) =>
      promo.product_ids.includes(product.id) && isPromotionActive(promo)
  );

  const { finalPrice, originalPrice, hasPromotion } = applyDiscount(
    product.price,
    activePromo ?? null
  );

  return {
    ...product,
    price: finalPrice,
    original_price: hasPromotion ? originalPrice : null,
    has_promotion: hasPromotion,
    variants: variants ?? [],
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <ProductDetail product={product} />
    </div>
  );
}
