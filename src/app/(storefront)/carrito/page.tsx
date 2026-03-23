'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Gift } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="rounded-full bg-surface-container p-6 mb-6">
          <ShoppingBag className="h-12 w-12 text-on-surface-variant" />
        </div>
        <h1 className="font-headline text-2xl font-bold text-on-surface text-center">
          Tu carrito está vacío
        </h1>
        <p className="mt-3 text-on-surface-variant max-w-sm text-center">
          Agregá productos desde nuestro catálogo para empezar tu compra.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-xl gradient-primary px-8 py-4 text-sm font-bold text-on-primary shadow-primary-btn hover:opacity-90 transition-all active:scale-95"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const shipping = 95; // Fixed shipping for demo

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 pb-48 md:pb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Link>
          <h1 className="font-headline text-2xl font-bold text-primary">
            Carrito
          </h1>
        </div>
        <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
          Paso 1 de 3
        </span>
      </header>

      {/* Cart Items */}
      <section className="space-y-4 mb-8">
        {items.map((item) => (
          <article
            key={`${item.productId}-${item.variantId ?? 'default'}`}
            className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-editorial"
          >
            {/* Image */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
              <Image
                src={item.image || '/placeholder-product.png'}
                alt={item.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-grow flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-on-surface leading-tight">
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-on-surface-variant/40 hover:text-error transition-colors"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                {item.variantId && (
                  <p className="text-sm text-on-surface-variant">
                    Variante seleccionada
                  </p>
                )}
              </div>

              <div className="flex justify-between items-end mt-2">
                <span className="font-semibold text-primary text-lg">
                  RD$ {item.finalPrice.toLocaleString('es-DO')}
                </span>

                {/* Quantity Controls */}
                <div className="flex items-center bg-surface-container-high rounded-full px-1 py-1 gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.variantId)
                    }
                    className="w-11 h-11 flex items-center justify-center text-primary hover:bg-white rounded-full transition-all active:scale-95"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-on-surface min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.variantId)
                    }
                    disabled={item.quantity >= item.maxStock}
                    className="w-11 h-11 flex items-center justify-center text-primary hover:bg-white rounded-full transition-all disabled:opacity-30 active:scale-95"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Promotion Note */}
      {subtotal >= 1500 && (
        <div className="p-4 bg-surface-container-highest rounded-xl border-l-4 border-primary mb-8">
          <div className="flex gap-3">
            <Gift className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base text-primary">
                ¡Felicidades!
              </h4>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                Tu compra ha calificado para envío gratuito en Santo Domingo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-on-surface font-headline">
          Resumen de orden
        </h2>

        <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-base">Subtotal</span>
            <span className="font-semibold text-on-surface">
              RD$ {subtotal.toLocaleString('es-DO')}
            </span>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-base">Envío estimado</span>
            <span className="font-semibold text-on-surface">
              {subtotal >= 1500 ? 'Gratis' : `RD$ ${shipping}`}
            </span>
          </div>

          <div className="flex justify-between items-center text-on-surface-variant">
            <span className="text-base">Impuestos estimados</span>
            <span className="text-xs font-medium uppercase tracking-tighter">
              (Incluidos)
            </span>
          </div>

          <div className="pt-6 mt-2 border-t border-outline-variant/30 flex justify-between items-center">
            <span className="font-bold text-xl text-on-surface">Total</span>
            <span className="font-semibold text-3xl text-primary tracking-tight">
              RD$ {(subtotal + (subtotal >= 1500 ? 0 : shipping)).toLocaleString('es-DO')}
            </span>
          </div>
        </div>
      </section>

      {/* Payment Methods Preview */}
      <div className="mt-8 flex justify-center gap-6 opacity-40">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z" />
        </svg>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      </div>

      {/* Fixed Footer CTA */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#FFF8F5]/90 backdrop-blur-md pt-4 pb-24 md:pb-8 flex flex-col gap-3 shadow-editorial px-4 z-40">
        <Link
          href="/checkout"
          className="w-full max-w-2xl mx-auto bg-primary text-on-primary font-bold py-4 rounded-xl shadow-primary-btn active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continuar</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
        <p className="text-center text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold">
          Pago 100% seguro y encriptado
        </p>
      </footer>
    </div>
  );
}
