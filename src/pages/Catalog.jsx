import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Search, X } from 'lucide-react';

export const Catalog = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('cat') || 'Todas';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    if (queryParam !== searchTerm) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const categories = ['Todas', ...new Set(products.map(p => p.category))];

  // [1.3] Búsqueda por nombre, descripción y por palabras clave/sinónimos/tags
  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const inName = p.name.toLowerCase().includes(term);
    const inDesc = p.description.toLowerCase().includes(term);
    const inTags = Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase().includes(term));
    const inCat = p.category.toLowerCase().includes(term);

    return matchesCategory && (inName || inDesc || inTags || inCat);
  });

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'Todas') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val.trim()) {
      newParams.delete('q');
    } else {
      newParams.set('q', val.trim());
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('Todas');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      
      {/* Título de la tienda */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
          Catálogo Oficial 0x1 Tech
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          Descubre nuestra línea completa de hardware, computación y accesorios ({products.length} productos disponibles).
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Input de Búsqueda inteligente por sinónimos */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text"
            placeholder="Buscar por nombre o sinónimos (ej. cascos, diadema, monitor, ssd)..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 2.5rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categorías */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#2563eb' : '#cbd5e1',
                backgroundColor: selectedCategory === cat ? '#2563eb' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid de Productos */}
      {filtered.length > 0 ? (
        <>
          <div style={{ marginBottom: '1.25rem', color: '#64748b', fontSize: '0.9rem' }}>
            Mostrando <strong>{filtered.length}</strong> de {products.length} productos
            {searchTerm && <span> para la búsqueda: "<strong>{searchTerm}</strong>"</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {filtered.map((prod) => (
              <ProductCard 
                key={prod.id} 
                product={prod} 
              />
            ))}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>
            No encontramos coincidencias para "{searchTerm}"
          </p>
          <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
            Prueba buscando con palabras clave generales como: <em>audífonos, teclado, mouse, monitor, laptop</em>.
          </p>
          <button 
            onClick={clearAllFilters}
            className="btn-primary"
          >
            Ver todos los productos
          </button>
        </div>
      )}

    </div>
  );
};
