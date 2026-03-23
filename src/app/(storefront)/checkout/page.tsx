'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import { ArrowLeft, CreditCard, Building2, Truck, User, ShieldCheck, Lock, Check } from 'lucide-react';
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
    { 
      value: 'paypal' as const, 
      label: 'PayPal', 
      description: 'Pago seguro online',
      icon: CreditCard 
    },
    { 
      value: 'transfer' as const, 
      label: 'Transferencia', 
      description: 'Popular, BHD, Banreservas',
      icon: Building2 
    },
    { 
      value: 'cod' as const, 
      label: 'Contra Entrega', 
      description: 'Paga al recibir',
      icon: Truck 
    },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12 sm:px-6">
      {/* Back link */}
      <Link
        href="/carrito"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al carrito
      </Link>

      {/* Organic Stepper */}
      <div className="mb-12 relative">
        <div className="flex justify-between items-center relative z-10">
          {/* Step 1 (Done) */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full gradient-primary text-on-primary flex items-center justify-center mb-2 shadow-cta">
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-primary">
              Carrito
            </span>
          </div>

          {/* Step 2 (Active) */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary bg-surface-container-lowest flex items-center justify-center mb-2 shadow-ambient">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse-soft"></div>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-on-surface">
              Pago
            </span>
          </div>

          {/* Step 3 (Pending) */}
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-2">
              <span className="text-xs font-bold text-on-surface-variant">3</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              Confirmación
            </span>
          </div>
        </div>

        {/* Connecting Line */}
        <div className="absolute top-5 sm:top-6 left-0 w-full h-[2px] bg-surface-container-highest -z-0">
          <div className="h-full gradient-primary w-1/2 rounded-full"></div>
        </div>
      </div>

      {/* Section Title */}
      <div className="text-center mb-10">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-on-surface">
          Tu Bienestar, Tu Pago
        </h1>
        <p className="mt-3 text-on-surface-variant max-w-md mx-auto">
          Tus datos están protegidos mediante encriptación de grado bancario.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Info */}
        <section className="space-y-6">
          <h2 className="font-body font-semibold text-lg text-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            Información de Contacto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="contactName" className="text-sm font-medium text-on-surface-variant ml-1">
                Nombre Completo
              </label>
              <input
                id="contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-surface-container-high border-none rounded-[10px] p-4 text-on-surface focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all outline-none"
                placeholder="María García"
              />
              {errors.contactName && (
                <p className="text-xs text-error ml-1">{errors.contactName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contactPhone" className="text-sm font-medium text-on-surface-variant ml-1">
                Teléfono (RD)
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-surface-container-high border-none rounded-[10px] p-4 text-on-surface focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all outline-none"
                placeholder="8094670365"
              />
              {errors.contactPhone && (
                <p className="text-xs text-error ml-1">{errors.contactPhone}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="contactEmail" className="text-sm font-medium text-on-surface-variant ml-1">
              Email
            </label>
            <input
              id="contactEmail"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-[10px] p-4 text-on-surface focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all outline-none"
              placeholder="maria@email.com"
            />
            {errors.contactEmail && (
              <p className="text-xs text-error ml-1">{errors.contactEmail}</p>
            )}
          </div>
        </section>

        {/* Payment Method - Large Touch Cards */}
        <section className="space-y-6">
          <h2 className="font-body font-semibold text-lg text-primary flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Método de Pago
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {paymentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = paymentMethod === option.value;
              return (
                <label key={option.value} className="relative cursor-pointer group">
                  <input
                    type="radio"
                    name="payment"
                    checked={isSelected}
                    onChange={() => setPaymentMethod(option.value)}
                    className="peer hidden"
                  />
                  <div className={`p-5 sm:p-6 rounded-[24px] bg-surface-container-lowest border-2 transition-all duration-300 shadow-sm flex items-center justify-between ${
                    isSelected 
                      ? 'border-primary bg-surface-container-low' 
                      : 'border-transparent hover:border-primary/20'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        isSelected 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{option.label}</p>
                        <p className="text-sm text-on-surface-variant">{option.description}</p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary' : 'border-outline-variant'
                    }`}>
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Transfer info */}
          {paymentMethod === 'transfer' && (
            <div className="intimacy-note">
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-on-surface mb-1">Pago por transferencia</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Después de confirmar tu pedido, recibirás los datos bancarios.
                    Envía el comprobante por WhatsApp para activar tu orden.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COD zone selection */}
          {paymentMethod === 'cod' && (
            <div className="space-y-4 p-6 rounded-[24px] bg-white shadow-lg shadow-primary/5 border border-surface-container-highest">
              {zones.length === 0 ? (
                <div className="text-center py-4">
                  <Truck className="h-8 w-8 text-on-surface-variant/40 mx-auto mb-2" />
                  <p className="text-sm text-on-surface">
                    Contra entrega no disponible en este momento.
                  </p>
                  <a
                    href="https://wa.me/18094670365"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-primary font-medium hover:underline"
                  >
                    Contáctanos por WhatsApp →
                  </a>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label htmlFor="deliveryZone" className="text-sm font-medium text-on-surface-variant ml-1">
                      Zona de entrega
                    </label>
                    <select
                      id="deliveryZone"
                      value={deliveryZoneId}
                      onChange={(e) => setDeliveryZoneId(e.target.value)}
                      className="w-full bg-surface-container-high border-none rounded-[10px] p-4 text-on-surface focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all outline-none"
                    >
                      <option value="">Selecciona una zona</option>
                      {zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                    {errors.deliveryZoneId && (
                      <p className="text-xs text-error ml-1">{errors.deliveryZoneId}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="deliveryRef" className="text-sm font-medium text-on-surface-variant ml-1">
                      Referencia de ubicación
                    </label>
                    <textarea
                      id="deliveryRef"
                      value={deliveryReference}
                      onChange={(e) => setDeliveryReference(e.target.value)}
                      rows={2}
                      maxLength={200}
                      className="w-full bg-surface-container-high border-none rounded-[10px] p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all outline-none resize-none"
                      placeholder="Ej: Frente a la entrada principal del Ágora Mall"
                    />
                    {errors.deliveryReference && (
                      <p className="text-xs text-error ml-1">{errors.deliveryReference}</p>
                    )}
                    <p className="text-xs text-on-surface-variant ml-1">
                      {deliveryReference.length}/200 caracteres
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Security Note */}
        <div className="intimacy-note">
          <div className="flex gap-4">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-on-surface mb-1">Pago 100% Protegido</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Toda tu información es procesada de forma segura. No almacenamos datos sensibles en nuestros servidores.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <section className="rounded-[16px] bg-surface-container p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">
              Subtotal ({items.length} producto{items.length > 1 ? 's' : ''})
            </span>
            <span className="font-semibold text-on-surface">
              RD${subtotal.toLocaleString('es-DO')}
            </span>
          </div>
          <div className="h-px bg-outline-variant/30"></div>
          <div className="flex justify-between text-xl">
            <span className="font-bold text-on-surface">Total</span>
            <span className="font-bold text-primary">
              RD${subtotal.toLocaleString('es-DO')}
            </span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pb-6">
          <button
            type="submit"
            disabled={loading || (paymentMethod === 'cod' && zones.length === 0)}
            className="w-full h-16 rounded-[12px] gradient-primary text-on-primary font-bold text-lg shadow-cta flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Procesando...' : `Finalizar y Pagar RD$${subtotal.toLocaleString('es-DO')}`}</span>
            <Lock className="h-5 w-5" />
          </button>
          <Link
            href="/carrito"
            className="w-full py-4 text-primary font-medium hover:bg-surface-container transition-colors rounded-xl text-center"
          >
            Volver al carrito
          </Link>
        </div>
      </form>
    </div>
  );
}
