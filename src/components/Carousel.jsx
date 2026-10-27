import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Carousel = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  const featured = products.filter(p => p.isFeatured);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const currentItem = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#0f172a', color: 'white', marginBottom: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center', minHeight: '380px' }}>
        
        {/* Información del Producto */}
        <div style={{ padding: '3rem', zIndex: 10 }}>
          <span style={{ display: 'inline-block', backgroundColor: '#2563eb', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Destacado 0x1 Tech
          </span>
          <h2 style={{ fontSize: '2.1rem', fontWeight: '800', lineHeight: 1.2, margin: '0 0 1rem 0' }}>
            {currentItem.name}
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '480px' }}>
            {currentItem.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>
              ${currentItem.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {currentItem.stock > 0 ? `Stock disponible: ${currentItem.stock}` : 'Agotado'}
            </span>
          </div>

          <button 
            onClick={() => navigate(`/producto/${currentItem.id}`)}
            className="btn-primary" 
            style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
          >
            Ver Detalles y Comprar <ArrowRight size={18} />
          </button>
        </div>

        {/* Imagen animada */}
        <div style={{ position: 'relative', height: '100%', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(15,23,42,1) 80%)' }}>
          <img 
            src={currentItem.image} 
            alt={currentItem.name}
            style={{ 
              maxWidth: '85%', 
              maxHeight: '320px', 
              objectFit: 'contain',
              borderRadius: '0.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.5s ease'
            }} 
          />
        </div>

      </div>

      {/* Flechas de navegación */}
      <button 
        onClick={handlePrev}
        aria-label="Anterior"
        style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={handleNext}
        aria-label="Siguiente"
        style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores */}
      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem' }}>
        {featured.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{ 
              width: idx === currentIndex ? '24px' : '8px', 
              height: '8px', 
              borderRadius: '9999px', 
              backgroundColor: idx === currentIndex ? '#38bdf8' : 'rgba(255,255,255,0.4)', 
              border: 'none', 
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

    </div>
  );
};
