import { createClient } from '@/lib/supabase/server';
import { applyDiscount, isPromotionActive } from '@/lib/utils/price';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { ArrowDown, Heart, Leaf, Shield } from 'lucide-react';
import type { Promotion } from '@/types';
import type { Metadata } from 'next';

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

const features = [
  {
    icon: Shield,
    title: 'Silicona Médica',
    description: 'Grado premium, hipoalergénica y aprobada por dermatólogos',
  },
  {
    icon: Leaf,
    title: 'Ecológica',
    description: 'Una copa reemplaza +2,400 productos desechables en 10 años',
  },
  {
    icon: Heart,
    title: '12 Horas',
    description: 'Protección continua sin fugas para tu día a día',
  },
];

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Entrega en Santo Domingo 🇩🇴
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface tracking-tight leading-[1.1]">
              Tu copa menstrual{' '}
              <span className="text-primary">ideal</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
              Silicona médica premium. Cómoda, segura y ecológica.
              Descubrí la libertad que tu cuerpo merece.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="#catalogo"
                className="rounded-xl gradient-primary px-8 py-3.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-2"
              >
                Ver catálogo
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Decorative gradient orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary-container/30 blur-3xl" />
      </section>

      {/* Features strip */}
      <section className="bg-surface-container-lowest">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-low"
                >
                  <div className="rounded-lg gradient-primary p-2.5 shrink-0">
                    <Icon className="h-5 w-5 text-on-primary" />
                  </div>
                  <div>
                    <h3 className="font-headline text-sm font-semibold text-on-surface">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalogo" className="scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              Nuestras Copas
            </h2>
            <p className="mt-3 text-on-surface-variant max-w-lg mx-auto">
              Cada copa está diseñada para un estilo de vida diferente.
              Encontrá la tuya.
            </p>
          </div>

          <ProductGrid products={products} />
        </div>
      </section>

      {/* Social Proof / Trust Section */}
      <section className="bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            ¿Por qué una copa menstrual?
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-primary font-headline">
                RD$50k+
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                ahorro promedio en 10 años vs. productos desechables
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-headline">
                2,400+
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                productos desechables que dejas de usar
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary font-headline">
                12 hrs
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                de protección continua sin preocupaciones
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
