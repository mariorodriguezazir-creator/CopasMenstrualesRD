Product Requirements Document — CopasMenstrualesRD
Resumen
Plataforma web D2C para la venta de copas menstruales bajo la marca CopasMenstrualesRD. Incluye vitrina de productos, carrito, checkout en 3 pasos, panel de administración de inventario/promociones, notificaciones por WhatsApp y chatbot IA para atención al cliente.

Problema
El negocio no tiene canal de ventas digital. Las clientas no pueden ver catálogo, comparar productos ni realizar compras sin contacto directo, lo que limita el volumen de ventas y la disponibilidad de atención.

Usuarios
Rol	Descripción	Pain Point
Compradora	Mujer menstruante, 15–45 años, RD	No sabe qué talla/modelo elegir; desconfía comprar sin orientación
Admin (único)	Dueña del negocio	Gestiona inventario manual; no puede aplicar descuentos rápido; recibe pedidos por WhatsApp de forma no estructurada
Requisitos Must / Should / Could
Must (lanzamiento):

Catálogo de 5 productos iniciales con variantes (talla, modelo)

Carrito persistente sin login de usuario

Checkout en exactamente 3 pasos: Carrito → Datos + Pago → Confirmación

Métodos de pago: PayPal, transferencia bancaria, contra entrega

Contra entrega disponible solo en Santo Domingo, zonas de alta accesibilidad gestionadas por la admin

Al elegir transferencia → botón "Enviar comprobante por WhatsApp" con enlace wa.me/18094670365 pre-llenado con ORDER_ID

Panel admin (cuenta única): CRUD de productos, stock, promociones con selección manual de productos, CRUD de zonas de entrega

Chatbot IA (Gemini Flash) con contexto de copas menstruales, pedidos, envíos y horarios

Diseño mobile-first

Should (post-lanzamiento):

Búsqueda y filtros en catálogo (talla, precio, disponibilidad)

Badges automáticos "Oferta" / "Agotado"

Notificación automática al admin por WhatsApp Cloud API cuando llega un pedido nuevo

Email transaccional a la clienta via Resend

Could (futuro):

Historial de pedidos por número de orden

Reseñas de productos

Cupones individuales

Expansión de zonas de entrega fuera de Santo Domingo

KPIs Medibles
Checkout completado en ≤ 3 pasos — verificable por flujo de navegación

Respuesta del chatbot < 2 segundos (p95)

Tiempo de carga de vitrina < 2s en 3G (Lighthouse ≥ 85)

Admin aplica descuento en ≤ 2 minutos desde el panel

Out of Scope
Sistema de logística / tracking de envíos

Registro y login de usuarios finales

Múltiples cuentas de administrador

Reseñas en v1

App móvil nativa

Envíos fuera de Santo Domingo en v1

❓ Preguntas abiertas
Ninguna. Todas cerradas. ✅