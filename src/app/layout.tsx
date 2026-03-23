import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-headline',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});


export const metadata: Metadata = {
  title: {
    default: 'CopasMenstrualesRD — Tu copa menstrual ideal',
    template: '%s | CopasMenstrualesRD',
  },
  description:
    'Copas menstruales de silicona médica premium. Entrega en Santo Domingo. Ecológicas, seguras y cómodas. Hasta 12 horas de protección.',
  keywords: [
    'copa menstrual',
    'República Dominicana',
    'Santo Domingo',
    'menstrual cup',
    'silicona médica',
    'higiene femenina',
    'ecológico',
  ],
  openGraph: {
    title: 'CopasMenstrualesRD — Tu copa menstrual ideal',
    description:
      'Copas menstruales de silicona médica premium con entrega en Santo Domingo.',
    url: 'https://copasmenstrualesrd.com',
    siteName: 'CopasMenstrualesRD',
    locale: 'es_DO',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`h-full antialiased ${playfair.variable} ${plusJakarta.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--surface-container)',
              color: 'var(--on-surface)',
              border: 'none',
              borderRadius: '8px',
              fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
            },
          }}
        />
      </body>
    </html>
  );
}

