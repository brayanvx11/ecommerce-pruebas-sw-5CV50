import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, Heart, User, LogOut, ShieldAlert, Search, PackageCheck, UserCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const { currentUser, isAdmin, isAuthenticated, logout } = useAuth();
  const { cartCount, userFavorites } = useStore();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [headerSearch, setHeaderSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(headerSearch.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    addToast('Sesión cerrada correctamente. ¡Vuelve pronto!', 'info');
    navigate('/');
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px', gap: '1rem' }}>
        
        {/* Marca / Logo: 0x1 Tech */}
        <Link 
          to="/" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}
        >
          <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', border: '1px solid #1e293b' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0f172a', letterSpacing: '-0.03em' }}>0x1</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#2563eb', letterSpacing: '-0.03em' }}>Tech</span>
            </div>
            <span style={{ fontSize: '0.7rem', display: 'block', color: '#64748b', marginTop: '-4px', fontWeight: '500' }}>Hardware & Gadgets</span>
          </div>
        </Link>

        {/* 1.2 Barra de Búsqueda de Acceso Rápido (Regla de los "Dos Clics") */}
        <form 
          onSubmit={handleSearchSubmit} 
          style={{ flex: '1', maxWidth: '420px', position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <input
            type="text"
            placeholder="Buscar audífonos, laptops, monitores o sinónimos..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 2.4rem 0.5rem 0.9rem',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)';
              e.target.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = 'none';
              e.target.style.backgroundColor = '#f8fafc';
            }}
          />
          <button
            type="submit"
            title="Buscar"
            style={{
              position: 'absolute',
              right: '0.5rem',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.25rem'
            }}
          >
            <Search size={18} />
          </button>
        </form>

        {/* Enlaces de Navegación con React Router */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link 
            to="/"
            style={{ 
              textDecoration: 'none', fontSize: '0.92rem',
              fontWeight: location.pathname === '/' ? '700' : '500',
              color: location.pathname === '/' ? '#2563eb' : '#475569'
            }}
          >
            Inicio
          </Link>
          
          <Link 
            to="/catalogo"
            style={{ 
              textDecoration: 'none', fontSize: '0.92rem',
              fontWeight: location.pathname.startsWith('/catalogo') ? '700' : '500',
              color: location.pathname.startsWith('/catalogo') ? '#2563eb' : '#475569'
            }}
          >
            Catálogo
          </Link>

          {/* [GAP-03] Monitor de Envíos / Mis Pedidos para Clientes */}
          {isAuthenticated && (
            <Link 
              to="/mis-pedidos"
              style={{ 
                textDecoration: 'none', fontSize: '0.92rem',
                fontWeight: location.pathname === '/mis-pedidos' ? '700' : '500',
                color: location.pathname === '/mis-pedidos' ? '#2563eb' : '#475569',
                display: 'flex', alignItems: 'center', gap: '0.3rem'
              }}
            >
              <PackageCheck size={16} /> Mis Envíos
            </Link>
          )}

          <Link 
            to="/devoluciones"
            style={{ 
              textDecoration: 'none', fontSize: '0.92rem',
              fontWeight: location.pathname === '/devoluciones' ? '700' : '500',
              color: location.pathname === '/devoluciones' ? '#2563eb' : '#475569'
            }}
          >
            Devoluciones
          </Link>

          {isAdmin && (
            <Link 
              to="/admin"
              style={{ 
                textDecoration: 'none',
                background: '#fef2f2', border: '1px solid #fecaca', fontSize: '0.85rem',
                fontWeight: '700', color: '#dc2626', padding: '0.35rem 0.75rem', borderRadius: '0.4rem',
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}
            >
              <ShieldAlert size={15} /> Panel Admin
            </Link>
          )}
        </nav>

        {/* Acciones de Usuario: Favoritos, Carrito y Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          
          {/* Favoritos */}
          <Link 
            to="/favoritos"
            title="Favoritos"
            style={{ 
              position: 'relative',
              padding: '0.5rem', color: '#475569', display: 'flex', alignItems: 'center'
            }}
          >
            <Heart size={21} color={userFavorites.length > 0 ? '#ef4444' : '#475569'} fill={userFavorites.length > 0 ? '#ef4444' : 'none'} />
            {userFavorites.length > 0 && (
              <span style={{ 
                position: 'absolute', top: 2, right: 2, backgroundColor: '#ef4444',
                color: 'white', borderRadius: '50%', fontSize: '0.68rem', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {userFavorites.length}
              </span>
            )}
          </Link>

          {/* Carrito de Compras */}
          <Link 
            to="/carrito"
            title="Carrito de Compras"
            style={{ 
              position: 'relative',
              padding: '0.5rem', color: '#475569', display: 'flex', alignItems: 'center'
            }}
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', top: 2, right: 2, backgroundColor: '#2563eb',
                color: 'white', borderRadius: '50%', fontSize: '0.68rem', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Estado de Autenticación */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
              <Link 
                to="/perfil"
                title="Editar mi perfil [GAP-01]"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'inherit' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>
                    {currentUser.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: currentUser.role === 'Administrador' ? '#dc2626' : '#2563eb', fontWeight: '600' }}>
                    {currentUser.role}
                  </span>
                </div>
                <UserCircle size={22} color="#64748b" />
              </Link>
              <button 
                onClick={handleLogout}
                title="Cerrar Sesión"
                style={{ 
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.4rem', 
                  padding: '0.4rem', cursor: 'pointer', color: '#64748b', display: 'flex'
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link 
                to="/login"
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <User size={15} /> Iniciar Sesión
              </Link>
              <Link 
                to="/registro"
                className="btn-primary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', textDecoration: 'none' }}
              >
                Registrarse
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
