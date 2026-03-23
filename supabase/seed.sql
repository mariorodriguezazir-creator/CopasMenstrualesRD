-- ============================================
-- CopasMenstrualesRD — Seed Data
-- 5 productos iniciales + zonas de entrega
-- ============================================

-- ── Productos ───────────────────────────────────
INSERT INTO products (id, name, description, price, images, stock, is_active) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Copa Clásica',
  'Nuestra copa menstrual más popular. Fabricada con silicona médica hipoalergénica de grado premium. Suave, flexible y fácil de usar. Ideal para principiantes. Duración de hasta 12 horas de protección continua. Incluye bolsa de algodón orgánico para almacenamiento.',
  850.00,
  ARRAY['https://placehold.co/600x600/fce9ef/8c455c?text=Copa+Clásica'],
  50,
  true
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Copa Sport',
  'Diseñada para mujeres activas. Mayor firmeza para actividades deportivas intensas. Silicona médica premium con agarre anatómico reforzado. Perfecta para yoga, running, natación y crossfit. 12 horas de protección sin fugas durante el ejercicio.',
  950.00,
  ARRAY['https://placehold.co/600x600/fce9ef/8c455c?text=Copa+Sport'],
  35,
  true
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Copa Teen',
  'Especialmente diseñada para adolescentes y cérvix bajo. Tamaño más pequeño y suave para mayor comodidad. Silicona médica ultra-suave de grado hospitalario. Incluye guía ilustrada paso a paso para primeras usuarias.',
  750.00,
  ARRAY['https://placehold.co/600x600/fce9ef/8c455c?text=Copa+Teen'],
  40,
  true
),
(
  'd4e5f6a7-b8c9-0123-defa-234567890123',
  'Copa Premium',
  'Nuestra copa de gama alta con acabado satinado exclusivo. Silicona médica platinum-cure de máxima durabilidad. Diseño ergonómico con tallo ajustable. Incluye esterilizador portable y bolsa de terciopelo. Garantía de 10 años.',
  1250.00,
  ARRAY['https://placehold.co/600x600/fce9ef/8c455c?text=Copa+Premium'],
  25,
  true
),
(
  'e5f6a7b8-c9d0-1234-efab-345678901234',
  'Copa Eco',
  'Nuestra opción más sustentable. Empaque 100% biodegradable y libre de plástico. Silicona médica reciclable con certificación eco-friendly. Por cada copa vendida, plantamos un árbol en RD. Ideal para consumidoras conscientes.',
  900.00,
  ARRAY['https://placehold.co/600x600/fce9ef/8c455c?text=Copa+Eco'],
  30,
  true
);

-- ── Variantes de producto ───────────────────────
INSERT INTO product_variants (product_id, size, color, stock) VALUES
-- Copa Clásica
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'S', 'Rosa', 20),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'M', 'Rosa', 20),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'L', 'Rosa', 10),
-- Copa Sport
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'S', 'Coral', 15),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'M', 'Coral', 15),
('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'L', 'Coral', 5),
-- Copa Teen
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'XS', 'Lavanda', 20),
('c3d4e5f6-a7b8-9012-cdef-123456789012', 'S', 'Lavanda', 20),
-- Copa Premium
('d4e5f6a7-b8c9-0123-defa-234567890123', 'S', 'Champagne', 10),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'M', 'Champagne', 10),
('d4e5f6a7-b8c9-0123-defa-234567890123', 'L', 'Champagne', 5),
-- Copa Eco
('e5f6a7b8-c9d0-1234-efab-345678901234', 'S', 'Natural', 15),
('e5f6a7b8-c9d0-1234-efab-345678901234', 'M', 'Natural', 15);

-- ── Zonas de entrega ────────────────────────────
INSERT INTO delivery_zones (name, zone_type, is_active) VALUES
('Ágora Mall', 'plaza', true),
('Blue Mall', 'plaza', true),
('Galería 360', 'plaza', true),
('Downtown Center', 'plaza', true),
('Av. Winston Churchill', 'avenida', true),
('Av. 27 de Febrero', 'avenida', true),
('Av. Abraham Lincoln', 'avenida', true),
('Av. Sarasota', 'avenida', true),
('Piantini', 'sector', true),
('Naco', 'sector', true),
('Evaristo Morales', 'sector', true),
('Bella Vista', 'sector', true);

-- ── Promoción de ejemplo ────────────────────────
INSERT INTO promotions (name, discount_type, discount_value, start_date, end_date, is_active, product_ids) VALUES
(
  'Lanzamiento CopasMenstrualesRD',
  'percentage',
  15,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  true,
  ARRAY['a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c3d4e5f6-a7b8-9012-cdef-123456789012']::UUID[]
);
