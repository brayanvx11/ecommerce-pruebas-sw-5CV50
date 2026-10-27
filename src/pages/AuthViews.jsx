import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, KeyRound, UserPlus, CheckCircle2 } from 'lucide-react';

export const AuthViews = ({ initialView = 'login' }) => {
  const { login, register, loginWithGoogle, sendPasswordReset, isFirebaseConfigured } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [view, setView] = useState(initialView); // 'login' | 'register' | 'forgot' | 'reset-code'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Para recuperación
  const [resetFeedback, setResetFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const user = await login(email, password);
      addToast(`¡Bienvenido de nuevo, ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
      addToast(err.message, 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      addToast(`¡Sesión iniciada con Google como ${user.name}!`, 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
      addToast(err.message, 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      // [BUG-AUTH-02] y [BUG-AUTH-01]: nombre y apellido obligatorio, rol forzado a Cliente
      await register({ name, email, password, role: 'Cliente' });
      // [1.1] Mensaje cálido empático solicitado
      addToast('¡Ya estás con nosotros! Bienvenido a 0x1 Tech.', 'success', 5000);
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
      addToast(err.message, 'error');
    }
  };

  const handleSendReset = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      // [BUG-AUTH-04]: Rate limiting controlado con feedback amigable
      const res = await sendPasswordReset(email);
      setResetFeedback(res);
      setView('reset-code');
      addToast('Instrucciones de recuperación enviadas a tu correo.', 'info');
    } catch (err) {
      setErrorMessage(err.message);
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '460px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

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
                Accede a tu cuenta de 0x1 Tech
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
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
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
                  placeholder="ejemplo@0x1tech.com"
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

        {/* 2. VISTA DE REGISTRO [BUG-AUTH-02] */}
        {view === 'register' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <UserPlus size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Crear Cuenta en 0x1 Tech</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Regístrate para comprar y rastrear tus paquetes</p>
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
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>
                  Nombre y Apellido completo: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez Morales"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Ingresa al menos un nombre y un apellido.</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Correo Electrónico: *</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@0x1tech.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Contraseña: *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
              </div>



              <button type="submit" className="btn-primary" style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}>
                Crear Mi Cuenta en 0x1 Tech
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
                Te enviaremos un correo con las instrucciones de restablecimiento seguro
              </p>
            </div>

            <form onSubmit={handleSendReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '0.3rem' }}>Ingresa tu correo registrado:</label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@0x1tech.com"
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
