import React from 'react';
import { ShoppingBag, Heart, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer = ({ setCurrentView }) => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#f8fafc', paddingTop: '3.5rem', paddingBottom: '2.5rem', marginTop: '4rem', borderTop: '1px solid #1e293b' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
        
        {/* Marca & Misión */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex' }}>
              <ShoppingBag size={20} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff' }}>TechStore México</span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Tu plataforma de tecnología líder. Encuentra productos de alta calidad, envíos rápidos garantizados y soporte 24/7.
          </p>
        </div>

        {/* Redes Sociales Requeridas */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.2rem' }}>Síguenos en Redes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            <a 
              href="https://instagram.com/techstore_mx" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e1306c'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>Instagram:</span> @techstore_mx
              <ExternalLink size={14} />
            </a>

            <a 
              href="https://x.com/techstore_mx" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#38bdf8'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>X (Twitter):</span> @techstore_mx
              <ExternalLink size={14} />
            </a>

            <a 
              href="https://tiktok.com/@techstore_mx" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#22d3ee'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>TikTok:</span> @techstore_mx
              <ExternalLink size={14} />
            </a>

            <a 
              href="https://wa.me/525512345678" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#22c55e'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>WhatsApp:</span> +52 55 1234 5678
              <ExternalLink size={14} />
            </a>

          </div>
        </div>

        {/* Políticas y Enlaces Legales */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.2rem' }}>Información Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
            <li>
              <button 
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setCurrentView('returns'); }}
                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0, fontSize: '0.9rem', textDecoration: 'underline' }}
              >
                Políticas de Devolución
              </button>
            </li>
            <li style={{ color: '#94a3b8' }}>Términos y Condiciones</li>
            <li style={{ color: '#94a3b8' }}>Aviso de Privacidad</li>
            <li style={{ color: '#94a3b8' }}>Facturación Electrónica CFDI</li>
          </ul>
        </div>

      </div>

      <div className="container" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} TechStore Inc. Todos los derechos reservados. Desarrollado según especificaciones de requermientos_iniciales.md.
      </div>
    </footer>
  );
};
