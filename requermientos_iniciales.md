# Contexto del Proyecto

Eres un desarrollador experto. Tu tarea es construir un E-commerce.
El stack tecnológico que puedes elegir será:
a) PHP (Laravel) para el backend y frontend (Blade), junto con SQLite/MySQL para la base de datos.

b): Node.js (React) + Firebase (Auth y Firestore)

Por favor pregúntame antes de la elección y muéstrame argumentos.
A continuación, los requerimientos estrictos que debes programar. No agregues funcionalidades fuera de esta lista. Si se necesita un requerimiento que dependa de algo que no está explícitamente aquí, agrégalo al final de este documento.

## 1\. Usuarios y Autenticación

* [x] Implementar dos roles: Administrador y Cliente.
* [x] Los clientes deben poder registrarse para comprar.
* [x] Los usuarios no registrados (invitados) pueden navegar y ver el catálogo, pero no comprar.
* [x] Implementar un método para restablecer contraseña mediante un link o código enviado al correo del usuario.

## 2\. Interfaz Principal (Frontend)

* [x] Página de inicio con un carrusel o animaciones que muestren diferentes productos.
* [x] Sección en la página de inicio de "Recomendaciones" (mostrando lo que otros usuarios han comprado).
* [x] En el encabezado o pie de página, integrar el nombre del negocio y los enlaces a redes sociales (Instagram, X, TikTok, WhatsApp).

## 3\. Catálogo y Productos

* [x] Vista de detalles del producto que incluya: sección de valoración (sistema de estrellas y comentarios) y sección de preguntas frecuentes/dudas al proveedor.
* [x] Funcionalidad para que el cliente pueda marcar artículos como "Favoritos".

## 4\. Carrito y Compras (Checkout)

* [x] Crear un CRUD completo para el carrito de compras (agregar, editar cantidad, eliminar).
* [x] Flujo de checkout con medios de pago simulados (Crédito/Débito, PayPal, Google Pay).
* [x] El sistema debe poder generar y simular facturas.
* [x] Al finalizar la compra simulada, el sistema debe enviar por correo electrónico el ticket de compra, o el ticket y la factura.
* [x] Debe existir una página o sección accesible con las Políticas de Devolución.

## 5\. Simulación de Envío y Panel Admin

* [x] Desarrollar la lógica para gestionar y simular el estado del envío de una compra.
* [x] El Administrador debe tener un panel que muestre alertas cuando un producto tenga bajo stock.

