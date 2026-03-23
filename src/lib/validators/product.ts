import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  images: z.array(z.string().url()).min(1, 'Debe tener al menos una imagen'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  is_active: z.boolean(),
});

export const productVariantSchema = z.object({
  size: z.string().min(1, 'La talla es requerida'),
  color: z.string().optional(),
  stock: z.number().int().min(0),
  price_override: z.number().positive().nullable(),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
