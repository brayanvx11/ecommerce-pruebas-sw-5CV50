# Plan de Acción y Mejoras del Sistema: 0x1 Tech

**Versión del documento:** 1.1
**Fecha:** 24 de octubre de 2026

Este documento detalla las mejoras de Experiencia de Usuario (UX) propuestas para la plataforma, así como el análisis y plan de remediación derivado del Informe de Pruebas (V 1.0) ejecutado el 20 de octubre de 2026.

## 1. Mejoras de Usabilidad (UX) y Estrategia de Catálogo

Para elevar la calidad del producto y hacerlo más intuitivo para el usuario final, se implementarán las siguientes mejoras a nivel de frontend e inventario:

### 1.1. Retroalimentación Interactiva y Empática

El nombre de la tienda cambia a “0x1 Tech”

Se integrará un sistema de notificaciones flotantes (*Toast Notifications* o *Snackbars*) para acompañar al usuario en cada paso de su viaje por la tienda.

* **Registro exitoso:** Al crear una cuenta, en lugar de un simple redireccionamiento, el usuario verá un mensaje cálido como: *"¡Ya estás con nosotros! Bienvenido a 0x1 Tech."*

* **Acciones del carrito:** Notificaciones claras al añadir, modificar o eliminar productos (ej. *"Producto agregado a tu carrito exitosamente"*).

* **Guardado de configuración:** Alertas visuales que confirmen cualquier cambio en el perfil.

### 1.2. Accesibilidad de Búsqueda (Regla de los "Dos Clics")

El buscador será un elemento central de la interfaz. El objetivo es que cualquier usuario pueda iniciar una búsqueda con un máximo de dos clics desde cualquier vista de la plataforma.

* **Implementación:** Barra de búsqueda siempre visible en el encabezado (Header) o un icono de lupa que despliegue un modal de búsqueda a pantalla completa sin necesidad de navegar a otra página.

### 1.3. Optimización Comercial del Catálogo (SEO Interno)

Para mejorar la tasa de conversión, se actualizará la base de datos de productos (Cloud Firestore):

* **Nombres más comerciales:** Se sustituirán los nombres genéricos por títulos más atractivos que destaquen el valor del producto (Ej. en lugar de *"Auriculares "*, usar *"Audifonos"*).

* También agrega más productos, al menos 50

* **Palabras clave (Tags/Sinónimos):** Se agregará un arreglo (`array`) oculto en la base de datos para cada producto con sinónimos y variaciones.

  * *Ejemplo:* Si el producto es "Auriculares Inalámbricos", el sistema también lo mostrará si el usuario teclea: *cascos, audífonos, audifonos bluetooth, diademas*.

## 2. Análisis del Informe de Pruebas y Plan de Remediación

Basado en el informe de QA, el sistema actualmente se encuentra en estado **Condicionado a Correcciones**. Aunque la arquitectura base (Firebase + React) es sólida y tiene un 100% de cobertura en la ejecución, existen 8 defectos y 3 brechas de funcionalidad que impiden el lanzamiento comercial.

A continuación, se presenta la priorización de tareas para el **Sprint de Estabilización**:

### 2.1. Tareas de Prioridad Crítica (Bloqueantes)

Estas tareas deben resolverse primero, ya que comprometen la seguridad y la funcionalidad principal del E-commerce:

* **\[BUG-AUTH-01\] Control de Roles (RBAC):** Reparar la lógica de inicio de sesión y registro. Actualmente el sistema no restringe quién puede asignarse el rol de Administrador. Se debe validar el rol desde Firestore o mediante *Custom Claims* de Firebase antes de dar acceso al panel.

* **\[BUG-PAY-01\] y \[BUG-BILL-01\] Validaciones de Checkout:** Implementar expresiones regulares (Regex) y validadores HTML5 obligatorios en la pasarela de pagos simulada.

  * Tarjeta: Forzar 16 dígitos.

  * CVV: Forzar 3 o 4 dígitos.

  * RFC: Validar formato alfanumérico de 12-13 caracteres.

  * Forzar campos vacíos de dirección y Razón Social.

* **\[BUG-MAIL-01\] Configuración del Mailer:** Conectar el servicio de envío de correos (ej. Nodemailer, Resend o Firebase Extensions) para asegurar que el usuario reciba su ticket de compra y factura digital de manera real.

### 2.2. Tareas de Prioridad Media (Experiencia e Integridad)

* **\[RFN02\] Resiliencia Offline:** Corregir el guardado en `localStorage`. El sistema debe mantener el carrito y la sesión visible aunque el usuario pierda temporalmente la conexión a internet.

* **\[BUG-AUTH-02\] Validación de Nombres:** Ajustar el formulario de registro para exigir al menos un nombre y un apellido (dos palabras separadas por un espacio).

* **\[BUG-AUTH-03\] Verificación de Correo:** Implementar la función `sendEmailVerification` de Firebase Auth para evitar cuentas fantasma.

* **\[BUG-AUTH-04\] Control de *Rate Limiting*:** Capturar el error `auth/too-many-requests` tras un restablecimiento de contraseña y mostrar un mensaje amigable en la interfaz en lugar de "romper" la vista.

### 2.3. Nuevas Características (Brechas Detectadas)

El equipo de diseño y desarrollo deberá maquetar y conectar tres nuevas vistas obligatorias:

1. **\[GAP-01\] Panel de Edición de Perfil:** Vista para actualizar dirección, nombre y contraseña.

2. **\[GAP-02\] Historial de Pedidos:** Sección "Mis Compras" donde el cliente pueda descargar facturas anteriores.

3. **\[GAP-03\] Monitor de Envíos (Lado Cliente):** Interfaz donde el usuario pueda ver si su paquete está "Procesando", "En camino" o "Entregado", en sincronía con los cambios que hace el administrador.

### 2.4. Tareas Menores (Mantenimiento)

* **\[BUG-UI-01\] Enlaces de Footer:** Reparar los *href* de los botones de TikTok y WhatsApp para que redireccionen correctamente a las cuentas institucionales de 0x1 Tech.
