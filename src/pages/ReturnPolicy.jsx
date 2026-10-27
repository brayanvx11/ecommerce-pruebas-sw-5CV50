import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle2, ShieldCheck, Clock, FileText, ArrowRight } from 'lucide-react';

export const ReturnPolicy = () => {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2.5rem' }}>
        
        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.6rem', borderRadius: '0.5rem' }}>
            <RefreshCw size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Políticas de Devolución y Reembolso
            </h1>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Transparencia y tranquilidad garantizada para todos nuestros clientes de 0x1 Tech.
            </span>
          </div>
        </div>

        {/* Secciones de las políticas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', color: '#334155', lineHeight: '1.6', fontSize: '0.95rem' }}>
          
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#2563eb" /> 1. Plazo de Devolución
            </h3>
            <p style={{ margin: 0 }}>
              Dispones de hasta <strong>30 días naturales</strong> a partir de la fecha de entrega de tu pedido para solicitar una devolución o cambio sin costo adicional.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#2563eb" /> 2. Condiciones del Producto
            </h3>
            <p style={{ margin: 0 }}>
              Para aplicar a una devolución íntegra, el producto debe encontrarse en las siguientes condiciones:
            </p>
            <ul style={{ margin: '0.5rem 0 0 1.5rem', padding: 0 }}>
              <li>Estar en su empaque original sin roturas severas.</li>
              <li>Incluir todos los accesorios, manuales, cables y certificados de garantía provistos.</li>
              <li>No presentar signos de mal uso físico, caídas, daño por agua o modificaciones no autorizadas.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#2563eb" /> 3. Comprobante de Compra
            </h3>
            <p style={{ margin: 0 }}>
              Es indispensable presentar el número de folio de la orden (ej. <em>ORD-1234</em>), el <strong>ticket de compra</strong> o la <strong>factura fiscal</strong> enviada automáticamente a tu correo electrónico al momento de realizar la compra o descargada desde tu sección de <strong>Mis Compras</strong>.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="#2563eb" /> 4. Proceso de Reembolso
            </h3>
            <p style={{ margin: 0 }}>
              Una vez recibido e inspeccionado el artículo en nuestro centro de distribución, el reembolso se procesará al mismo método de pago original (Tarjeta, PayPal o Google Pay) en un plazo de 3 a 5 días hábiles bancarios.
            </p>
          </div>

        </div>

        {/* Botón de acción */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', textAlign: 'center' }}>
          <Link 
            to="/catalogo"
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            Explorar el Catálogo con Total Confianza <ArrowRight size={17} />
          </Link>
        </div>

      </div>

    </div>
  );
};
