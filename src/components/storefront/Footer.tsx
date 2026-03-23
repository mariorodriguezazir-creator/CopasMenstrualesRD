import Link from 'next/link';
import { MessageCircle, Heart, Leaf, ShieldCheck } from 'lucide-react';
import { WHATSAPP_URL_BASE, BUSINESS_HOURS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-surface-container-highest mt-auto overflow-hidden">
      {/* Organic background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 organic-blob blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 organic-blob blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Trust badges row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10 pb-10 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Leaf className="h-5 w-5 text-tertiary" />
            <span className="text-sm font-medium">100% Ecológico</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Silicona Médica</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Heart className="h-5 w-5 text-error" />
            <span className="text-sm font-medium">Hecho con Amor</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="font-headline text-xl font-bold italic text-primary">
              CopasMenstrualesRD
            </h3>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto sm:mx-0">
              Tu copa menstrual ideal, entregada en Santo Domingo.
              Ecológica, segura y diseñada para tu comodidad.
            </p>
          </div>

          {/* Horarios */}
          <div className="text-center">
            <h4 className="font-body text-sm font-bold uppercase tracking-widest text-on-surface mb-4">
              Horarios de Atención
            </h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>Lunes - Viernes: {BUSINESS_HOURS.weekdays}</li>
              <li>Sábados: {BUSINESS_HOURS.saturday}</li>
              <li>Domingos: {BUSINESS_HOURS.sunday}</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-right">
            <h4 className="font-body text-sm font-bold uppercase tracking-widest text-on-surface mb-4">
              Contáctanos
            </h4>
            <a
              href={WHATSAPP_URL_BASE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-on-primary shadow-cta hover:opacity-90 transition-all active:scale-95"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 text-center border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">
            © {currentYear} CopasMenstrualesRD. Todos los derechos reservados.
          </p>
          <p className="text-xs text-on-surface-variant/60 mt-2">
            Hecho con amor en República Dominicana
          </p>
        </div>
      </div>
    </footer>
  );
}
