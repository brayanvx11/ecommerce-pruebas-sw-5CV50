import jsPDF from 'jspdf';

// Generar PDF del Ticket o Factura y permitir descarga
export const generatePdfDocument = ({ order, isInvoice = false }) => {
  const doc = new jsPDF();
  const title = isInvoice ? "FACTURA ELECTRÓNICA SIMULADA" : "TICKET DE COMPRA";

  // Encabezado
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.text("TECHSTORE MÉXICO S.A. DE C.V.", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.text(title, 14, 28);
  doc.text(`Fecha: ${new Date(order.createdAt).toLocaleString('es-MX')}`, 14, 34);
  doc.text(`No. Pedido / Folio: ${order.id}`, 14, 40);

  // Datos del Cliente / Facturación
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 45, 196, 45);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`Cliente: ${order.customer.name}`, 14, 53);
  doc.text(`Correo: ${order.customer.email}`, 14, 59);
  doc.text(`Dirección de Entrega: ${order.shippingAddress || 'No especificada'}`, 14, 65);
  doc.text(`Método de Pago: ${order.paymentMethod}`, 14, 71);

  if (isInvoice && order.invoiceData) {
    doc.text(`RFC: ${order.invoiceData.rfc}`, 120, 53);
    doc.text(`Razón Social: ${order.invoiceData.businessName}`, 120, 59);
    doc.text(`Uso CFDI: Gastos en general (G03)`, 120, 65);
  }

  doc.line(14, 76, 196, 76);

  // Tabla de Productos
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Descripción", 14, 83);
  doc.text("Cant.", 120, 83);
  doc.text("Precio Unit.", 145, 83);
  doc.text("Subtotal", 175, 83);
  doc.setFont("helvetica", "normal");

  let y = 91;
  order.items.forEach((item) => {
    const itemSubtotal = (item.price * item.quantity).toFixed(2);
    doc.text(item.name.substring(0, 45), 14, y);
    doc.text(String(item.quantity), 125, y);
    doc.text(`$${item.price.toFixed(2)}`, 145, y);
    doc.text(`$${itemSubtotal}`, 175, y);
    y += 8;
  });

  doc.line(14, y + 2, 196, y + 2);
  y += 10;

  // Totales
  const subtotal = (order.total / 1.16).toFixed(2);
  const iva = (order.total - Number(subtotal)).toFixed(2);

  doc.setFont("helvetica", "bold");
  if (isInvoice) {
    doc.text(`Subtotal: $${subtotal} MXN`, 145, y);
    y += 6;
    doc.text(`IVA (16%): $${iva} MXN`, 145, y);
    y += 6;
  }
  doc.setFontSize(13);
  doc.text(`TOTAL: $${order.total.toFixed(2)} MXN`, 145, y);

  // Pie de página
  y += 18;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Este comprobante ha sido generado por la plataforma interactiva de TechStore.", 14, y);
  y += 5;
  doc.text("Para consultar el estado de tu envío o realizar devoluciones, consulta nuestras Políticas de Devolución.", 14, y);

  return doc;
};

// Simulación de envío por correo electrónico (con registro y preview)
export const sendOrderEmailSimulation = async ({ order, recipientEmail, sendInvoice = false }) => {
  // Guardar en log de correos simulados en localStorage para visualización en el sistema
  const sentEmails = JSON.parse(localStorage.getItem('ecommerce_sent_emails') || '[]');
  
  const emailRecord = {
    id: 'MAIL-' + Date.now(),
    sentAt: new Date().toISOString(),
    to: recipientEmail,
    subject: sendInvoice 
      ? `Confirmación de Compra #${order.id} - Ticket y Factura Electrónica TechStore` 
      : `Confirmación de Compra #${order.id} - Ticket TechStore`,
    orderId: order.id,
    hasInvoice: sendInvoice,
    content: {
      client: order.customer.name,
      total: order.total,
      itemsCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
      shippingStatus: order.shippingStatus
    }
  };

  sentEmails.unshift(emailRecord);
  localStorage.setItem('ecommerce_sent_emails', JSON.stringify(sentEmails));

  return emailRecord;
};
