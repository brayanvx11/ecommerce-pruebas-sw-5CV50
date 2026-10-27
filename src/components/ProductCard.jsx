import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductCard = ({ product }) => {
  const { toggleFavorite, isFavorite, addToCart } = useStore();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const favorite = isFavorite(product.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Inicia sesión para guardar productos en tus Favoritos.', 'info');
      navigate('/login');
      return;
    }
    const added = toggleFavorite(product.id);
    if (added) {
      addToast(`"${product.name}" agregado a tus Favoritos ❤️`, 'success');
    } else {
      addToast(`"${product.name}" eliminado de tus Favoritos`, 'info');
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const added = addToCart(product, 1);
    if (added > 0) {
      addToast(`"${product.name}" agregado a tu carrito exitosamente 🛒`, 'success');
    } else {
      addToast('No hay más stock disponible de este producto.', 'error');
    }
  };

  return (
    <div 
      onClick={() => navigate(`/producto/${product.id}`)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Botón de Favorito */}
      <button 
        onClick={handleFavoriteClick}
        aria-label="Guardar favorito"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <Heart 
          size={18} 
          color={favorite ? '#ef4444' : '#64748b'} 
          fill={favorite ? '#ef4444' : 'none'} 
        />
      </button>

      {/* Imagen */}
      <div style={{ width: '100%', height: '200px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Contenido */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          {product.category}
        </span>
        
        <h3 style={{ fontSize: '0.98rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.4, minHeight: '2.8rem' }}>
          {product.name}
        </h3>

        {/* Rating y Ventas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
            <Star size={16} fill="#eab308" />
            <span style={{ fontWeight: 'bold', marginLeft: '0.25rem', color: '#1e293b' }}>{product.rating}</span>
          </div>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span style={{ color: '#64748b' }}>{product.boughtCount || 0} compras</span>
        </div>

        {/* Stock status */}
        <div style={{ marginBottom: '1rem' }}>
          {product.stock <= 5 && product.stock > 0 ? (
            <span className="badge badge-warning">¡Solo quedan {product.stock} disponibles!</span>
          ) : product.stock === 0 ? (
            <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Agotado</span>
          ) : (
            <span className="badge badge-success">En stock ({product.stock})</span>
          )}
        </div>

        {/* Precio y Acción */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0f172a' }}>
              ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>MXN</span>
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary"
            style={{ 
              padding: '0.45rem 0.8rem', 
              fontSize: '0.82rem',
              opacity: product.stock === 0 ? 0.5 : 1,
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingCart size={15} /> Agregar
          </button>
        </div>

      </div>
    </div>
  );
};
