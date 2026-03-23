Feature Requirements — CopasMenstrualesRD
US-01 · Ver Catálogo de Productos
Como compradora
Quiero ver todos los productos disponibles con foto, nombre, precio y si hay oferta
Para decidir qué copa comprar sin necesidad de contactar al negocio

AC:

Given que el catálogo tiene productos activos, When la clienta entra a /, Then ve una grid de productos con imagen, nombre, precio y badge de oferta si aplica

Given que un producto tiene stock = 0, When la clienta lo ve en el catálogo, Then aparece badge "Agotado" y el botón "Agregar al carrito" está deshabilitado

Given que hay una promoción activa para ese producto, When la clienta lo ve, Then el precio original aparece tachado junto al precio rebajado

Given que no hay productos activos, When la clienta entra al catálogo, Then ve estado vacío con mensaje orientador

Edge Cases:

Imagen rota → mostrar placeholder de imagen

Sin productos activos → mensaje de estado vacío

DoD: Renderiza con SSR desde Supabase, precios calculados en server, accesibilidad AA (contraste, alt text en imágenes), test E2E del happy path

🧪 Test Requirements:

Unit: Función que calcula final_price con descuento aplicado (porcentaje y fijo)

Integration: GET /api/products devuelve solo is_active = true; precio rebajado calculado en server

E2E: Badge "Oferta" visible con promo activa; botón "Agregar" deshabilitado con stock = 0

🔒 Security AC: Precios calculados únicamente en server — el cliente solo recibe final_price ya computado; nunca calcula descuentos en el frontend

US-02 · Agregar al Carrito
Como compradora
Quiero agregar productos al carrito y ver el resumen
Para acumular mi compra antes de pagar

AC:

Given que la clienta hace click en "Agregar al carrito", When el producto tiene stock, Then el contador del ícono de carrito se actualiza en tiempo real

Given que la clienta refresca la página, When tiene ítems en el carrito, Then el carrito mantiene los mismos ítems (persistencia localStorage)

Given que intenta agregar más unidades que el stock disponible, When hace click, Then muestra toast: "Solo quedan X unidades disponibles" y no agrega

DoD: Estado gestionado con Zustand persistido en localStorage, test unitario de límite de stock

🧪 Test Requirements:

Unit: No permitir cantidad > stock disponible; incrementar contador correctamente

E2E: Carrito persiste después de F5; contador en navbar actualiza al agregar producto

US-03 · Checkout en 3 Pasos
Como compradora
Quiero completar mi compra en 3 pasos claros
Para no perderme en un proceso de pago confuso

Pasos definidos:

Paso 1 — Resumen de carrito: ítems, cantidades, subtotal, descuentos aplicados, total final

Paso 2 — Contacto + Pago: nombre, teléfono, email, selección de método de pago; si elige contra entrega → selector de zona + campo de texto libre para referencia exacta

Paso 3 — Confirmación: número de orden generado, instrucciones según método de pago, resumen del pedido

AC:

Given que elige PayPal, When completa el pago en el widget, Then orden creada con PAID y paso 3 muestra número de orden

Given que elige transferencia bancaria, When confirma, Then orden creada con PENDING_PAYMENT y el paso 3 muestra datos bancarios + botón "Enviar comprobante por WhatsApp" que abre wa.me/18094670365?text=Mi+número+de+orden+es+[ORDER_ID]

Given que elige contra entrega, When selecciona una zona del dropdown y escribe su referencia exacta, Then orden creada con PENDING_COD y paso 3 muestra instrucciones de entrega

Given que elige contra entrega pero no llena el campo de texto libre, When intenta avanzar, Then error inline "Ingresa una referencia de ubicación exacta" y no puede avanzar

Given que el dropdown de zonas no tiene zonas activas, When la clienta elige contra entrega, Then se muestra: "Contra entrega no disponible en este momento. Contáctanos por WhatsApp" con enlace wa.me/18094670365

Given que PayPal cancela el pago, When ocurre, Then la orden NO se crea y muestra error con opción de reintentar

Given que la clienta hace back desde paso 2, When regresa al paso 1, Then el carrito conserva todos sus ítems

UX del selector de zona:

text
Método: [x] Contra entrega

Zona de entrega:
[▼ Selecciona una zona]     ← dropdown desde delivery_zones (BD)
   > Ágora Mall
   > Blue Mall
   > Av. Winston Churchill
   > Av. 27 de Febrero
   > ... (gestionadas por admin)

Referencia exacta: [________________________________]  ← obligatorio
  Ej: "Entrada principal, frente al Banco Popular"
Edge Cases:

Pérdida de conexión en paso 2 → error de red, datos del formulario se conservan

delivery_zone_id manipulado desde cliente → validado en server contra BD

DoD: Flujo E2E completo con PayPal sandbox, URL wa.me generada correctamente con ORDER_ID, validación de zona en server, texto libre sanitizado

🧪 Test Requirements:

Unit: Generación de URL wa.me con ORDER_ID correcto; delivery_reference vacío bloquea avance; Zod valida email y teléfono RD

Integration: POST /api/orders con transferencia → PENDING_PAYMENT; con delivery_zone_id inexistente → 400; con delivery_reference vacío en COD → 400

E2E: Happy path PayPal sandbox completo; botón WhatsApp en paso 3 abre URL correcta; campo referencia vacío bloquea avance; dropdown vacío muestra mensaje alternativo

🔒 Security AC:

Total recalculado en server; si difiere del cliente → 400 (price tampering)

delivery_zone_id validado en server contra tabla delivery_zones

delivery_reference sanitizado con Zod (max 200 chars, sin HTML)

Datos de contacto almacenados en Supabase con RLS solo-admin

US-04 · Chatbot IA
Como compradora
Quiero preguntarle a una asistente sobre copas, pedidos, envíos y horarios
Para resolver mis dudas sin llamar al negocio

AC:

Given que la clienta escribe una pregunta sobre tallas de copa, When envía, Then el chatbot responde en < 2 segundos con información relevante

Given que pregunta por el estado de un pedido y proporciona su número de orden, When envía, Then el chatbot consulta el estado en BD y responde con el estado actual

Given que pregunta algo fuera del dominio, When envía, Then el chatbot responde: "Solo puedo ayudarte con preguntas sobre nuestras copas menstruales, pedidos y horarios de atención."

Given que el widget está cerrado, When la clienta hace click en el ícono flotante, Then el chat se abre con un mensaje de bienvenida

Given que Gemini API no está disponible, When la clienta envía un mensaje, Then muestra: "En este momento no puedo responder. Contáctanos al WhatsApp" con enlace wa.me/18094670365

Given que la clienta intenta enviar un mensaje vacío, When hace click en enviar, Then el botón no dispara ningún request

System Prompt (definición):
El prompt instruye a Gemini a ser una asistente especializada en copas menstruales de CopasMenstrualesRD, con acceso a: (a) catálogo de productos inyectado como contexto, (b) horarios del negocio como constante, (c) estado de pedido consultado dinámicamente si se provee un número de orden válido. Fuera de esos dominios → respuesta de scope estándar. El system prompt vive únicamente en server, nunca se expone al cliente.

DoD: Widget flotante en todas las páginas, rate limit de 10 req/min por IP, test de prompt injection, respuesta < 2s medida en integración

🧪 Test Requirements:

Unit: Función que construye el prompt con contexto de productos inyectado; mensaje vacío → no dispara request

Integration: POST /api/chat con pregunta válida → respuesta < 2s (Gemini mocked); pregunta fuera de scope → mensaje estándar; > 10 req/min → 429

E2E: Abrir chat → escribir pregunta → recibir respuesta visible en pantalla

Security: Payload con "Ignora instrucciones anteriores..." → retorna mensaje de scope, nunca el system prompt

🔒 Security AC:

Rate limit de 10 requests/minuto por IP en /api/chat (prevención de abuso de API key)

System prompt nunca expuesto al cliente — solo existe en variables de server

Mensajes del chat no se almacenan en BD en v1 (privacidad)

US-05 · Panel Admin — Inventario, Promociones y Zonas
Como admin única del negocio
Quiero gestionar productos, promociones y zonas de entrega desde un panel protegido
Para mantener el catálogo actualizado y controlar la operación del negocio

AC — Productos:

Given que el admin está autenticado, When accede a /admin/products, Then ve la lista de los 5 productos con stock, precio y estado (activo/inactivo)

Given que crea o edita un producto, When guarda, Then el cambio se refleja en la vitrina en < 5s

Given que un producto queda con stock = 0 y se deja activo, When la clienta lo ve en vitrina, Then aparece badge "Agotado" y el botón de agregar está deshabilitado

AC — Promociones (selección manual):

Given que el admin crea una promoción, When selecciona manualmente los productos a los que aplica y define fechas de inicio y fin, Then solo esos productos muestran el precio rebajado en la vitrina al llegar la fecha de inicio

Given que una promoción expira (fecha fin pasada), When ocurre automáticamente, Then los productos regresan a su precio original sin acción manual

Given que el admin activa una promo en el producto A y el producto C, When la vitrina carga, Then solo A y C muestran badge "Oferta"; B, D y E conservan su precio normal

AC — Zonas de Entrega:

Given que el admin accede a /admin/delivery-zones, When carga la página, Then ve la lista de zonas con nombre, tipo y estado

Given que el admin crea una zona nueva con nombre y tipo, When guarda, Then aparece disponible en el dropdown de checkout inmediatamente

Given que el admin desactiva una zona, When lo hace, Then deja de aparecer en el dropdown sin eliminar pedidos previos que la referencian

Given que el admin intenta eliminar una zona con pedidos asociados, When lo intenta, Then el sistema bloquea con: "Esta zona tiene pedidos asociados. Solo puedes desactivarla."

AC — Acceso y sesión:

Given que un usuario no autenticado intenta acceder a /admin, When hace la request, Then es redirigido a /admin/login

Given que el admin cierra sesión, When lo hace, Then la cookie se invalida en el server y no puede volver a acceder sin re-autenticarse

DoD: CRUD completo de productos, promociones con selección manual de productos y fechas automáticas, CRUD de zonas con protección de integridad referencial, sesión protegida con ADMIN_USER_ID, test E2E de creación y verificación en vitrina

🧪 Test Requirements:

Unit: Expiración automática de promo por fecha; promo en productos [A,C] no afecta a B, D, E; bloqueo de eliminación de zona con pedidos asociados

Integration: PATCH /api/admin/products/:id sin token → 401; POST /api/admin/delivery-zones sin token → 401; zona desactivada → no aparece en GET /api/delivery-zones; promo con product_ids=[A,C] → solo A y C retornan precio rebajado

E2E: Admin crea producto → aparece en vitrina en < 5s; admin crea promo en 2 productos → solo esos 2 muestran badge "Oferta"; admin crea zona → aparece en dropdown; admin desactiva zona → desaparece del dropdown

🔒 Security AC:

Todas las rutas /api/admin/* verifican user.id === ADMIN_USER_ID en server mediante middleware Next.js

Imágenes subidas a Supabase Storage con validación de MIME type en server (solo image/jpeg, image/png, image/webp)

Sin tabla de roles: superficie de ataque mínima para cuenta única de admin

❓ Preguntas abiertas
Ninguna. Todas cerradas. ✅

Estado Global de Specs ✅