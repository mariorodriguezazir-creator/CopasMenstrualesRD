'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Promotion {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  product_ids: string[];
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '' });

  const loadPromotions = async () => {
    const res = await fetch('/api/admin/promotions');
    const data = await res.json();
    if (Array.isArray(data)) setPromotions(data);
    setLoading(false);
  };

  useEffect(() => { loadPromotions(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, discount_value: Number(form.discount_value), is_active: true, product_ids: [] }),
    });
    if (res.ok) {
      toast.success('Promoción creada');
      setShowForm(false);
      setForm({ name: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '' });
      loadPromotions();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/promotions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !isActive }),
    });
    toast.success(isActive ? 'Promoción desactivada' : 'Promoción activada');
    loadPromotions();
  };

  const getStatus = (promo: Promotion) => {
    const now = new Date();
    const start = new Date(promo.start_date);
    const end = new Date(promo.end_date);
    if (!promo.is_active) return { label: 'Inactiva', color: 'bg-surface-container text-on-surface-variant' };
    if (now < start) return { label: 'Programada', color: 'bg-secondary-container/40 text-secondary' };
    if (now > end) return { label: 'Expirada', color: 'bg-error-container/30 text-error' };
    return { label: 'Activa', color: 'bg-tertiary-container/20 text-tertiary' };
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Promociones</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{promotions.length} promociones</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-ambient space-y-4">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre de la promoción" required className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none">
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (RD$)</option>
            </select>
            <input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} placeholder="Valor" required className="rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required className="rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
            <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required className="rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button type="submit" className="rounded-lg gradient-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all">Crear</button>
        </form>
      )}

      <div className="mt-6 rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-4 py-3 font-semibold text-on-surface">Nombre</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Descuento</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Período</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Estado</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">Cargando...</td></tr>
            ) : promotions.map((promo) => {
              const status = getStatus(promo);
              return (
                <tr key={promo.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-on-surface">{promo.name}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `RD$${promo.discount_value}`}</td>
                  <td className="px-4 py-3 text-xs text-on-surface-variant">{new Date(promo.start_date).toLocaleDateString('es-DO')} — {new Date(promo.end_date).toLocaleDateString('es-DO')}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>{status.label}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(promo.id, promo.is_active)} className="text-xs font-medium text-primary hover:underline">
                      {promo.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
