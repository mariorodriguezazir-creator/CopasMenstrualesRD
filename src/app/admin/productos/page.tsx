'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const toggleActive = async (id: string, isActive: boolean) => {
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !isActive }),
    });

    if (res.ok) {
      toast.success(isActive ? 'Producto desactivado' : 'Producto activado');
      loadProducts();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Productos</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{products.length} productos</p>
        </div>
        <Link href="/admin/productos/nuevo" className="rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo
        </Link>
      </div>

      <div className="mt-6 rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-4 py-3 font-semibold text-on-surface">Producto</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Precio</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Stock</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Estado</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">Cargando...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">No hay productos</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{product.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">RD${Number(product.price).toLocaleString('es-DO')}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock === 0 ? 'text-error' : product.stock <= 5 ? 'text-error' : 'text-on-surface'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${product.is_active ? 'bg-tertiary-container/20 text-tertiary' : 'bg-surface-container text-on-surface-variant'}`}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/productos/${product.id}`} className="p-1.5 rounded-md hover:bg-surface-container transition-colors" title="Editar">
                        <Edit className="h-4 w-4 text-on-surface-variant" />
                      </Link>
                      <button onClick={() => toggleActive(product.id, product.is_active)} className="p-1.5 rounded-md hover:bg-surface-container transition-colors" title={product.is_active ? 'Desactivar' : 'Activar'}>
                        {product.is_active ? <EyeOff className="h-4 w-4 text-on-surface-variant" /> : <Eye className="h-4 w-4 text-on-surface-variant" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
