import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, MapPin, Lock, ShieldCheck, CheckCircle2, ArrowRight, Package } from 'lucide-react';

export const Profile = () => {
  const { currentUser, updateProfile, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.shippingAddress || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '450px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <User size={48} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
            Inicia sesión para ver tu perfil
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Accede a tu cuenta de 0x1 Tech para gestionar tus datos personales, direcciones de envío y pedidos.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
            Iniciar Sesión <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

    const nameWords = name.trim().split(/\s+/).filter(Boolean);
    if (nameWords.length < 2) {
      showError('Por favor ingresa tu nombre y al menos un apellido (ej. Juan Pérez).');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        showError('La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (newPassword !== confirmPassword) {
        showError('Las contraseñas no coinciden. Por favor verifícalas.');
        return;
      }
    }

    setLoading(true);
    try {
      await updateProfile({
        name,
        shippingAddress,
        newPassword: newPassword || undefined
      });
      showSuccess('¡Tu perfil ha sido actualizado con éxito!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Ocurrió un error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              Mi Perfil
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>
              Administra tu información personal, dirección de entrega y seguridad de cuenta en 0x1 Tech.
            </p>
          </div>
          <Link 
            to="/mis-pedidos"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', fontSize: '0.9rem' }}
          >
            <Package size={17} /> Ver Mis Compras
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* Tarjeta de Resumen del Usuario */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem', height: 'fit-content' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem auto',
                border: '3px solid #dbeafe'
              }}>
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                {currentUser.name}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
                {currentUser.email}
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', backgroundColor: '#ecfdf5', color: '#065f46', padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }}>
                <ShieldCheck size={15} />
                Rol: {currentUser.role}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                <Mail size={18} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', fontWeight: '600', color: '#1e293b' }}>Correo electrónico:</span>
                  <span>{currentUser.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
                <MapPin size={18} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ display: 'block', fontWeight: '600', color: '#1e293b' }}>Dirección habitual:</span>
                  <span>{currentUser.shippingAddress || 'No has guardado una dirección aún.'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Modificación de Datos [GAP-01] */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>
              Editar Información
            </h3>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                  Nombre y Apellido(s): *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Mariana Ramos Gómez"
                    style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  Por norma de envíos de 0x1 Tech, debes incluir al menos nombre y un apellido.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                  Dirección de Entrega Predeterminada:
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '0.85rem' }} />
                  <textarea 
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, número exterior/interior, colonia, alcaldía/municipio, código postal y referencias..."
                    style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={16} /> Cambiar Contraseña (Opcional)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>
                      Nueva Contraseña:
                    </label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>

                  {newPassword && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#475569', marginBottom: '0.3rem' }}>
                        Confirmar Nueva Contraseña:
                      </label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite la nueva contraseña"
                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary"
                style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '0.95rem', justifyContent: 'center' }}
              >
                {loading ? 'Guardando Cambios...' : 'Guardar Datos del Perfil'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
