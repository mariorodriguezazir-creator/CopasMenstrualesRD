import { z } from 'zod';

export const contactSchema = z.object({
  contactName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  contactPhone: z
    .string()
    .regex(
      /^(1)?8[024-9]\d{7}$/,
      'Ingresa un número de teléfono válido de RD (ej: 8094670365)'
    ),
  contactEmail: z.string().email('Ingresa un email válido'),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export const deliverySchema = z.object({
  deliveryZoneId: z.string().uuid('Selecciona una zona de entrega válida'),
  deliveryReference: z
    .string()
    .min(5, 'La referencia debe tener al menos 5 caracteres')
    .max(200, 'La referencia no puede exceder 200 caracteres')
    .refine(
      (val) => !/<[^>]*>/.test(val),
      'La referencia no puede contener HTML'
    ),
});

export const createOrderSchema = z
  .object({
    items: z.array(orderItemSchema).min(1, 'El carrito no puede estar vacío'),
    ...contactSchema.shape,
    paymentMethod: z.enum(['paypal', 'transfer', 'cod'], {
      errorMap: () => ({ message: 'Selecciona un método de pago válido' }),
    }),
    deliveryZoneId: z.string().uuid().optional(),
    deliveryReference: z
      .string()
      .max(200)
      .refine((val) => !/<[^>]*>/.test(val), 'No se permite HTML')
      .optional(),
    clientTotal: z.number().positive(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'cod') {
        return !!data.deliveryZoneId && !!data.deliveryReference;
      }
      return true;
    },
    {
      message:
        'Para contra entrega, debes seleccionar una zona e ingresar una referencia',
      path: ['deliveryReference'],
    }
  );

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
