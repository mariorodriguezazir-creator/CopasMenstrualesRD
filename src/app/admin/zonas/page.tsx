'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Zone {
  id: string;
  name: string;
  zone_type: string;
  is_active: boolean;
}

const ZONE_TYPE_LABELS: Record<string, string> = {
  plaza: 'Plaza / Centro Comercial',
  avenida: 'Avenida',
  sector: 'Sector',
};

export default function AdminZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', zone_type: 'plaza' });

  const loadZones = async () => {
    const res = await fetch('/api/admin/delivery-zones');
    const data = await res.json();
    if (Array.isArray(data)) setZones(data);
    setLoading(false);
  };

  useEffect(() => { loadZones(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/delivery-zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Zona creada');
      setShowForm(false);
      setForm({ name: '', zone_type: 'plaza' });
      loadZones();
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch('/api/admin/delivery-zones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active: !isActive }),
    });
    toast.success(isActive ? 'Zona desactivada' : 'Zona activada');
    loadZones();
  };

  const deleteZone = async (id: string) => {
    const res = await fetch(`/api/admin/delivery-zones?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Zona eliminada');
      loadZones();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Error al eliminar');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Zonas de Entrega</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{zones.length} zonas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-xl bg-surface-container-lowest p-5 shadow-ambient space-y-4">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre de la zona" required className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30" />
          <select value={form.zone_type} onChange={(e) => setForm({ ...form, zone_type: e.target.value })} className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none">
            <option value="plaza">Plaza / Centro Comercial</option>
            <option value="avenida">Avenida</option>
            <option value="sector">Sector</option>
          </select>
          <button type="submit" className="rounded-lg gradient-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all">Crear</button>
        </form>
      )}

      <div className="mt-6 rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-container text-left">
              <th className="px-4 py-3 font-semibold text-on-surface">Nombre</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Tipo</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Estado</th>
              <th className="px-4 py-3 font-semibold text-on-surface">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">Cargando...</td></tr>
            ) : zones.map((zone) => (
              <tr key={zone.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50 transition-colors">
                <td className="px-4 py-3 font-medium text-on-surface">{zone.name}</td>
                <td className="px-4 py-3 text-on-surface-variant">{ZONE_TYPE_LABELS[zone.zone_type] ?? zone.zone_type}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${zone.is_active ? 'bg-tertiary-container/20 text-tertiary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {zone.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(zone.id, zone.is_active)} className="text-xs font-medium text-primary hover:underline">
                      {zone.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => deleteZone(zone.id)} className="p-1 rounded text-error/60 hover:text-error hover:bg-error-container/20 transition-colors" title="Eliminar">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
