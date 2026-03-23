import { createClient } from '@/lib/supabase/server';
import { applyDiscount, isPromotionActive } from '@/lib/utils/price';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { ArrowRight, Leaf, ChevronRight } from 'lucide-react';
import type { Promotion } from '@/types';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'CopasMenstrualesRD — Tu copa menstrual ideal',
  description:
    'Copas menstruales de silicona médica premium con entrega en Santo Domingo. Ecológicas, seguras y cómodas.',
};

async function getProducts() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const { data: promotions } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true);

  return (products ?? []).map((product) => {
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
      price: finalPrice,
      original_price: hasPromotion ? originalPrice : null,
      has_promotion: hasPromotion,
    };
  });
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="bg-[#FFF8F5]">
      {/* Hero Section: Radical Asymmetrical Layout */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content: Editorial Voice */}
          <div className="lg:col-span-6 z-10 flex flex-col items-start text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Sostenibilidad & Bienestar
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-on-surface leading-[1.1] tracking-tight mb-8">
              Tu ciclo, <br />
              <span className="text-primary italic">en tus términos</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-lg mb-10">
              Descubre una forma más consciente, cómoda y ecológica de vivir tu
              menstruación. Diseñado para la mujer dominicana que busca libertad
              sin compromisos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <a
                href="#catalogo"
                className="px-10 py-5 bg-primary text-on-primary font-bold text-lg rounded-organic shadow-cta hover:brightness-110 active:scale-95 transition-all duration-300"
              >
                Ver productos
              </a>
              <a
                href="#por-que"
                className="flex items-center gap-2 text-primary font-bold group"
              >
                <span className="border-b-2 border-transparent group-hover:border-primary transition-all">
                  Conoce nuestra historia
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Emotional Proof */}
            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  +2,000 dominicanas
                </p>
                <p className="text-xs text-on-surface-variant">
                  han cambiado su vida con nosotros.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content: Asymmetrical Organic Hero Image */}
          <div className="lg:col-span-6 relative order-1 lg:order-2 flex justify-center">
            {/* Background Decorative Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-surface-container-high rounded-full opacity-40 blur-3xl -z-10" />

            <div className="relative w-full max-w-md aspect-[4/5]">
              {/* Main Hero Image with Organic Radius */}
              <div className="w-full h-full rounded-organic-lg overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-primary" />
                    </div>
                    <p className="text-on-surface font-headline text-xl">
                      Copa Menstrual Premium
                    </p>
                    <p className="text-on-surface-variant text-sm mt-2">
                      Silicona médica certificada
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>

              {/* Floating Eco Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-organic shadow-xl hidden md:flex items-center gap-4 z-20">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <Leaf className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    100% Ecológico
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Sin plásticos ni químicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlight Section: Tonal Layering */}
      <section
        id="catalogo"
        className="w-full bg-surface-container-low py-24 mt-12 rounded-[60px_60px_0_0] scroll-mt-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="font-headline text-4xl font-bold text-on-surface mb-4">
                Selección consciente
              </h2>
              <p className="text-on-surface-variant text-lg">
                Explora nuestra colección diseñada para cada cuerpo y necesidad.
              </p>
            </div>
            <a
              href="#catalogo"
              className="text-primary font-bold flex items-center gap-2 mb-2 hover:gap-3 transition-all"
            >
              Explorar todo
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      {/* Why Section: Stats with Editorial Touch */}
      <section id="por-que" className="bg-surface-container-lowest py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
            ¿Por qué una copa menstrual?
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto mb-16">
            Más que un producto, es un cambio de vida. Descubre los beneficios
            que miles de mujeres ya están disfrutando.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-8 bg-white rounded-3xl shadow-editorial">
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline mb-3">
                RD$50k+
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                ahorro promedio en 10 años vs. productos desechables
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-editorial">
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline mb-3">
                2,400+
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                productos desechables que dejas de usar
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-editorial">
              <p className="text-4xl md:text-5xl font-bold text-primary font-headline mb-3">
                12 hrs
              </p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                de protección continua sin preocupaciones
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intimacy Note Section */}
      <section className="bg-[#FFF8F5] py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-surface-container-highest rounded-2xl p-8 border-l-4 border-primary">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L4 7v6c0 5.25 3.4 10.2 8 11.5 4.6-1.3 8-6.25 8-11.5V7l-8-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg mb-2">
                  Compromiso CopasMenstrualesRD
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Cada compra incluye una guía digital personalizada para
                  principiantes y un estuche de algodón orgánico. Tu comodidad
                  es nuestra prioridad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
