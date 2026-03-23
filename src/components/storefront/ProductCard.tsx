'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  has_promotion: boolean;
  images: string[];
  stock: number;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  original_price,
  has_promotion,
  images,
  stock,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const isOutOfStock = stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      productId: id,
      name,
      price: original_price ?? price,
      finalPrice: price,
      image: images[0] ?? '',
      quantity: 1,
      maxStock: stock,
    });

    toast.success(`${name} agregado al carrito`);
  };

  return (
    <Link href={`/producto/${id}`} className="group block">
      <article className="rounded-2xl bg-surface-container-lowest shadow-ambient overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface-container">
          <Image
            src={images[0] ?? '/placeholder-product.png'}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {has_promotion && (
              <span className="inline-flex items-center rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-on-primary">
                Oferta
              </span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center rounded-full bg-inverse-surface px-3 py-1 text-xs font-semibold text-inverse-on-surface">
                Agotado
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-headline text-base font-semibold text-on-surface line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              RD${price.toLocaleString('es-DO')}
            </span>
            {has_promotion && original_price && (
              <span className="text-sm text-on-surface-variant line-through">
                RD${original_price.toLocaleString('es-DO')}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-ambient transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingBag className="h-4 w-4" />
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </article>
    </Link>
  );
}
