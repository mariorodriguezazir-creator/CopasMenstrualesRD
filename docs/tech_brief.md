Tech Brief — CopasMenstrualesRD
Stack Aprobado
Capa	Tecnología	Justificación
Frontend + API	Next.js 15 (App Router)	SSR/SEO, API Routes, ecosystem maduro
Base de datos	Supabase (PostgreSQL)	Preferencia del dev, RLS nativa, Storage para imágenes
UI	Tailwind CSS + Shadcn/ui	Mobile-first, accesible, rápido
Estado carrito	Zustand	Liviano, persistible en localStorage
Pagos	PayPal SDK (@paypal/react-paypal-js)	Disponible en RD, integrado con Next.js 15
WhatsApp MVP	Enlace wa.me pre-llenado	Cero infraestructura, funciona desde día 1
WhatsApp should	WhatsApp Cloud API (Meta)	Notificaciones automáticas, gratis hasta 1k conv/mes
IA Chatbot	Gemini API gemini-1.5-flash	Rápido, económico, system prompt configurable
Deploy	Vercel	Integración nativa con Next.js
Arquitectura
text
┌─────────────────────────────────────────────┐
│              Next.js 15 App                  │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │  /storefront  │  │   /admin (protegido)  │ │
│  │  - Catálogo   │  │   - Inventario        │ │
│  │  - Carrito    │  │   - Pedidos           │ │
│  │  - Checkout   │  │   - Promociones       │ │
│  └──────┬───────┘  │   - Zonas entrega      │ │
│         │          └──────────┬─────────────┘ │
│  ┌──────▼──────────────────────▼───────────┐ │
│  │  /api/products   /api/orders             │ │
│  │  /api/chat       /api/delivery-zones     │ │
│  │  /api/admin/*                            │ │
│  └──────┬──────────────────────────────────┘ │
└─────────┼────────────────────────────────────┘
          │
    ┌─────▼──────┐  ┌──────────┐  ┌────────────┐  ┌──────────────────┐
    │  Supabase  │  │ PayPal   │  │ Gemini API │  │ wa.me/18094670365│
    │  DB + RLS  │  │ SDK/API  │  │  (Flash)   │  │ → should:        │
    │  Storage   │  └──────────┘  └────────────┘  │ WA Cloud API     │
    └────────────┘                                 └──────────────────┘
Modelo de Datos (Supabase)
sql
products
  id uuid PK, name text, description text, price numeric,
  images text[], stock int, is_active bool, created_at timestamptz

product_variants
  id uuid PK, product_id FK, size text, color text,
  stock int, price_override numeric

promotions
  id uuid PK, name text, discount_type (percentage|fixed),
  discount_value numeric, start_date date, end_date date,
  is_active bool, product_ids uuid[]   -- selección manual

delivery_zones
  id uuid PK, name text,
  zone_type (plaza|avenida|sector),
  is_active bool, created_at timestamptz

orders
  id uuid PK, contact_name text, contact_phone text,
  contact_email text, delivery_zone_id FK → delivery_zones,
  delivery_reference text,             -- texto libre de precisión
  items jsonb, subtotal numeric, discount numeric, total numeric,
  payment_method (paypal|transfer|cod),
  payment_status (PAID|PENDING_PAYMENT|PENDING_COD|CONFIRMED),
  whatsapp_notified bool default false,
  notes text, created_at timestamptz

order_status_history
  id uuid PK, order_id FK, status text, changed_at timestamptz
Variables de Entorno
bash
# ── Server only ──────────────────────────────────
PAYPAL_CLIENT_SECRET=
GEMINI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USER_ID=                    # UUID del admin en Supabase Auth
WHATSAPP_CLOUD_API_TOKEN=         # should tier

# ── Public (intencional) ─────────────────────────
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_WHATSAPP_NUMBER=18094670365   # sin + para wa.me
⚠️ RD usa código de país +1 (NANP), por lo que wa.me/18094670365 es el formato correcto.
​

Seed Inicial
Script supabase/seed.sql con los 5 productos iniciales. Imágenes subidas manualmente al bucket products/ en Supabase Storage con política pública de lectura.
​

🔒 Security Brief
Superficies de ataque:

Panel admin expuesto a internet

POST /api/orders — price tampering

Chatbot — prompt injection

Subida de imágenes desde el panel admin

delivery_zone_id — envío de zona falsa desde el cliente

Auth Strategy — Admin Único:

Una sola cuenta en Supabase Auth (email + password)

Verificación: user.id === process.env.ADMIN_USER_ID en middleware.ts
​

Sesión server-side con cookies HttpOnly via @supabase/ssr

Protección de todas las rutas /admin/* y /api/admin/* en middleware.ts

OWASP Relevantes:

A01 Broken Access Control: rutas admin validadas únicamente en server

A03 Injection: todos los inputs sanitizados con Zod antes de llegar a Supabase

A05 Misconfiguration: vars sensibles solo en server; NEXT_PUBLIC_ solo para datos intencionales

A10 SSRF via chatbot: /api/chat solo llama a Gemini desde server; nunca expone URLs del sistema

Datos sensibles:

PAYPAL_CLIENT_SECRET, GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, ADMIN_USER_ID → solo server

NEXT_PUBLIC_WHATSAPP_NUMBER → público por diseño (número de negocio)

Datos de contacto de clientas (email, teléfono) → RLS restringida: solo admin puede leer

ADRs
ADR-001: Carrito en localStorage + sessionId — sin tabla de sesiones en BD

Trade-off: Se pierde si la clienta limpia el storage

ADR-002: Transferencia bancaria como PENDING_PAYMENT — confirmación manual via WhatsApp

Trade-off: Requiere revisión manual del admin; orden no se confirma automáticamente

ADR-003: Gemini gemini-1.5-flash con system prompt restrictivo en server

Trade-off: Menor razonamiento que Pro; suficiente para FAQ de producto

ADR-005: Admin único validado por ADMIN_USER_ID env var — sin tabla de roles

Motivo: Reduce superficie de ataque; no hay necesidad de RBAC con un solo admin

Trade-off: Si en el futuro se necesitan más admins, requiere migrar a tabla de roles

ADR-006: WhatsApp en 2 fases — MVP wa.me estático → Should: WhatsApp Cloud API

Motivo: Cero infraestructura en v1; Cloud API se activa cuando el volumen lo justifique

Trade-off MVP: La clienta debe enviar el comprobante manualmente; no es automático

❓ Preguntas abiertas
Ninguna. Todas cerradas. ✅