export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-24">
        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface tracking-tight">
          Tu copa menstrual{' '}
          <span className="text-primary">ideal</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Silicona médica premium. Ecológica, segura y cómoda.
          Entrega en{' '}
          <span className="font-semibold text-on-surface">
            Santo Domingo
          </span>
          .
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#catalogo"
            className="rounded-lg gradient-primary px-8 py-3.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Ver catálogo
          </a>
        </div>
      </section>

      {/* Catalog Section (will be replaced with ProductGrid) */}
      <section id="catalogo" className="section-break">
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface text-center">
          Nuestras Copas
        </h2>
        <p className="mt-3 text-center text-on-surface-variant">
          Encuentra la copa perfecta para tu estilo de vida
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ProductGrid will replace this */}
          <div className="rounded-2xl bg-surface-container p-6 shadow-ambient text-center">
            <p className="text-on-surface-variant">
              Cargando productos...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
