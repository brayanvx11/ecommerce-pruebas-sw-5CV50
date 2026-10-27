import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { Favorites } from './pages/Favorites';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <ScrollToTop />
      
      {/* 1. Header / Navbar con buscador rápido, navegación de rutas y sesión */}
      <Navbar />

      {/* 2. Enrutamiento declarativo vía React Router DOM */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<AuthViews initialView="login" />} />
          <Route path="/registro" element={<AuthViews initialView="register" />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-pedidos" element={<MyOrders />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/devoluciones" element={<ReturnPolicy />} />
          
          {/* Fallback para cualquier ruta desconocida */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Footer institucional con 0x1 Tech, redes sociales y políticas */}
      <Footer />
    </div>
  );
}

export default App;
