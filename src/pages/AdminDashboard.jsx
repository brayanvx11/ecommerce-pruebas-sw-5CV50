import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AlertTriangle, Package, Truck, CheckCircle2, Clock, Mail, RefreshCw, Box, PlusCircle, Tag } from 'lucide-react';

export const AdminDashboard = () => {
  const { products, orders, updateShippingStatus, updateProductStock, addProduct, seedFirestoreProducts } = useStore();
  const { currentUser, isFirebaseConfigured } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'new-product' | 'orders' | 'emails'
  const [stockEdit, setStockEdit] = useState({});
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Formulario para nuevo producto
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Computación');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdTags, setNewProdTags] = useState('');
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [isCreatingProd, setIsCreatingProd] = useState(false);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      showError('Por favor ingresa al menos el nombre y precio del producto.');
      return;
    }

    setIsCreatingProd(true);
    try {
      await addProduct({
        name: newProdName,
        category: newProdCategory,
        price: newProdPrice,
        stock: newProdStock,
        image: newProdImage,
        description: newProdDescription,
        tagsString: newProdTags,
        isFeatured: newProdFeatured
      });

      showSuccess('¡Producto creado y publicado con éxito en el catálogo de 0x1 Tech!');
      setNewProdName('');
      setNewProdPrice('');
      setNewProdStock('10');
      setNewProdImage('');
      setNewProdDescription('');
      setNewProdTags('');
      setNewProdFeatured(false);
      setActiveTab('inventory');
    } catch (err) {
      showError('Error al agregar el producto: ' + err.message);
    } finally {
      setIsCreatingProd(false);
    }
  };

  // Productos con bajo stock (< 5 unidades)
  const lowStockProducts = products.filter(p => p.stock < 5);

  // Registro de correos simulados
  const sentEmails = JSON.parse(localStorage.getItem('ecommerce_sent_emails') || '[]');

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedFirestoreProducts();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
      showSuccess('¡Productos cargados exitosamente a tu base de datos Cloud Firestore!');
    } catch (e) {
      showError('Error al sincronizar con Firestore: ' + e.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleStockSave = (productId) => {
    const newStock = stockEdit[productId];
    if (newStock !== undefined && newStock !== '') {
      updateProductStock(productId, newStock);
      setStockEdit(prev => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Encabezado del Panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Panel de Administración
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
            Bienvenido, {currentUser?.name}. Monitorea inventarios, pedidos, estados de envío y sincronización.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isFirebaseConfigured && (
            <button 
              onClick={handleSeed}
              disabled={isSeeding}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', backgroundColor: '#0284c7' }}
            >
              <RefreshCw size={16} className={isSeeding ? 'animate-spin' : ''} /> 
              {isSeeding ? 'Subiendo a Firestore...' : 'Subir Catálogo a Firestore'}
            </button>
          )}

          <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Rol: Administrador
          </span>
        </div>
      </div>

      {/* ALERTA CRÍTICA DE BAJO STOCK */}
      {lowStockProducts.length > 0 && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 0.4rem 0', color: '#92400e', fontSize: '1.05rem', fontWeight: 'bold' }}>
              Alerta de Inventario: {lowStockProducts.length} producto(s) con bajo stock
            </h4>
            <p style={{ margin: '0 0 0.8rem 0', color: '#b45309', fontSize: '0.9rem' }}>
              Los siguientes artículos tienen existencias críticas (menos de 5 unidades) y requieren reabastecimiento:
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {lowStockProducts.map(p => (
                <span key={p.id} className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                  {p.name}: <strong>{p.stock} unid.</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pestañas del Panel Admin */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('inventory')}
          style={{ 
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', 
            fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'inventory' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'inventory' ? '2px solid #2563eb' : 'none'
          }}
        >
          Inventario y Stock
        </button>

        <button 
          onClick={() => setActiveTab('new-product')}
          style={{ 
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', 
            fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'new-product' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'new-product' ? '2px solid #2563eb' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}
        >
          <PlusCircle size={17} /> Agregar Nuevo Producto
        </button>

        <button 
          onClick={() => setActiveTab('orders')}
          style={{ 
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', 
            fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'orders' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'orders' ? '2px solid #2563eb' : 'none'
          }}
        >
          Gestión de Pedidos y Envíos ({orders.length})
        </button>

        <button 
          onClick={() => setActiveTab('emails')}
          style={{ 
            padding: '0.75rem 1.25rem', border: 'none', background: 'none', 
            fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
            color: activeTab === 'emails' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'emails' ? '2px solid #2563eb' : 'none'
          }}
        >
          Registro de Correos Enviados ({sentEmails.length})
        </button>
      </div>

      {/* 1. TAB INVENTARIO */}
      {activeTab === 'inventory' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem' }}>Producto</th>
                <th style={{ padding: '0.75rem 1rem' }}>Categoría</th>
                <th style={{ padding: '0.75rem 1rem' }}>Precio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Stock Actual</th>
                <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actualizar Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '0.25rem' }} />
                    <span style={{ fontWeight: '500', color: '#1e293b' }}>{p.name}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{p.category}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>${p.price.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {p.stock < 5 ? (
                      <span className="badge badge-warning">Bajo Stock</span>
                    ) : (
                      <span className="badge badge-success">Óptimo</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        min="0"
                        placeholder={String(p.stock)}
                        value={stockEdit[p.id] !== undefined ? stockEdit[p.id] : ''}
                        onChange={(e) => setStockEdit({ ...stockEdit, [p.id]: e.target.value })}
                        style={{ width: '70px', padding: '0.35rem 0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                      />
                      <button 
                        onClick={() => handleStockSave(p.id)}
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                      >
                        Guardar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. TAB AGREGAR NUEVO PRODUCTO */}
      {activeTab === 'new-product' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '2rem', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Registrar Nuevo Producto en el Catálogo
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
            El producto se agregará de forma inmediata a la tienda y se sincronizará con tu base de datos Cloud Firestore.
          </p>

          <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                Nombre del Producto: *
              </label>
              <input 
                type="text" 
                required
                placeholder="Ej: Monitor Gamer UltraWide 34'' 144Hz"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                  Categoría: *
                </label>
                <select 
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                >
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Computación">Computación</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                  Precio (MXN): *
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="1"
                  required
                  placeholder="Ej: 4999.00"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                  Stock Inicial: *
                </label>
                <input 
                  type="number" 
                  min="0"
                  required
                  placeholder="Ej: 15"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                URL de la Imagen (opcional):
              </label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/... (Dejar en blanco para imagen por defecto)"
                value={newProdImage}
                onChange={(e) => setNewProdImage(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                Etiquetas y Sinónimos de Búsqueda (separados por comas):
              </label>
              <input 
                type="text" 
                placeholder="Ej: cascos, audifonos, diadema, bluetooth, anc"
                value={newProdTags}
                onChange={(e) => setNewProdTags(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                Permite a los usuarios encontrar el producto en el buscador usando términos coloquiales o alternativos.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.3rem' }}>
                Descripción Detallada:
              </label>
              <textarea 
                rows={3}
                placeholder="Describe las características técnicas, compatibilidad y detalles del artículo..."
                value={newProdDescription}
                onChange={(e) => setNewProdDescription(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <input 
                type="checkbox" 
                id="featCheck"
                checked={newProdFeatured}
                onChange={(e) => setNewProdFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="featCheck" style={{ fontSize: '0.9rem', color: '#334155', cursor: 'pointer', fontWeight: '500' }}>
                Destacar producto en el Carrusel de la página principal
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                disabled={isCreatingProd}
                className="btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
              >
                {isCreatingProd ? 'Guardando en Firestore...' : 'Guardar y Publicar Producto'}
              </button>
              <button 
                type="button" 
                onClick={() => setActiveTab('inventory')}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.95rem' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. TAB GESTIÓN DE ENVÍOS Y PEDIDOS */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>{order.id}</span>
                  <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                    {new Date(order.createdAt).toLocaleString('es-MX')}
                  </span>
                </div>
                
                {/* Control interactivo de estado de envío */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Truck size={18} color="#2563eb" />
                  <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>Estado de Envío:</span>
                  <select 
                    value={order.shippingStatus}
                    onChange={(e) => updateShippingStatus(order.id, e.target.value)}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1', fontWeight: '600', color: '#2563eb', cursor: 'pointer' }}
                  >
                    <option value="Procesando">Procesando</option>
                    <option value="En camino">En camino</option>
                    <option value="En tránsito">En tránsito</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Cliente:</span>
                  <strong>{order.customer.name}</strong> ({order.customer.email})
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Destino de Envío:</span>
                  <span>{order.shippingAddress}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Pago y Facturación:</span>
                  <span>{order.paymentMethod}</span> {order.hasInvoice ? <span className="badge badge-info" style={{ marginLeft: '0.4rem' }}>Facturado ({order.invoiceData?.rfc})</span> : null}
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Total de la Orden:</span>
                  <strong style={{ fontSize: '1.1rem', color: '#2563eb' }}>${order.total.toFixed(2)} MXN</strong>
                </div>
              </div>

              {/* Items del pedido */}
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Artículos comprados:</span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155' }}>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.quantity}x {item.name} (${item.price.toFixed(2)} c/u)
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* 3. TAB CORREOS SIMULADOS */}
      {activeTab === 'emails' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sentEmails.length > 0 ? (
            sentEmails.map(mail => (
              <div key={mail.id} style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{mail.subject}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{new Date(mail.sentAt).toLocaleString('es-MX')}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Destinatario: <strong style={{ color: '#2563eb' }}>{mail.to}</strong> | Pedido asociado: <strong>{mail.orderId}</strong>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.4rem', fontSize: '0.85rem' }}>
                  Incluye comprobantes adjuntos: {mail.hasInvoice ? 'Ticket de Compra + Factura Electrónica (PDF)' : 'Ticket de Compra (PDF)'}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No se han enviado correos todavía.</p>
          )}
        </div>
      )}

    </div>
  );
};
