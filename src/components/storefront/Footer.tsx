import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL_BASE, BUSINESS_HOURS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-highest mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="font-headline text-lg font-bold text-primary">
              CopasMenstrualesRD
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
              Tu copa menstrual ideal, entregada en Santo Domingo.
              Ecológica, segura y cómoda.
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
              Horarios de Atención
            </h4>
            <ul className="space-y-1 text-sm text-on-surface-variant">
              <li>Lunes - Viernes: {BUSINESS_HOURS.weekdays}</li>
              <li>Sábados: {BUSINESS_HOURS.saturday}</li>
              <li>Domingos: {BUSINESS_HOURS.sunday}</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
              Contáctanos
            </h4>
            <a
              href={WHATSAPP_URL_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 text-center">
          <p className="text-xs text-on-surface-variant">
            © {currentYear} CopasMenstrualesRD. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
