'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MessageCircle, ArrowLeft, Copy } from 'lucide-react';
import { generateWhatsAppURL } from '@/lib/utils/whatsapp';
import { toast } from 'sonner';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? '';
  const method = searchParams.get('method') ?? '';
  const shortId = orderId.slice(0, 8).toUpperCase();

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    toast.success('Número de orden copiado');
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16 sm:px-6 text-center">
      {/* Success icon */}
      <div className="inline-flex rounded-full gradient-primary p-4 shadow-ambient mb-6">
        <CheckCircle className="h-10 w-10 text-on-primary" />
      </div>

      <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
        ¡Pedido confirmado!
      </h1>

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface-container px-4 py-2">
        <span className="text-sm text-on-surface-variant">Orden:</span>
        <span className="font-mono text-sm font-bold text-primary">
          #{shortId}
        </span>
        <button
          onClick={copyOrderId}
          className="p-1 rounded hover:bg-surface-container-high transition-colors"
          aria-label="Copiar número de orden"
        >
          <Copy className="h-3.5 w-3.5 text-on-surface-variant" />
        </button>
      </div>

      {/* Payment-specific instructions */}
      <div className="mt-8 rounded-xl bg-surface-container-lowest p-6 shadow-ambient text-left">
        {method === 'paypal' && (
          <>
            <h2 className="font-headline text-lg font-semibold text-on-surface">
              ✅ Pago recibido
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Tu pago fue procesado exitosamente con PayPal. Te enviaremos un
              email de confirmación con los detalles de tu pedido.
            </p>
          </>
        )}

        {method === 'transfer' && (
          <>
            <h2 className="font-headline text-lg font-semibold text-on-surface">
              🏦 Datos para transferencia
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between py-1.5">
                <span className="text-on-surface-variant">Banco</span>
                <span className="font-medium text-on-surface">BanReservas</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-on-surface-variant">Cuenta</span>
                <span className="font-medium text-on-surface">
                  9600-XXXX-XXXX
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-on-surface-variant">Tipo</span>
                <span className="font-medium text-on-surface">Ahorros</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-on-surface-variant">Titular</span>
                <span className="font-medium text-on-surface">
                  CopasMenstrualesRD SRL
                </span>
              </div>
            </div>

            <a
              href={generateWhatsAppURL(orderId)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-ambient hover:opacity-90 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Enviar comprobante por WhatsApp
            </a>
          </>
        )}

        {method === 'cod' && (
          <>
            <h2 className="font-headline text-lg font-semibold text-on-surface">
              🚚 Entrega programada
            </h2>
            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Nos pondremos en contacto contigo para coordinar la entrega en
              la zona que seleccionaste. El pago será al momento de la entrega.
            </p>
            <div className="mt-4 intimacy-note">
              <p className="text-xs text-on-surface-variant">
                Horario de entregas: Lunes a Viernes de 9:00 AM a 6:00 PM.
                Tiempo estimado: 1-3 días hábiles.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-8 py-3 text-sm font-semibold text-on-primary shadow-ambient hover:opacity-90 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <p className="text-on-surface-variant">Cargando...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
