# Documento de Especificación de Producto (Spec-First)
**Proyecto:** TotalFlexGym Web Platform (MVP)  
**Dominio:** Fitness & Conversión Directa  
**Ubicación Objetivo:** Loja, Ecuador  

---

## 1. Visión del Producto

* **¿Para quién es?**  
  Atletas, estudiantes universitarios, profesionales y entusiastas del fitness en Loja que buscan un centro de entrenamiento integral con múltiples disciplinas y prefieren inscribirse o pedir información de forma inmediata desde su smartphone, sin intermediarios ni demoras por mensajería.

* **¿Qué estética tendrá?**  
  * **Estilo:** *Utility Industrial / Brutalismo Limpio*. Fondos oscuros de alto contraste (Dark Mode nativo `#09090B`), bordes definidos, tarjetas estructuradas en grid y tipografía sans-serif condensada de alto impacto en los encabezados.
  * **Visuales:** Cero ilustraciones 3D o vectores genéricos. Fotografía real y de alto contraste de las instalaciones de **TotalFlexGym** (zonas de pesas, tatami de MMA/Jiujitsu, salón de Spinning).
  * **Filosofía anti-slop:** Sin efectos visuales recargados ni animaciones lentas. Prioridad absoluta al rendimiento, la jerarquía de lectura y la claridad en los precios.

* **¿Qué problema soluciona?**  
  Elimina el cuello de botella tradicional de los gimnasios locales (donde la web es solo un folleto estático que obliga a chatear por WhatsApp para saber precios o pagar). Soluciona la fricción del usuario al permitir la selección de disciplina/plan y el pago directo en menos de 3 clics.

---

## 2. Usuarios y Casos de Uso

### Tipos de Usuario
1. **Visitante / Futuro Miembro:** Usuario que llega desde redes sociales o búsqueda local para conocer las instalaciones, precios y adquirir una membresía.
2. **Cliente Potencial en Duda:** Usuario interesado que aún no desea pagar la membresía completa, pero busca probar las instalaciones mediante un pase o consultar por WhatsApp.
3. **Administrador del Gimnasio:** Encargado de verificar los pagos entrantes, actualizar miembros activos y gestionar la base de datos desde pgAdmin 4.

### Casos de Uso Principales
* **CU-01:** Explorar áreas, instalaciones y oferta deportiva de TotalFlexGym.
* **CU-02:** Seleccionar un plan (Mensual, Trimestral, Anual) y pagar en línea con tarjeta de crédito/débito o PayPhone.
* **CU-03:** Solicitar un Pase de Prueba de 1 Día (Captura de Lead).
* **CU-04:** Contactar directamente por WhatsApp con contexto predefinido.

---

## 3. Funcionalidades (Módulos del Sistema)

### Módulo A: Landing Page Informativa & Prueba Social
* **Visualización de Áreas:** Grid interactivo mostrando las 9 disciplinas (*Bailoterapia, Pesas, Funcional, Box, MMA, Spinning, Pilates, Calistenia, Jiujitsu*) con fotos reales.
* **Propuesta de Valor:** Destacar el posicionamiento principal (*"El gimnasio más grande de Loja"*).
* **Social Proof & Ubicación:** Widget/Grid de opiniones de usuarios, horarios operativos y mapa de ubicación directo.

### Módulo B: Precios & Checkout Integrado
* **Tarjetero de Membresías:** Selección clara de planes con desglose de beneficios.
* **Modal / Iframe de Pago:** Formulario para ingresar datos básicos (Nombre, Email, WhatsApp, Cédula) e iniciar la transacción sin abandonar el flujo principal.

### Módulo C: Automatización y Procesamiento (Sistema)
* **Verificación de Pagos:** Recepción automatizada de webhooks confirmando la transacción.
* **Registro de Transacciones:** Creación automática del registro del usuario y estado de membresía en PostgreSQL.
* **Notificación Instantánea:** Envío automático de confirmación de pago o pase de prueba vía WhatsApp/Email al usuario.

---

## 4. Flujos de Usuario y Manejo de Errores

### Flujo Principal 1: Compra Directa de Membresía (Acción de Alta Prioridad)
[Inicio] -> [Revisar Tarifas] -> [Clic en "Inscribirme"] -> [Formulario Mínimo]
-> [Modal de Pago / PayPhone SDK] -> [Procesamiento] -> [Pantalla de Éxito + WhatsApp de Confirmación]

* **Manejo de Errores / Fallos:**
  * *Tarjeta rechazada o pago cancelado:* El sistema no cierra el modal, muestra una alerta clara (*"Pago no completado. Intenta con otra tarjeta o vía PayPhone"*) y mantiene los datos del formulario llenos para evitar reescritura.
  * *Caída de red durante el webhook:* Se registra el intento fallido en los logs del servidor; si el pago fue aprobado en la pasarela pero el webhook falló, el sistema permite la conciliación manual mediante la ID de transacción guardada en la base de datos.

### Flujo Secundario 2: Captura de Lead / Pase Gratis (Acción de Conversión Secundaria)
[Hero / Banner] -> [Clic en "Pase Gratis 1 Día"] -> [Formulario: Nombre + WhatsApp]
-> [Generación de Ticket/Código QR] -> [Envío automático por WhatsApp]

* **Manejo de Errores / Fallos:**
  * *Número de teléfono inválido o error en la API de WhatsApp:* El sistema muestra la confirmación en pantalla con un botón directo a WhatsApp con el mensaje pre-llenado para garantizar que el usuario reciba su pase.

---

## 5. Arquitectura del Sistema

               +-----------------------------------+
               |     Front-End (Mobile-First)      |
               |   (Next.js / Astro / React)       |
               +-----------------+-----------------+
                                 |
                                 v
               +-----------------+-----------------+
               |       API / Back-End (Node.js)    |
               |      o Serverless Edge Routes     |
               +--------+----------------+---------+
                        |                |
         Webhooks / SDK |                | SQL Queries
                        v                v
        +---------------+--+   +---------+---------+
        | Pasarela de Pago |   |    PostgreSQL   |
        |   (PayPhone /    |   |   (Easypanel /  |
        | Stripe Checkout) |   |    pgAdmin 4)   |
        +------------------+   +-------------------+

### Decisión de Arquitectura: ¿Backend Dedicado o Servicios Externos?
* **Respuesta para MVP:** **Híbrido Ligero (Node.js / Next.js Serverless Routes).**
* **Justificación:** 
  1. No necesitas un servidor monolítico complejo. Dado que vas a desplegar en tu VPS gestionado con **Easypanel**, un contenedor Node.js (o un marco tipo Next.js/Astro con Node) te permite servir la web optimizada y tener las rutas de backend API necesarias (`/api/checkout`, `/api/webhook`) en el mismo proyecto.
  2. **Base de Datos:** PostgreSQL corriendo en un contenedor dentro de Easypanel, conectado a pgAdmin 4 para tu administración directa.
  3. **Pasarela de Pago:** SDK/Iframe de la pasarela local (ej. PayPhone Ecuador) o Stripe Checkout. La lógica de cobro pesado recae en la pasarela; tu backend solo escucha el webhook para actualizar la BD.

---

## 6. Requisitos No Funcionales (Enfoque MVP)

* **Rendimiento y Tiempo de Carga:**
  * Tiempo de carga inicial (**First Contentful Paint**): **< 1.2 segundos** en conexiones móviles 4G.
  * Optimización estricta de imágenes (formato WebP/AVIF comprimido para las fotos de las 9 áreas del gimnasio).

* **Capacidad y Escalabilidad:**
  * Diseñado para soportar picos de hasta **100 usuarios concurrentes** sin degradación de servicio (sobrado para la infraestructura de un VPS básico en Easypanel).

* **Seguridad y Datos Sensibles:**
  * **Cumplimiento PCI-DSS:** **Cero almacenamiento de datos bancarios.** Los números de tarjeta de crédito/débito se procesan 100% dentro de la pasarela de pagos.
  * **Datos Personales:** Se almacenan únicamente Nombre, Correo, Teléfono/WhatsApp y Cédula en PostgreSQL.
  * Conexión obligatoria cifrada mediante certificado **SSL/TLS (HTTPS)** administrado automáticamente por Easypanel.