import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#f8fafc', paddingTop: '3.5rem', paddingBottom: '2.5rem', marginTop: '4rem', borderTop: '1px solid #1e293b' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
        
        {/* Marca & Misión: 0x1 Tech */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex', border: '1px solid #334155' }}>
              <ShoppingBag size={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#ffffff' }}>0x1</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#38bdf8' }}>Tech</span>
            </div>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Especialistas en hardware, computación de alto rendimiento, audio y periféricos. Calidad probada, envíos garantizados y soporte técnico especializado.
          </p>
        </div>

        {/* [BUG-UI-01] Redes Sociales Institucionales Reparadas */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.2rem' }}>Síguenos en Redes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            <a 
              href="https://www.instagram.com/0x1tech_oficial" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#e1306c'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>Instagram:</span> @0x1tech_oficial
              <ExternalLink size={14} />
            </a>

            <a 
              href="https://x.com/0X1Tech_Oficia1" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#38bdf8'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>X (Twitter):</span> @0X1Tech_Oficia1
              <ExternalLink size={14} />
            </a>

            {/* [BUG-UI-01] Enlace institucional a TikTok */}
            <a 
              href="https://www.tiktok.com/@0x1tech_oficial" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#cbd5e1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#22d3ee'}
              onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
            >
              <span style={{ fontWeight: '600' }}>TikTok:</span> @0x1tech_oficial
              <ExternalLink size={14} />
            </a>

            {/* [BUG-UI-01] Enlace institucional a WhatsApp con mensaje de bienvenida */}
            <a 
              href="https://api.whatsapp.com/send?phone=525512345678&text=Hola%200x1%20Tech,%20deseo%20informaci%C3%B3n%20sobre%20un%20producto" 
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
              <Link 
                to="/devoluciones"
                style={{ color: '#60a5fa', textDecoration: 'underline', fontSize: '0.9rem' }}
              >
                Políticas de Devolución
              </Link>
            </li>
            <li style={{ color: '#94a3b8' }}>Garantía 0x1 Tech (12 meses)</li>
            <li style={{ color: '#94a3b8' }}>Aviso de Privacidad Integral</li>
            <li style={{ color: '#94a3b8' }}>Facturación Electrónica CFDI 4.0</li>
          </ul>
        </div>

      </div>

      <div className="container" style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        © {new Date().getFullYear()} 0x1 Tech S.A. de C.V. Todos los derechos reservados. Plataforma de comercio electrónico.
      </div>
    </footer>
  );
};
