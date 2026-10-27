import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generatePdfDocument } from '../services/mailSimulator';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  CreditCard,
  RotateCcw
} from 'lucide-react';

const SHIPPING_STEPS = [
  { key: 'Procesando', label: 'Procesando', desc: 'Confirmando pago y preparando pedido' },
  { key: 'En camino', label: 'En camino', desc: 'Empacado y despachado del almacén' },
  { key: 'En tránsito', label: 'En tránsito', desc: 'En ruta con la paquetería express' },
  { key: 'Entregado', label: 'Entregado', desc: 'Paquete recibido satisfactoriamente' }
];

export const MyOrders = () => {
  const { orders } = useStore();
  const { currentUser, isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useToast();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <ShoppingBag size={48} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Inicia sesión para ver tus compras
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Para rastrear tus envíos en tiempo real y descargar tus facturas y comprobantes, ingresa a tu cuenta.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            Iniciar Sesión <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Filtrar pedidos pertenecientes al usuario actual
  const userOrders = orders.filter(o => 
    o.customer?.id === currentUser.id || 
    o.customer?.email?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const handleDownloadTicket = (order) => {
    try {
      const doc = generatePdfDocument({ order, isInvoice: false });
      doc.save(`0x1Tech_Ticket_${order.id}.pdf`);
      showSuccess(`Ticket de compra #${order.id} descargado en PDF.`);
    } catch (e) {
      console.error(e);
      showInfo('No se pudo generar el ticket en este momento.');
    }
  };

  const handleDownloadInvoice = (order) => {
    try {
      const doc = generatePdfDocument({ order, isInvoice: true });
      doc.save(`0x1Tech_Factura_${order.id}.pdf`);
      showSuccess(`Factura fiscal electrónica #${order.id} descargada en PDF.`);
    } catch (e) {
      console.error(e);
      showInfo('No se pudo generar la factura en este momento.');
    }
  };

  const getStepIndex = (status) => {
    const idx = SHIPPING_STEPS.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Encabezado */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Mis Compras y Seguimiento
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            Monitorea el estado de tus envíos en tiempo real y descarga tus comprobantes fiscales y tickets.
          </p>
        </div>
        <Link 
          to="/catalogo"
          className="btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.6rem 1rem' }}
        >
          <ShoppingBag size={17} /> Seguir Comprando
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <Package size={56} color="#94a3b8" style={{ margin: '0 auto 1.25rem auto' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
            Aún no tienes pedidos registrados
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Explora nuestro catálogo con los últimos componentes, gadgets y tecnología de alto rendimiento.
          </p>
          <Link to="/catalogo" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}>
            Explorar Catálogo <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {userOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.shippingStatus);

            return (
              <div 
                key={order.id} 
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '1rem', 
                  border: '1px solid #e2e8f0', 
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                {/* Cabecera del pedido */}
                <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Pedido
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: '0.1rem 0 0 0' }}>
                      #{order.id}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Realizado el {new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Total pagado:</span>
                      <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>
                        ${order.total.toFixed(2)} MXN
                      </strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {/* [GAP-02] Descarga de Ticket */}
                      <button 
                        onClick={() => handleDownloadTicket(order)}
                        className="btn-secondary"
                        title="Descargar Ticket de compra en PDF"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.85rem' }}
                      >
                        <FileText size={15} color="#2563eb" /> Ticket PDF
                      </button>

                      {/* [GAP-02] Descarga de Factura */}
                      {order.hasInvoice && (
                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn-secondary"
                          title="Descargar Factura Electrónica en PDF"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 0.85rem', borderColor: '#cbd5e1' }}
                        >
                          <Download size={15} color="#059669" /> Factura PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  {/* [GAP-03] Rastreador Visual de Envíos en Tiempo Real */}
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={18} color="#2563eb" /> Estado de la entrega:
                        <span style={{ 
                          backgroundColor: order.shippingStatus === 'Entregado' ? '#ecfdf5' : '#eff6ff', 
                          color: order.shippingStatus === 'Entregado' ? '#047857' : '#1d4ed8',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          fontSize: '0.85rem'
                        }}>
                          {order.shippingStatus}
                        </span>
                      </span>

                      <Link 
                        to="/devoluciones"
                        style={{ fontSize: '0.85rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                      >
                        <RotateCcw size={14} /> Política de Devoluciones
                      </Link>
                    </div>

                    {/* Barra de progreso de etapas */}
                    <div style={{ position: 'relative', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '5%',
                        right: '5%',
                        height: '4px',
                        backgroundColor: '#e2e8f0',
                        zIndex: 1
                      }}>
                        <div style={{
                          height: '100%',
                          backgroundColor: '#2563eb',
                          width: `${(currentStepIdx / (SHIPPING_STEPS.length - 1)) * 100}%`,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SHIPPING_STEPS.length}, 1fr)`, position: 'relative', zIndex: 2 }}>
                        {SHIPPING_STEPS.map((step, idx) => {
                          const isDone = idx < currentStepIdx;
                          const isCurrent = idx === currentStepIdx;
                          const isPending = idx > currentStepIdx;

                          return (
                            <div key={step.key} style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: isDone || isCurrent ? '#2563eb' : '#ffffff',
                                border: isPending ? '3px solid #cbd5e1' : '3px solid #2563eb',
                                color: isDone || isCurrent ? '#ffffff' : '#94a3b8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 0.5rem auto',
                                transition: 'all 0.3s ease',
                                boxShadow: isCurrent ? '0 0 0 4px #dbeafe' : 'none'
                              }}>
                                {isDone ? (
                                  <CheckCircle2 size={18} />
                                ) : isCurrent ? (
                                  <Clock size={16} />
                                ) : (
                                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{idx + 1}</span>
                                )}
                              </div>
                              <span style={{
                                display: 'block',
                                fontSize: '0.85rem',
                                fontWeight: isCurrent ? '700' : '500',
                                color: isCurrent ? '#0f172a' : isDone ? '#334155' : '#94a3b8'
                              }}>
                                {step.label}
                              </span>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Artículos y Datos de Entrega */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                    
                    {/* Lista de productos */}
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', marginBottom: '0.75rem' }}>
                        Artículos del Pedido ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '0.4rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }} 
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Link 
                                to={`/producto/${item.id}`}
                                style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              >
                                {item.name}
                              </Link>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Datos de envío y facturación */}
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <MapPin size={15} color="#64748b" /> Dirección de Entrega:
                        </span>
                        <p style={{ margin: 0, color: '#475569', paddingLeft: '1.2rem' }}>
                          {order.shippingAddress || 'Domicilio predeterminado de cliente'}
                        </p>
                      </div>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                          <CreditCard size={15} color="#64748b" /> Método de Pago:
                        </span>
                        <p style={{ margin: 0, color: '#475569', paddingLeft: '1.2rem' }}>
                          {order.paymentMethod}
                        </p>
                      </div>

                      {order.hasInvoice && order.invoiceData && (
                        <div>
                          <span style={{ fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                            <FileText size={15} color="#059669" /> Datos Fiscales:
                          </span>
                          <p style={{ margin: 0, color: '#475569', paddingLeft: '1.2rem' }}>
                            RFC: <strong>{order.invoiceData.rfc}</strong> | {order.invoiceData.businessName}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
