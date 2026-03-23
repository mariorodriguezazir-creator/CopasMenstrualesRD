import { ProductCard } from './ProductCard';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    original_price: number | null;
    has_promotion: boolean;
    images: string[];
    stock: number;
  }[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-surface-container p-4 mb-4">
          <ShoppingBag className="h-8 w-8 text-on-surface-variant" />
        </div>
        <h3 className="font-headline text-lg font-semibold text-on-surface">
          No hay productos disponibles
        </h3>
        <p className="mt-2 text-sm text-on-surface-variant max-w-sm">
          Estamos preparando nuestro catálogo. Vuelve pronto o contáctanos por
          WhatsApp para más información.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
