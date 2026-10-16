import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const Cart = ({ onProceedToCheckout, onContinueShopping, onRequireLogin }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartTotal } = useStore();
  const { isAuthenticated } = useAuth();

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión o registrarte para completar tu compra. Los invitados pueden explorar el catálogo pero no comprar.');
      onRequireLogin();
      return;
    }
    onProceedToCheckout();
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto', backgroundColor: '#ffffff', padding: '3rem 2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ backgroundColor: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#64748b' }}>
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0' }}>Tu carrito está vacío</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>Explora nuestro catálogo y descubre productos de tecnología increíbles.</p>
          <button onClick={onContinueShopping} className="btn-primary" style={{ width: '100%' }}>
            Explorar Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Carrito de Compras
          </h1>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Tienes {cart.reduce((acc, i) => acc + i.quantity, 0)} artículo(s) seleccionado(s)
          </span>
        </div>

        <button 
          onClick={clearCart}
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '500' }}
        >
          <Trash2 size={16} /> Vaciar carrito
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Lista de Productos (CRUD de Carrito) */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {cart.map((item, index) => (
            <div 
              key={item.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1.25rem',
                borderBottom: index < cart.length - 1 ? '1px solid #f1f5f9' : 'none' 
              }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '0.5rem', backgroundColor: '#f8fafc', padding: '0.25rem' }} 
              />

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                  {item.name}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Precio unitario: ${item.price.toFixed(2)} MXN
                </div>
                
                {/* Controles de Cantidad (CRUD) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '0.4rem', backgroundColor: '#ffffff' }}>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', padding: '0.3rem 0.6rem', cursor: 'pointer', color: '#475569' }}
                      title="Disminuir"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 0.6rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      style={{ 
                        background: 'none', border: 'none', padding: '0.3rem 0.6rem', 
                        cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer', 
                        color: item.quantity >= item.stock ? '#cbd5e1' : '#475569' 
                      }}
                      title="Aumentar"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    (Máx: {item.stock})
                  </span>
                </div>
              </div>

              {/* Subtotal del item y botón eliminar */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>
                  ${(item.price * item.quantity).toFixed(2)} MXN
                </span>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.3rem' }}
                  title="Eliminar producto"
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Resumen del Pedido */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 1.25rem 0' }}>
            Resumen de compra
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)} MXN</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>Envío estándar</span>
              <span style={{ color: '#15803d', fontWeight: '600' }}>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <span>IVA estimado (incluido)</span>
              <span>${(cartTotal - (cartTotal / 1.16)).toFixed(2)} MXN</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>Total a pagar</span>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#2563eb' }}>
              ${cartTotal.toFixed(2)} MXN
            </span>
          </div>

          <button 
            onClick={handleCheckoutClick}
            className="btn-primary" 
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '0.75rem' }}
          >
            Proceder al Checkout <ArrowRight size={18} />
          </button>

          <button 
            onClick={onContinueShopping}
            className="btn-secondary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Continuar comprando
          </button>

          {!isAuthenticated && (
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.8rem', color: '#e11d48', backgroundColor: '#fff1f2', padding: '0.6rem', borderRadius: '0.4rem', textAlign: 'center' }}>
              * Los clientes deben registrarse o iniciar sesión para poder comprar.
            </p>
          )}

        </div>

      </div>

    </div>
  );
};
