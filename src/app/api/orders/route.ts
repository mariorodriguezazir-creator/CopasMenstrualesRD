import { NextResponse, type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createOrderSchema } from '@/lib/validators/order';
import { applyDiscount, isPromotionActive, calculateOrderTotal } from '@/lib/utils/price';
import type { Promotion } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Datos inválidos' },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    // Fetch products for all items
    const productIds = data.items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true);

    if (productsError || !products || products.length !== data.items.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no están disponibles' },
        { status: 400 }
      );
    }

    // Fetch promotions
    const { data: promotions } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true);

    // Calculate prices server-side
    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;

      const activePromo = (promotions ?? []).find(
        (promo: Promotion) =>
          promo.product_ids.includes(product.id) && isPromotionActive(promo)
      );

      const { finalPrice } = applyDiscount(
        product.price,
        activePromo ?? null
      );

      return {
        productId: product.id,
        variantId: item.variantId,
        name: product.name,
        price: product.price,
        finalPrice,
        quantity: item.quantity,
        image: product.images[0] ?? '',
      };
    });

    const { subtotal, total } = calculateOrderTotal(orderItems);

    // Tampering check: compare server total with client total
    if (Math.abs(total - data.clientTotal) > 0.01) {
      return NextResponse.json(
        { error: 'Total mismatch' },
        { status: 400 }
      );
    }

    // Validate stock
    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Solo quedan ${product.stock} unidades de ${product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate delivery zone for COD
    if (data.paymentMethod === 'cod' && data.deliveryZoneId) {
      const { data: zone, error: zoneError } = await supabase
        .from('delivery_zones')
        .select('id')
        .eq('id', data.deliveryZoneId)
        .eq('is_active', true)
        .single();

      if (zoneError || !zone) {
        return NextResponse.json(
          { error: 'Zona de entrega no válida' },
          { status: 400 }
        );
      }
    }

    // Determine payment status
    let paymentStatus: string;
    switch (data.paymentMethod) {
      case 'paypal':
        paymentStatus = 'PAID';
        break;
      case 'transfer':
        paymentStatus = 'PENDING_PAYMENT';
        break;
      case 'cod':
        paymentStatus = 'PENDING_COD';
        break;
      default:
        paymentStatus = 'PENDING_PAYMENT';
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        contact_email: data.contactEmail,
        delivery_zone_id: data.deliveryZoneId ?? null,
        delivery_reference: data.deliveryReference ?? null,
        items: orderItems,
        subtotal,
        discount: 0,
        total,
        payment_method: data.paymentMethod,
        payment_status: paymentStatus,
      })
      .select('id, payment_method, payment_status, total, created_at')
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 500 }
      );
    }

    // Insert initial status history
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: paymentStatus,
    });

    // Decrement stock
    for (const item of data.items) {
      await supabase.rpc('decrement_stock', {
        p_product_id: item.productId,
        p_quantity: item.quantity,
      }).catch(() => {
        // Fallback: manual decrement
        const product = products.find((p) => p.id === item.productId)!;
        supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', item.productId);
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
