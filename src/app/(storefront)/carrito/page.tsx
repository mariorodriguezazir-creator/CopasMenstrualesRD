'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="rounded-full bg-surface-container p-5 mb-5">
            <ShoppingBag className="h-10 w-10 text-on-surface-variant" />
          </div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">
            Tu carrito está vacío
          </h1>
          <p className="mt-3 text-on-surface-variant max-w-sm">
            Agregá productos desde nuestro catálogo para empezar tu compra.
          </p>
          <Link
            href="/"
            className="mt-6 rounded-xl gradient-primary px-8 py-3 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
        Mi Carrito
      </h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Paso 1 de 3 — Revisá tus productos
      </p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId ?? 'default'}`}
            className="flex gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
          >
            {/* Image */}
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container shrink-0">
              <Image
                src={item.image || '/placeholder-product.png'}
                alt={item.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-on-surface text-sm truncate">
                {item.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-bold text-primary">
                  RD${item.finalPrice.toLocaleString('es-DO')}
                </span>
                {item.finalPrice !== item.price && (
                  <span className="text-xs text-on-surface-variant line-through">
                    RD${item.price.toLocaleString('es-DO')}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1, item.variantId)
                  }
                  className="rounded-md bg-surface-container p-1 text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-on-surface">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1, item.variantId)
                  }
                  disabled={item.quantity >= item.maxStock}
                  className="rounded-md bg-surface-container p-1 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Total + Remove */}
            <div className="flex flex-col items-end justify-between">
              <span className="text-sm font-bold text-on-surface">
                RD${(item.finalPrice * item.quantity).toLocaleString('es-DO')}
              </span>
              <button
                onClick={() => removeItem(item.productId, item.variantId)}
                className="p-1.5 rounded-md text-error/60 hover:text-error hover:bg-error-container/20 transition-colors"
                aria-label={`Eliminar ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-xl bg-surface-container p-5">
        <div className="flex justify-between items-center">
          <span className="text-on-surface-variant">Subtotal</span>
          <span className="text-lg font-bold text-on-surface">
            RD${subtotal.toLocaleString('es-DO')}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-8 py-3.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          Continuar al checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
