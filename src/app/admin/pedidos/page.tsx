'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Order {
  id: string;
  contact_name: string;
  contact_phone: string;
  total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  PAID: 'Pagado',
  PENDING_PAYMENT: 'Pendiente Pago',
  PENDING_COD: 'Contra Entrega',
  CONFIRMED: 'Confirmado',
};

const STATUS_COLORS: Record<string, string> = {
  PAID: 'bg-tertiary-container/20 text-tertiary',
  PENDING_PAYMENT: 'bg-error-container/30 text-error',
  PENDING_COD: 'bg-secondary-container/40 text-secondary',
  CONFIRMED: 'bg-tertiary-container/20 text-tertiary',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    const url = filter ? `/api/admin/orders?status=${filter}` : '/api/admin/orders';
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data)) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, payment_status: status }),
    });
    if (res.ok) {
      toast.success('Estado actualizado');
      loadOrders();
    }
  };

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold text-on-surface">Pedidos</h1>
      <p className="mt-1 text-sm text-on-surface-variant">{orders.length} pedidos</p>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['', 'PENDING_PAYMENT', 'PENDING_COD', 'PAID', 'CONFIRMED'].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setLoading(true); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'gradient-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {s === '' ? 'Todos' : STATUS_LABELS[s] ?? s}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-4 py-3 font-semibold text-on-surface">Orden</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Cliente</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Total</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Método</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Estado</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Fecha</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">Cargando...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-on-surface-variant">No hay pedidos</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-on-surface">{order.contact_name}</td>
                  <td className="px-4 py-3 font-medium text-on-surface">RD${Number(order.total).toLocaleString('es-DO')}</td>
                  <td className="px-4 py-3 capitalize text-on-surface-variant">{order.payment_method}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[order.payment_status] ?? ''}`}>
                      {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{new Date(order.created_at).toLocaleDateString('es-DO')}</td>
                  <td className="px-4 py-3">
                    {order.payment_status !== 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'CONFIRMED')}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Confirmar
                      </button>
                    )}
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
