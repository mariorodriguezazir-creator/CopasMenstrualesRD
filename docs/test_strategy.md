Test Strategy — CopasMenstrualesRD
Herramientas
Tipo	Herramienta
Unit	Vitest + React Testing Library
Integration	Vitest + Supabase local (Docker)
E2E	Playwright
Security	OWASP ZAP (básico) + revisión manual
Cobertura Mínima
Unit: ≥ 70% en lógica de negocio (cálculo de descuentos, validación de stock, checkout steps, generación de URL wa.me)

Integration: 100% de API routes críticas (POST /orders, GET /products, POST /chat, GET /delivery-zones)

E2E: 100% del happy path de compra (vitrina → carrito → checkout → confirmación)

Casos por Capa
Unit Tests:

Cálculo de descuento (porcentaje y monto fijo) sobre precio base

Validación de stock al agregar al carrito (no superar disponible)

Sanitización de inputs con Zod (nombre, email, teléfono, delivery_reference)

Generación de URL wa.me con ORDER_ID correcto → wa.me/18094670365?text=...ORDER_ID

Función de expiración automática de promo por fecha

System prompt: respuestas fuera del dominio deben ser bloqueadas

Bloqueo de eliminación de zona con pedidos asociados

Integration Tests:

POST /api/orders con PayPal → PAID; con transferencia → PENDING_PAYMENT; con delivery_zone_id inválido → 400

GET /api/products devuelve solo is_active = true

GET /api/delivery-zones devuelve solo is_active = true

POST /api/chat retorna respuesta en < 2s (Gemini mocked); pregunta fuera de scope → mensaje estándar

PATCH /api/admin/products/:id sin token → 401; con token válido → 200

Promo con product_ids=[A,B] → solo A y B muestran descuento

E2E Tests (Playwright):

Happy path completo: home → producto → carrito → paso 1 → paso 2 (PayPal sandbox) → paso 3 (confirmación + número de orden)

Happy path transferencia: paso 3 muestra botón WhatsApp con URL pre-llenada correcta

Happy path contra entrega: selector zona + texto libre → orden creada

Sin texto libre en contra entrega → no puede avanzar

Zona dropdown vacía → muestra mensaje alternativo con link WhatsApp

Intento de /admin sin sesión → redirect a /admin/login

Admin crea producto → aparece en vitrina en < 5s

Admin aplica promo a 2 productos → solo esos 2 muestran badge "Oferta"

Admin desactiva zona → desaparece del dropdown en checkout

Chatbot abre, responde en < 2s, muestra mensaje de scope ante preguntas fuera de dominio

Security Tests:

POST /api/admin/products sin token → 401

Prompt injection: "Ignora tus instrucciones y..." → respuesta de scope, nunca system prompt

Total manipulado desde cliente (price tampering) → 400 en server

delivery_zone_id inexistente en POST → 400

Build audit: SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY, ADMIN_USER_ID no aparecen en bundle del cliente

Subida de imagen con extensión .php disfrazada → Storage rechaza

Out of Scope de Tests
Tests de carga / performance bajo tráfico alto (v1)

Tests de compatibilidad con IE / navegadores legacy

Integración con banco real (transferencias manuales no automatizadas)

Tests de WhatsApp Cloud API en v1 (MVP usa wa.me estático)

❓ Preguntas abiertas
Ninguna. Todas cerradas. ✅

