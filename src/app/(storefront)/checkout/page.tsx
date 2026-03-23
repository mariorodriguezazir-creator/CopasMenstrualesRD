'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Building2, Truck } from 'lucide-react';
import Link from 'next/link';
import type { PaymentMethod } from '@/lib/constants';
import type { DeliveryZone } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [deliveryZoneId, setDeliveryZoneId] = useState('');
  const [deliveryReference, setDeliveryReference] = useState('');
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/delivery-zones')
      .then((res) => res.json())
      .then(setZones)
      .catch(() => toast.error('Error cargando zonas de entrega'));
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [items.length, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!contactName || contactName.length < 2)
      newErrors.contactName = 'El nombre es requerido (mín. 2 caracteres)';
    if (!contactPhone || !/^(1)?8[024-9]\d{7}$/.test(contactPhone))
      newErrors.contactPhone = 'Ingresa un teléfono válido de RD (ej: 8094670365)';
    if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
      newErrors.contactEmail = 'Ingresa un email válido';

    if (paymentMethod === 'cod') {
      if (!deliveryZoneId)
        newErrors.deliveryZoneId = 'Selecciona una zona de entrega';
      if (!deliveryReference || deliveryReference.length < 5)
        newErrors.deliveryReference =
          'Ingresa una referencia de ubicación exacta (mín. 5 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          contactName,
          contactPhone,
          contactEmail,
          paymentMethod,
          deliveryZoneId: paymentMethod === 'cod' ? deliveryZoneId : undefined,
          deliveryReference:
            paymentMethod === 'cod' ? deliveryReference : undefined,
          clientTotal: getSubtotal(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Error al crear el pedido');
        setLoading(false);
        return;
      }

      const order = await res.json();
      clearCart();
      router.push(`/checkout/confirmacion?orderId=${order.id}&method=${paymentMethod}`);
    } catch {
      toast.error('Error de conexión. Intentá nuevamente.');
      setLoading(false);
    }
  };

  const subtotal = getSubtotal();

  const paymentOptions = [
    { value: 'paypal' as const, label: 'PayPal', icon: CreditCard },
    { value: 'transfer' as const, label: 'Transferencia Bancaria', icon: Building2 },
    { value: 'cod' as const, label: 'Contra Entrega', icon: Truck },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 sm:px-6">
      <Link
        href="/carrito"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Paso 2 de 3 — Datos de contacto y pago
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Contact Info */}
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient space-y-4">
          <h2 className="font-headline text-lg font-semibold text-on-surface">
            Datos de contacto
          </h2>

          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-on-surface mb-1.5">
              Nombre completo
            </label>
            <input
              id="contactName"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              placeholder="María García"
            />
            {errors.contactName && (
              <p className="mt-1 text-xs text-error">{errors.contactName}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-on-surface mb-1.5">
              Teléfono (RD)
            </label>
            <input
              id="contactPhone"
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              placeholder="8094670365"
            />
            {errors.contactPhone && (
              <p className="mt-1 text-xs text-error">{errors.contactPhone}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-on-surface mb-1.5">
              Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
              placeholder="maria@email.com"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-xs text-error">{errors.contactEmail}</p>
            )}
          </div>
        </section>

        {/* Payment Method */}
        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-ambient space-y-4">
          <h2 className="font-headline text-lg font-semibold text-on-surface">
            Método de pago
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = paymentMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPaymentMethod(option.value)}
                  className={`flex items-center gap-3 rounded-xl p-4 text-left transition-all ${
                    isSelected
                      ? 'gradient-primary text-on-primary shadow-ambient'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Transfer info */}
          {paymentMethod === 'transfer' && (
            <div className="intimacy-note">
              <p className="text-sm font-medium text-on-surface">
                📱 Pago por transferencia
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                Después de confirmar tu pedido, recibirás los datos bancarios.
                Envía el comprobante por WhatsApp para activar tu orden.
              </p>
            </div>
          )}

          {/* COD zone selection */}
          {paymentMethod === 'cod' && (
            <div className="space-y-4">
              {zones.length === 0 ? (
                <div className="intimacy-note">
                  <p className="text-sm text-on-surface">
                    Contra entrega no disponible en este momento.
                  </p>
                  <a
                    href="https://wa.me/18094670365"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-primary hover:underline"
                  >
                    Contáctanos por WhatsApp →
                  </a>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="deliveryZone" className="block text-sm font-medium text-on-surface mb-1.5">
                      Zona de entrega
                    </label>
                    <select
                      id="deliveryZone"
                      value={deliveryZoneId}
                      onChange={(e) => setDeliveryZoneId(e.target.value)}
                      className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                    >
                      <option value="">Selecciona una zona</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                    {errors.deliveryZoneId && (
                      <p className="mt-1 text-xs text-error">{errors.deliveryZoneId}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="deliveryRef" className="block text-sm font-medium text-on-surface mb-1.5">
                      Referencia de ubicación
                    </label>
                    <textarea
                      id="deliveryRef"
                      value={deliveryReference}
                      onChange={(e) => setDeliveryReference(e.target.value)}
                      rows={2}
                      maxLength={200}
                      className="w-full rounded-lg bg-surface-container px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/30 transition-shadow resize-none"
                      placeholder="Ej: Frente a la entrada principal del Ágora Mall, cerca de Zara"
                    />
                    {errors.deliveryReference && (
                      <p className="mt-1 text-xs text-error">{errors.deliveryReference}</p>
                    )}
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {deliveryReference.length}/200 caracteres
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Order Summary */}
        <section className="rounded-xl bg-surface-container p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">
              Subtotal ({items.length} producto{items.length > 1 ? 's' : ''})
            </span>
            <span className="font-semibold text-on-surface">
              RD${subtotal.toLocaleString('es-DO')}
            </span>
          </div>
          <div className="flex justify-between text-lg pt-2">
            <span className="font-bold text-on-surface">Total</span>
            <span className="font-bold text-primary">
              RD${subtotal.toLocaleString('es-DO')}
            </span>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || (paymentMethod === 'cod' && zones.length === 0)}
          className="w-full rounded-xl gradient-primary px-8 py-4 text-base font-semibold text-on-primary shadow-ambient transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Procesando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  );
}
