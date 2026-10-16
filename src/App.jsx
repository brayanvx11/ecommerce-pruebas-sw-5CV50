import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthViews } from './pages/AuthViews';
import { ReturnPolicy } from './pages/ReturnPolicy';
import { ProductCard } from './components/ProductCard';
import { useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';
import { Heart } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'catalog' | 'detail' | 'cart' | 'checkout' | 'admin' | 'login' | 'register' | 'returns' | 'favorites'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { products, userFavorites } = useStore();
  const { isAuthenticated } = useAuth();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const favoriteProducts = products.filter(p => userFavorites.includes(p.id));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* 1. Header / Navbar con enlaces, redes y autenticación */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* 2. Enrutamiento de vistas según estado */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <Home 
            onSelectProduct={handleSelectProduct} 
            onNavigate={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
          />
        )}

        {currentView === 'catalog' && (
          <Catalog onSelectProduct={handleSelectProduct} />
        )}

        {currentView === 'detail' && (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setCurrentView('catalog')}
            onGoToCart={() => { setCurrentView('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onRequireLogin={() => { setCurrentView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {currentView === 'cart' && (
          <Cart 
            onProceedToCheckout={() => { setCurrentView('checkout'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onContinueShopping={() => { setCurrentView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onRequireLogin={() => { setCurrentView('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout 
            onBackToCart={() => setCurrentView('cart')}
            onOrderCompleted={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}

        {currentView === 'login' && (
          <AuthViews 
            initialView="login" 
            onNavigate={setCurrentView} 
            onSuccess={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'register' && (
          <AuthViews 
            initialView="register" 
            onNavigate={setCurrentView} 
            onSuccess={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'returns' && (
          <ReturnPolicy onNavigateToCatalog={() => setCurrentView('catalog')} />
        )}

        {currentView === 'favorites' && (
          <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
              <Heart size={26} color="#ef4444" fill="#ef4444" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Mis Artículos Favoritos ({favoriteProducts.length})
              </h1>
            </div>

            {favoriteProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }}>
                {favoriteProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} onSelectProduct={handleSelectProduct} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b', fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
                  No tienes productos guardados en favoritos todavía.
                </p>
                <button onClick={() => setCurrentView('catalog')} className="btn-primary">
                  Explorar Catálogo
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Footer con nombre de negocio, políticas y redes (Instagram, X, TikTok, WhatsApp) */}
      <Footer setCurrentView={setCurrentView} />

    </div>
  );
}

export default App;
