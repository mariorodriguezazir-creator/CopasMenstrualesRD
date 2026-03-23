'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingBag, ChevronLeft, Minus, Plus, Sparkles, ChevronDown } from 'lucide-react';
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

// FAQ data for the product
const faqs = [
  {
    question: '¿Cómo elijo mi talla ideal?',
    answer: 'Nuestra guía de tallas se basa en la altura de tu cérvix y tu historial de partos. El Modelo 1 es ideal para menores de 30 años sin partos vaginales. El Modelo 2 es recomendado para mayores de 30 o con partos vaginales.',
  },
  {
    question: '¿Cuánto tiempo dura la copa?',
    answer: 'Con el cuidado adecuado, tu copa menstrual puede durar hasta 10 años. Esto la convierte en una inversión ecológica y económica para tu bienestar.',
  },
  {
    question: '¿Cómo la limpio correctamente?',
    answer: 'Enjuaga con agua fría antes y después de cada uso. Al inicio y final de tu ciclo, esterilízala hirviéndola por 5 minutos. Nunca uses jabones perfumados.',
  },
];

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
    <div className="relative">
      {/* Floating decorations */}
      <div className="fixed top-32 left-8 w-4 h-4 rounded-full bg-primary/20 blur-sm animate-pulse-soft hidden lg:block"></div>
      <div className="fixed bottom-40 right-12 w-8 h-8 rounded-full bg-secondary/30 blur-md hidden lg:block"></div>

      {/* Breadcrumb */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-surface-container-low organic-blob opacity-50 blur-3xl -z-10 hidden lg:block"></div>

        {/* Product Image Focus */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          {/* Organic blob background */}
          <div className="absolute inset-0 bg-surface-container organic-blob scale-110 -z-10 rotate-12 hidden md:block"></div>
          
          <div className="relative w-full max-w-md">
            {/* Main image with organic container */}
            <div className="bg-white/40 backdrop-blur-sm organic-blob p-4 sm:p-8 shadow-xl shadow-primary/5">
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
                  <span className="absolute top-4 left-4 rounded-full gradient-primary px-4 py-1.5 text-xs font-semibold text-on-primary shadow-cta">
                    Oferta
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
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
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
          {/* Category badge */}
          <span className="text-primary font-medium tracking-[0.2em] uppercase text-xs">
            Essential Care
          </span>

          {/* Product name - Editorial typography */}
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-on-surface leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-body font-bold text-3xl sm:text-4xl text-on-surface">
              RD${product.price.toLocaleString('es-DO')}
            </span>
            {product.has_promotion && product.original_price && (
              <span className="text-lg text-on-surface-variant line-through opacity-60">
                RD${product.original_price.toLocaleString('es-DO')}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
            {product.description}
          </p>

          {/* Variant Selection */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
                Selecciona tu talla
              </p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    disabled={variant.stock === 0}
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all active:scale-95 ${
                      selectedVariant?.id === variant.id
                        ? 'border-2 border-primary bg-surface-container text-primary shadow-md'
                        : variant.stock === 0
                          ? 'border border-outline-variant text-on-surface-variant/40 cursor-not-allowed line-through'
                          : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
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
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-on-surface-variant">
              Cantidad
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-surface-container rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-full p-3 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold text-on-surface text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="rounded-full p-3 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-on-surface-variant">
                {currentStock} disponible{currentStock !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Stock indicator */}
          {currentStock > 0 && currentStock <= 5 && (
            <p className="text-sm text-error font-medium">
              ¡Solo quedan {currentStock} unidad{currentStock !== 1 ? 'es' : ''}!
            </p>
          )}

          {/* CTA Button */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-5 sm:py-6 rounded-[24px] gradient-primary text-white font-body font-bold text-lg sm:text-xl shadow-[0_20px_50px_rgba(194,114,138,0.3)] hover:shadow-[0_10px_30px_rgba(194,114,138,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </section>

      {/* Intimacy Note Section */}
      <section className="mt-12 sm:mt-16">
        <div className="intimacy-note rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-primary shrink-0 mt-1" />
            <div>
              <h4 className="font-body font-bold text-on-surface text-lg">
                Compromiso CopasMenstrualesRD
              </h4>
              <p className="text-on-surface-variant leading-relaxed mt-2">
                Cada compra incluye una guía digital personalizada para principiantes 
                y un estuche de algodón orgánico. Tu comodidad es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="mt-16 sm:mt-20 space-y-8">
        <h3 className="font-headline text-2xl sm:text-3xl text-center text-on-surface">
          Preguntas Frecuentes
        </h3>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-surface-container-lowest rounded-[24px] overflow-hidden transition-all border border-transparent hover:border-primary/10"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left group"
              >
                <span className="font-body font-semibold text-on-surface pr-4">
                  {faq.question}
                </span>
                <div className={`bg-surface-container p-2 rounded-full text-primary transition-transform ${
                  openFaq === index ? 'rotate-180' : 'group-hover:rotate-180'
                }`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openFaq === index ? 'max-h-48 pb-6' : 'max-h-0'
              }`}>
                <p className="px-6 sm:px-8 text-on-surface-variant leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
