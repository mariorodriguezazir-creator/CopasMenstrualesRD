'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
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
    <Link href={`/producto/${id}`} className="group relative block">
      <article className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-xl">
        {/* Image Container */}
        <div className="aspect-square bg-surface-container p-8 overflow-hidden">
          <Image
            src={images[0] ?? '/placeholder-product.png'}
            alt={name}
            width={300}
            height={300}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Badges */}
          {(has_promotion || isOutOfStock) && (
            <div className="flex gap-2 mb-3">
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
          )}

          {/* Title */}
          <h3 className="font-bold text-xl text-on-surface mb-1 line-clamp-1">
            {name}
          </h3>

          {/* Description */}
          <p className="text-on-surface-variant text-sm mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Price */}
          <p className="text-primary font-bold text-lg">
            RD$ {price.toLocaleString('es-DO')}
            {has_promotion && original_price && (
              <span className="ml-2 text-sm text-on-surface-variant line-through font-normal">
                RD$ {original_price.toLocaleString('es-DO')}
              </span>
            )}
          </p>
        </div>

        {/* Quick Add Button - Appears on Hover */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-on-primary disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          aria-label={isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </article>
    </Link>
  );
}
