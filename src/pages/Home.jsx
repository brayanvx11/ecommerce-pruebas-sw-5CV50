import React from 'react';
import { Carousel } from '../components/Carousel';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Sparkles, TrendingUp, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';

export const Home = ({ onSelectProduct, onNavigate }) => {
  const { products } = useStore();

  // Sección de Recomendaciones: basada en lo que otros usuarios han comprado (mayor boughtCount)
  const recommendations = [...products]
    .sort((a, b) => (b.boughtCount || 0) - (a.boughtCount || 0))
    .slice(0, 4);

  // Novedades o catálogo destacado
  const latestProducts = [...products].slice(0, 4);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      
      {/* 1. Carrusel Principal */}
      <Carousel onSelectProduct={onSelectProduct} />

      {/* Beneficios de Compra */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#dbeafe', color: '#2563eb', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <Truck size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>Envíos Seguros</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Seguimiento en tiempo real</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>Garantía Oficial</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>12 meses de cobertura</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: '#1e293b' }}>Devolución Fácil</h4>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Hasta 30 días garantizados</span>
          </div>
        </div>
      </div>

      {/* 2. Sección de RECOMENDACIONES (Lo que otros usuarios han comprado) */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '0.4rem' }}>
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Recomendaciones para ti
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Basado en lo que otros usuarios han comprado recientemente
              </span>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('catalog')}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}
          >
            Ver todo <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {recommendations.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct} 
            />
          ))}
        </div>
      </section>

      {/* 3. Catálogo Destacado */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Explora Nuestro Catálogo
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Encuentra los mejores accesorios y tecnología con stock garantizado
            </span>
          </div>

          <button 
            onClick={() => onNavigate('catalog')}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            Ir al Catálogo Completo
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
          {latestProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct} 
            />
          ))}
        </div>
      </section>

    </div>
  );
};
