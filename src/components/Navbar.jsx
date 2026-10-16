import React from 'react';
import { ShoppingBag, ShoppingCart, Heart, User, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

export const Navbar = ({ currentView, setCurrentView }) => {
  const { currentUser, isAdmin, isAuthenticated, logout } = useAuth();
  const { cartCount, userFavorites } = useStore();

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Marca / Logo */}
        <div 
          onClick={() => setCurrentView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', letterSpacing: '-0.02em' }}>TechStore</span>
            <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748b', marginTop: '-4px' }}>E-Commerce Oficial</span>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => setCurrentView('home')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
              fontWeight: currentView === 'home' ? '600' : '500',
              color: currentView === 'home' ? '#2563eb' : '#475569'
            }}
          >
            Inicio
          </button>
          
          <button 
            onClick={() => setCurrentView('catalog')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
              fontWeight: currentView === 'catalog' ? '600' : '500',
              color: currentView === 'catalog' ? '#2563eb' : '#475569'
            }}
          >
            Catálogo
          </button>

          <button 
            onClick={() => setCurrentView('returns')}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem',
              fontWeight: currentView === 'returns' ? '600' : '500',
              color: currentView === 'returns' ? '#2563eb' : '#475569'
            }}
          >
            Devoluciones
          </button>

          {isAdmin && (
            <button 
              onClick={() => setCurrentView('admin')}
              style={{ 
                background: '#fef2f2', border: '1px solid #fecaca', cursor: 'pointer', fontSize: '0.9rem',
                fontWeight: '600', color: '#dc2626', padding: '0.4rem 0.8rem', borderRadius: '0.4rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <ShieldAlert size={16} /> Panel Admin
            </button>
          )}
        </nav>

        {/* Acciones de Usuario: Favoritos, Carrito y Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Favoritos */}
          <button 
            onClick={() => {
              if (!isAuthenticated) {
                alert('Debes iniciar sesión para ver tus favoritos guardados.');
                setCurrentView('login');
              } else {
                setCurrentView('favorites');
              }
            }}
            title="Favoritos"
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
              padding: '0.5rem', color: '#475569'
            }}
          >
            <Heart size={22} color={userFavorites.length > 0 ? '#ef4444' : '#475569'} fill={userFavorites.length > 0 ? '#ef4444' : 'none'} />
            {userFavorites.length > 0 && (
              <span style={{ 
                position: 'absolute', top: 0, right: 0, backgroundColor: '#ef4444',
                color: 'white', borderRadius: '50%', fontSize: '0.7rem', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {userFavorites.length}
              </span>
            )}
          </button>

          {/* Carrito de Compras */}
          <button 
            onClick={() => setCurrentView('cart')}
            title="Carrito de Compras"
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
              padding: '0.5rem', color: '#475569'
            }}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', top: 0, right: 0, backgroundColor: '#2563eb',
                color: 'white', borderRadius: '50%', fontSize: '0.7rem', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Estado de Autenticación */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>{currentUser.name}</span>
                <span style={{ fontSize: '0.75rem', color: currentUser.role === 'Administrador' ? '#dc2626' : '#2563eb', fontWeight: '500' }}>
                  {currentUser.role}
                </span>
              </div>
              <button 
                onClick={logout}
                title="Cerrar Sesión"
                style={{ 
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.4rem', 
                  padding: '0.4rem', cursor: 'pointer', color: '#64748b' 
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setCurrentView('login')}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                <User size={16} /> Iniciar Sesión
              </button>
              <button 
                onClick={() => setCurrentView('register')}
                className="btn-primary"
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              >
                Registrarse
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
