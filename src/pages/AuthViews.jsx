import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, KeyRound, ArrowRight, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AuthViews = ({ initialView = 'login', onNavigate, onSuccess }) => {
  const { login, register, loginWithGoogle, sendPasswordReset, resetPasswordWithToken, isFirebaseConfigured } = useAuth();
  
  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot' | 'reset-code'
  const [role, setRole] = useState('Cliente');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Para recuperación
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetFeedback, setResetFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await login(email, password);
      onSuccess();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await register({ name, email, password, role });
      onSuccess();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await sendPasswordReset(email);
      setResetFeedback(res);
      setView('reset-code');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleApplyReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await resetPasswordWithToken(email, resetToken, newPassword);
      alert('¡Contraseña restablecida exitosamente! Ahora puedes iniciar sesión.');
      setView('login');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Mensaje de error general */}
        {errorMessage && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {errorMessage}
          </div>
        )}

        {/* 1. VISTA DE LOGIN */}
        {view === 'login' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <LogIn size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Iniciar Sesión</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {isFirebaseConfigured ? 'Conectado a Firebase Auth' : 'Accede a tu cuenta de cliente o administrador'}
              </p>
            </div>

            {/* Botón de Login con Google */}
            <button 
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '0.7rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                marginBottom: '1.25rem',
                transition: 'background-color 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {isGoogleLoading ? 'Accediendo con Google...' : 'Continuar con Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ padding: '0 0.8rem' }}>o ingresar con correo</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Correo Electrónico:</label>
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@tienda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#475569' }}>Contraseña:</label>
                  <button 
                    type="button" 
                    onClick={() => { setErrorMessage(''); setView('forgot'); }}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                Ingresar a la Plataforma
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
              ¿Aún no tienes cuenta?{' '}
              <button 
                type="button" 
                onClick={() => { setErrorMessage(''); setView('register'); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        )}

        {/* 2. VISTA DE REGISTRO */}
        {view === 'register' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <UserPlus size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Crear Cuenta</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Regístrate para comprar y gestionar tus pedidos</p>
            </div>

            {/* Registro rápido con Google */}
            <button 
              type="button"
              disabled={isGoogleLoading}
              onClick={handleGoogleSignIn}
              style={{
                width: '100%',
                padding: '0.7rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                marginBottom: '1.25rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {isGoogleLoading ? 'Registrando con Google...' : 'Registrarse con Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ padding: '0 0.8rem' }}>o con correo</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Nombre Completo:</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Laura Morales"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Correo Electrónico:</label>
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Contraseña:</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  placeholder="Al menos 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Rol asignado:</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  <option value="Cliente">Cliente (Comprador)</option>
                  <option value="Administrador">Administrador (Gestión & Alertas)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                Completar Registro
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
              ¿Ya tienes cuenta?{' '}
              <button 
                type="button" 
                onClick={() => { setErrorMessage(''); setView('login'); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        )}

        {/* 3. VISTA SOLICITAR RECUPERACIÓN DE CONTRASEÑA */}
        {view === 'forgot' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <KeyRound size={26} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Restablecer Contraseña</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Te enviaremos un correo oficial desde Firebase para cambiar tu clave
              </p>
            </div>

            <form onSubmit={handleSendReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Ingresa tu correo registrado:</label>
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '0.75rem', fontSize: '1rem' }}>
                Enviar Correo de Recuperación
              </button>

              <button 
                type="button" 
                onClick={() => setView('login')}
                className="btn-secondary"
                style={{ padding: '0.65rem', fontSize: '0.9rem' }}
              >
                Volver a Iniciar Sesión
              </button>
            </form>
          </div>
        )}

        {/* 4. VISTA CONFIRMACIÓN RECUPERACIÓN */}
        {view === 'reset-code' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#dcfce7', color: '#15803d', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <CheckCircle2 size={26} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Correo Enviado</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Revisa la bandeja de entrada de <strong>{email}</strong>
              </p>
            </div>

            {resetFeedback && (
              <div style={{ backgroundColor: '#eff6ff', padding: '0.9rem', borderRadius: '0.5rem', border: '1px solid #bfdbfe', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#1e40af' }}>
                {resetFeedback.message}
              </div>
            )}

            <button 
              type="button" 
              onClick={() => setView('login')}
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
            >
              Regresar al Inicio de Sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
