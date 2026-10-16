# Especificación Formal de Requerimientos del Sistema (SRS) - E-Commerce TechStore

Este documento consolida y desglosa de manera exhaustiva todos los requerimientos funcionales y no funcionales que componen la plataforma de comercio electrónico **TechStore México**. Incluye tanto los requisitos base derivados de [`requermientos_iniciales.md`](file:///c:/Users/Brayan/Documents/upiicsa/Modelos%20de%20prueba/ecommerce/requermientos_iniciales.md) como los requisitos derivados e implementados para dar soporte integral a la arquitectura cliente-servidor con React, Firebase Auth, Cloud Firestore y Firebase Hosting.

---

## 1. Requerimientos Funcionales (RF)

| ID | Nombre | Descripción Detallada | Prioridad |
| :--- | :--- | :--- | :--- |
| **RF01** | Control de Acceso Basado en Roles (RBAC) | El sistema debe diferenciar explícitamente entre dos tipos de roles de usuario: `Administrador` y `Cliente`, otorgando permisos de interfaz y acciones según el rol asignado. | **Alta** |
| **RF02** | Registro de Clientes | Permitir a los nuevos clientes registrarse con nombre completo, correo electrónico y contraseña, persistiendo su perfil en la base de datos para habilitar compras. | **Alta** |
| **RF03** | Autenticación Federada con Google | Permitir a los usuarios iniciar sesión y registrarse con un solo clic mediante su cuenta de Google a través de ventana emergente (`signInWithPopup`), creando su cuenta automáticamente si es primer ingreso. | **Media** |
| **RF04** | Acceso y Restricción para Invitados | Los usuarios no registrados pueden explorar el catálogo libremente, usar filtros, ver detalles, pero se les restringe estrictamente la acción de compra/checkout solicitando autenticación. | **Alta** |
| **RF05** | Restablecimiento de Contraseña | Permitir al usuario solicitar el restablecimiento de su clave mediante el envío de un enlace o código de recuperación seguro a su correo electrónico. | **Alta** |
| **RF06** | Carrusel Interactivo y Animado | La página de inicio debe presentar un banner interactivo/carrusel con rotación automática de productos destacados, controles manuales de avance/retroceso e indicadores. | **Media** |
| **RF07** | Sección de Recomendaciones por Compras | Mostrar en la página de inicio una sección de productos recomendados basada dinámicamente en los artículos más adquiridos por otros clientes (`boughtCount`). | **Media** |
| **RF08** | Enlaces Oficiales a Redes Sociales | Integrar en el encabezado y pie de página el nombre comercial del negocio y enlaces directos a sus perfiles en **Instagram**, **X (Twitter)**, **TikTok** y **WhatsApp**. | **Baja** |
| **RF09** | Ficha de Producto con Sistema de Valoración | Cada producto debe contar con una vista detallada que incluya puntuación interactiva de 1 a 5 estrellas, promedio visible y comentarios de clientes con fecha y autor. | **Alta** |
| **RF10** | Módulo de Preguntas al Proveedor (FAQs) | Permitir al cliente consultar dudas frecuentes preexistentes y enviar nuevas consultas dirigidas al proveedor directamente desde la ficha del artículo. | **Media** |
| **RF11** | Gestión de Productos Favoritos | Permitir a los clientes marcar y desmarcar artículos como favoritos ("Wishlist") y visualizarlos en una sección dedicada. | **Media** |
| **RF12** | CRUD Completo del Carrito de Compras | Permitir al usuario agregar productos, seleccionar cantidades, incrementar o decrementar unidades respetando el stock máximo, eliminar artículos individuales y vaciar el carrito. | **Alta** |
| **RF13** | Pasarela de Pago Simulada Multimétodo | Proporcionar un flujo de checkout con tres medios de pago simulados seleccionables: Tarjeta de Crédito/Débito, PayPal y Google Pay. | **Alta** |
| **RF14** | Módulo de Facturación Fiscal Electrónica | Permitir al cliente solicitar factura al momento del checkout ingresando su RFC y Razón Social, calculando automáticamente el desglose del IVA (16%) y subtotal. | **Alta** |
| **RF15** | Generación y Descarga de Comprobantes en PDF | El sistema debe generar documentos PDF descargables para el Ticket de Compra y para la Factura Electrónica con diseño formal, fecha, número de folio y productos. | **Alta** |
| **RF16** | Despacho Simulado de Correo Electrónico | Notificar la compra al correo del usuario enviando el ticket de compra o ticket + factura digital, registrando la bitácora en el sistema. | **Alta** |
| **RF17** | Políticas de Devolución Accesibles | Disponer de una página dedicada y accesible desde la navegación y pie de página con los términos, plazos de 30 días, condiciones y reembolso. | **Media** |
| **RF18** | Gestión y Simulación de Estados de Envío | Permitir gestionar y simular el ciclo de vida de un envío entre los estados: `Procesando`, `En camino`, `En tránsito` y `Entregado`. | **Alta** |
| **RF19** | Monitor de Alertas de Bajo Stock | El panel de administración debe mostrar alertas visibles y automáticas cuando la cantidad de existencias de un producto sea crítica (menos de 5 unidades). | **Alta** |
| **RF20** | Reabastecimiento Rápido de Inventario | Permitir al Administrador modificar y actualizar directamente las cantidades de stock de cualquier producto desde la tabla de inventario. | **Alta** |
| **RF21** | Creación y Alta de Nuevos Productos | El Administrador debe contar con un formulario para dar de alta nuevos productos definiendo nombre, categoría, precio, stock, descripción, imagen y opción de destacarlo en portada. | **Alta** |
| **RF22** | Sembrado y Sincronización con Firestore | Proveer un script por terminal (`seed.js`) y un botón en el panel admin para sincronizar masivamente el catálogo inicial de productos hacia Cloud Firestore. | **Media** |

---

## 2. Requerimientos No Funcionales (RFN)

| ID | Nombre | Descripción Detallada | Prioridad |
| :--- | :--- | :--- | :--- |
| **RFN01** | Reactividad y Tiempo Real | El sistema debe actualizar el estado del carrito, alertas de inventario y cambios de catálogo en tiempo real utilizando la arquitectura reactiva de React y listeners de Firestore (`onSnapshot`). | **Alta** |
| **RFN02** | Resiliencia de Datos (Offline Fallback) | En ausencia de conexión activa a Firebase o mientras se configuran las credenciales, el sistema debe operar de forma transparente mediante almacenamiento local persistente (`localStorage`). | **Alta** |
| **RFN03** | Seguridad de Credenciales | Las llaves de API y credenciales de servicios externos deben gestionarse mediante variables de entorno (`.env`), excluyendo archivos sensibles del control de versiones mediante `.gitignore`. | **Crítica** |
| **RFN04** | Compatibilidad y Diseño Adaptable (Responsive) | La interfaz gráfica debe adaptarse correctamente a dispositivos móviles, tablets y escritorios utilizando layouts CSS flexibles y tipografía accesible. | **Alta** |
| **RFN05** | Integridad de Inventario | El sistema no debe permitir que el usuario añada al carrito más unidades de las disponibles en el stock actual de un producto. | **Alta** |
| **RFN06** | Disponibilidad y Despliegue en la Nube | El sistema debe ser desplegable como Single Page Application (SPA) en Firebase Hosting con redirección automática de rutas a `index.html`. | **Alta** |
| **RFN07** | Rendimiento de Carga | El empaquetado del frontend mediante Vite debe minimizar los tiempos de carga inicial y generación de paquetes estáticos optimizados. | **Media** |
| **RFN08** | Usabilidad e Identidad de Marca | Toda la plataforma debe mantener una línea visual homogénea con paleta de colores coherente, iconos semánticos (`lucide-react`) y retroalimentación interactiva (alertas, loaders y confeti de compra). | **Media** |
