import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const Favorites = () => {
  const { products, userFavorites } = useStore();
  const favoriteProducts = products.filter(p => userFavorites.includes(p.id));

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fee2e2', padding: '0.6rem', borderRadius: '0.5rem', display: 'flex' }}>
          <Heart size={26} color="#ef4444" fill="#ef4444" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Mis Artículos Favoritos ({favoriteProducts.length})
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.2rem 0 0 0' }}>
            Los productos que guardaste para comprar más tarde en 0x1 Tech.
          </p>
        </div>
      </div>

      {favoriteProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {favoriteProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <Heart size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' }}>
            Tu lista de favoritos está vacía
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 auto 1.5rem auto', maxWidth: '380px' }}>
            Haz clic en el ícono de corazón de cualquier producto para guardarlo aquí y comprarlo en cualquier momento.
          </p>
          <Link to="/catalogo" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', textDecoration: 'none' }}>
            Explorar Catálogo <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </div>
  );
};
