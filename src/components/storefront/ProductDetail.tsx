'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag, ChevronLeft, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import Link from 'next/link';
import type { ProductVariant } from '@/types';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price: number | null;
    has_promotion: boolean;
    images: string[];
    stock: number;
    variants: ProductVariant[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name + (selectedVariant ? ` - ${selectedVariant.size}` : ''),
      price: product.original_price ?? product.price,
      finalPrice: selectedVariant?.price_override ?? product.price,
      image: product.images[0] ?? '',
      quantity,
      maxStock: currentStock,
      size: selectedVariant?.size,
      color: selectedVariant?.color ?? undefined,
    });

    toast.success(`${product.name} agregado al carrito`, {
      description: `${quantity} unidad${quantity > 1 ? 'es' : ''}`,
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container">
            <Image
              src={product.images[selectedImage] ?? '/placeholder-product.png'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.has_promotion && (
              <span className="absolute top-4 left-4 rounded-full gradient-primary px-4 py-1.5 text-xs font-semibold text-on-primary">
                Oferta
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all ${
                    selectedImage === idx
                      ? 'ring-2 ring-primary ring-offset-2'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              RD${product.price.toLocaleString('es-DO')}
            </span>
            {product.has_promotion && product.original_price && (
              <span className="text-lg text-on-surface-variant line-through">
                RD${product.original_price.toLocaleString('es-DO')}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-on-surface-variant leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-on-surface mb-3">
                Talla
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'gradient-primary text-on-primary shadow-ambient'
                        : variant.stock === 0
                          ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed line-through'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {variant.size}
                    {variant.color ? ` · ${variant.color}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-on-surface mb-3">
              Cantidad
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-lg bg-surface-container p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold text-on-surface">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                disabled={quantity >= currentStock}
                className="rounded-lg bg-surface-container p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="text-xs text-on-surface-variant">
                {currentStock} disponible{currentStock !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Stock indicator */}
          {currentStock > 0 && currentStock <= 5 && (
            <p className="mt-3 text-sm text-error font-medium">
              ¡Solo quedan {currentStock} unidad{currentStock !== 1 ? 'es' : ''}!
            </p>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-8 flex items-center justify-center gap-2 rounded-xl gradient-primary px-8 py-4 text-base font-semibold text-on-primary shadow-ambient transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-5 w-5" />
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>

          {/* Trust indicators */}
          <div className="mt-8 intimacy-note">
            <p className="text-sm text-on-surface font-medium">
              🌿 Ecológica y segura
            </p>
            <p className="mt-1 text-xs text-on-surface-variant leading-relaxed">
              Silicona médica hipoalergénica de grado premium. Aprobada por
              dermatólogos. Hasta 12 horas de protección continua.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
