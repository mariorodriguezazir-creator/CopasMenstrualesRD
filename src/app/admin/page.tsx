'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, DollarSign, Package, Clock } from 'lucide-react';

interface Stats {
  totalOrders: number;
  revenue: number;
  activeProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/admin/orders'),
          fetch('/api/admin/products'),
        ]);

        const orders = await ordersRes.json();
        const products = await productsRes.json();

        if (Array.isArray(orders) && Array.isArray(products)) {
          setStats({
            totalOrders: orders.length,
            revenue: orders
              .filter((o: { payment_status: string }) => o.payment_status === 'PAID' || o.payment_status === 'CONFIRMED')
              .reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0),
            activeProducts: products.filter((p: { is_active: boolean }) => p.is_active).length,
            pendingOrders: orders.filter(
              (o: { payment_status: string }) =>
                o.payment_status === 'PENDING_PAYMENT' || o.payment_status === 'PENDING_COD'
            ).length,
          });
        }
      } catch {
        /* stats load silently fails */
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { label: 'Pedidos Total', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-primary' },
    { label: 'Ingresos', value: stats ? `RD$${stats.revenue.toLocaleString('es-DO')}` : '—', icon: DollarSign, color: 'text-tertiary' },
    { label: 'Productos Activos', value: stats?.activeProducts ?? '—', icon: Package, color: 'text-secondary' },
    { label: 'Pendientes', value: stats?.pendingOrders ?? '—', icon: Clock, color: 'text-error' },
  ];

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold text-on-surface">Dashboard</h1>
      <p className="mt-2 text-on-surface-variant">Resumen de CopasMenstrualesRD</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient">
              <div className="flex items-center justify-between">
                <p className="text-sm text-on-surface-variant">{card.label}</p>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="mt-3 text-2xl font-bold font-headline text-on-surface">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
