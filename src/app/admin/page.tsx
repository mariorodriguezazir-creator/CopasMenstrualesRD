export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-headline text-2xl font-bold text-on-surface">
        Dashboard
      </h1>
      <p className="mt-2 text-on-surface-variant">
        Panel de administración de CopasMenstrualesRD
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats placeholder — will be replaced in Phase 3 */}
        {['Pedidos Hoy', 'Ingresos', 'Productos Activos', 'Pendientes'].map(
          (label) => (
            <div
              key={label}
              className="rounded-xl bg-surface-container p-5 shadow-ambient"
            >
              <p className="text-sm text-on-surface-variant">{label}</p>
              <p className="mt-2 text-2xl font-bold font-headline text-on-surface">
                —
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
