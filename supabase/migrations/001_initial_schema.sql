-- ============================================
-- CopasMenstrualesRD — Initial Schema
-- 6 tables + RLS policies
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Products ────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Product Variants ────────────────────────────
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  price_override NUMERIC(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Promotions ──────────────────────────────────
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  product_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_date >= start_date)
);

-- ── Delivery Zones ──────────────────────────────
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  zone_type TEXT NOT NULL CHECK (zone_type IN ('plaza', 'avenida', 'sector')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Orders ──────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES delivery_zones(id),
  delivery_reference TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal', 'transfer', 'cod')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT'
    CHECK (payment_status IN ('PAID', 'PENDING_PAYMENT', 'PENDING_COD', 'CONFIRMED')),
  whatsapp_notified BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Order Status History ────────────────────────
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- RLS Policies
-- ============================================

-- Products: public read for active, admin full access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products: public read active"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Products: admin full access"
  ON products FOR ALL
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- Product Variants: public read, admin full access
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants: public read"
  ON product_variants FOR SELECT
  USING (true);

CREATE POLICY "Variants: admin full access"
  ON product_variants FOR ALL
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- Promotions: public read active, admin full access
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promotions: public read active"
  ON promotions FOR SELECT
  USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Promotions: admin full access"
  ON promotions FOR ALL
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- Delivery Zones: public read active, admin full access
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Zones: public read active"
  ON delivery_zones FOR SELECT
  USING (is_active = true);

CREATE POLICY "Zones: admin full access"
  ON delivery_zones FOR ALL
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- Orders: admin only (contact data is sensitive)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders: insert (anyone can create)"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders: admin read"
  ON orders FOR SELECT
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

CREATE POLICY "Orders: admin update"
  ON orders FOR UPDATE
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- Order Status History: admin only
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Status History: insert (system)"
  ON order_status_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Status History: admin read"
  ON order_status_history FOR SELECT
  USING (auth.uid()::text = current_setting('app.admin_user_id', true));

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_promotions_active_dates ON promotions(is_active, start_date, end_date);
CREATE INDEX idx_delivery_zones_active ON delivery_zones(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_order_history_order ON order_status_history(order_id);
