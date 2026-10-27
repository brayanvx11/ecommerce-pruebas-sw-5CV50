import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, FileText, Mail, Download, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generatePdfDocument, sendOrderEmailSimulation } from '../services/mailSimulator';
import confetti from 'canvas-confetti';

export const Checkout = () => {
  const { cart, cartTotal, placeOrder } = useStore();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Estados de Checkout
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'gpay'
  const [shippingAddress, setShippingAddress] = useState(currentUser?.shippingAddress || 'Av. Insurgentes Sur 1450, Benito Juárez, CDMX');

  // Simulación de Facturación [BUG-BILL-01]
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const [rfc, setRfc] = useState('');
  const [businessName, setBusinessName] = useState(currentUser?.name || '');

  // [BUG-PAY-01] Validaciones de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [validationError, setValidationError] = useState('');

  // Estado del proceso de compra
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  // Expresiones regulares de validación [BUG-PAY-01] y [BUG-BILL-01]
  const RFC_REGEX = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;

  const handleCardNumberChange = (e) => {
    // Solo dígitos y máximo 16
    const clean = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(clean);
  };

  const handleCvvChange = (e) => {
    // 3 o 4 dígitos
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvv(clean);
  };

  const handleExpChange = (e) => {
    let clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2);
    }
    setCardExp(clean);
  };

  const handleCompletePurchase = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validar dirección obligatoria
    if (!shippingAddress.trim() || shippingAddress.trim().length < 8) {
      setValidationError('Por favor ingresa una dirección de entrega completa y válida (mínimo 8 caracteres).');
      return;
    }

    // [BUG-PAY-01] Validaciones estrictas de Tarjeta
    if (paymentMethod === 'card') {
      if (cardNumber.length !== 16) {
        setValidationError('El número de tarjeta debe tener exactamente 16 dígitos numéricos.');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
        setValidationError('La fecha de vencimiento debe tener formato MM/AA (ej. 12/28).');
        return;
      }

      // Validación de tarjeta vencida
      const [expMonth, expYear] = cardExp.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      const month = parseInt(expMonth, 10);
      const year = parseInt(expYear, 10);

      if (month < 1 || month > 12) {
        setValidationError('El mes de vencimiento es inválido (01-12).');
        return;
      }
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setValidationError('La tarjeta ingresada está vencida.');
        return;
      }

      if (cardCvv.length < 3 || cardCvv.length > 4) {
        setValidationError('El código de seguridad CVV debe tener 3 o 4 dígitos.');
        return;
      }
    }

    // [BUG-BILL-01] Validaciones de Facturación
    if (wantsInvoice) {
      const cleanRfc = rfc.trim().toUpperCase();
      if (!cleanRfc || !RFC_REGEX.test(cleanRfc)) {
        setValidationError('El RFC ingresado no tiene un formato fiscal válido de persona física o moral (ej. XAXX010101000).');
        return;
      }
      if (!businessName.trim() || businessName.trim().length < 3) {
        setValidationError('Ingresa el Nombre o Razón Social fiscal completa para la factura.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const methodLabel =
        paymentMethod === 'card' ? 'Tarjeta de Crédito / Débito' :
          paymentMethod === 'paypal' ? 'PayPal (Simulado)' : 'Google Pay (Simulado)';

      const order = await placeOrder({
        items: cart,
        total: cartTotal,
        paymentMethod: methodLabel,
        shippingAddress: shippingAddress.trim(),
        hasInvoice: wantsInvoice,
        invoiceData: wantsInvoice ? { rfc: rfc.trim().toUpperCase(), businessName: businessName.trim() } : null
      });

      // [BUG-MAIL-01] Envío y bitácora de correo
      const emailRecord = await sendOrderEmailSimulation({
        order,
        recipientEmail: currentUser?.email || 'cliente@tienda.com',
        sendInvoice: wantsInvoice
      });

      setCompletedOrder(order);
      setEmailStatus(emailRecord);
      addToast('¡Compra realizada con éxito en 0x1 Tech! 🎉', 'success');

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setValidationError('Ocurrió un error al procesar la compra: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTicket = () => {
    if (!completedOrder) return;
    const doc = generatePdfDocument({ order: completedOrder, isInvoice: false });
    doc.save(`Ticket_0x1Tech_${completedOrder.id}.pdf`);
    addToast('Descargando Ticket de Compra...', 'info');
  };

  const handleDownloadInvoice = () => {
    if (!completedOrder) return;
    const doc = generatePdfDocument({ order: completedOrder, isInvoice: true });
    doc.save(`Factura_0x1Tech_${completedOrder.id}.pdf`);
    addToast('Descargando Factura Electrónica...', 'info');
  };

  // Pantalla de Éxito / Confirmación
  if (completedOrder) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '2.5rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>

          <div style={{ backgroundColor: '#dcfce7', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', color: '#15803d' }}>
            <CheckCircle2 size={40} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            ¡Compra Finalizada con Éxito!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', margin: '0 0 1.5rem 0' }}>
            Número de Pedido 0x1 Tech: <strong style={{ color: '#2563eb' }}>{completedOrder.id}</strong>
          </p>

          {/* Estado del envío simulado */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', color: '#334155' }}>Estado del Envío:</span>
              <span className="badge badge-info">{completedOrder.shippingStatus}</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Destino: {completedOrder.shippingAddress}
            </div>
          </div>

          {/* Notificación de Correo Enviado */}
          {emailStatus && (
            <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #bfdbfe', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Mail size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', color: '#1e40af', fontSize: '0.9rem' }}>
                  Confirmación despachada a tu correo
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#3b82f6' }}>
                  Se ha enviado el {completedOrder.hasInvoice ? 'ticket y la factura' : 'ticket de compra'} a: <strong>{emailStatus.to}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Botones de Descarga en PDF */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button
              onClick={handleDownloadTicket}
              className="btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              <Download size={16} /> Descargar Ticket en PDF
            </button>

            {completedOrder.hasInvoice && (
              <button
                onClick={handleDownloadInvoice}
                className="btn-primary"
                style={{ fontSize: '0.9rem' }}
              >
                <FileText size={16} /> Descargar Factura Electrónica
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/mis-pedidos"
              className="btn-secondary"
              style={{ flex: 1, padding: '0.8rem', textDecoration: 'none' }}
            >
              Rastrear mi Envío [GAP-03]
            </Link>
            <Link
              to="/"
              className="btn-primary"
              style={{ flex: 1, padding: '0.8rem', textDecoration: 'none' }}
            >
              Volver a la Tienda
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Formulario de Checkout
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>

      <Link
        to="/carrito"
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'inline-flex', textDecoration: 'none' }}
      >
        <ArrowLeft size={16} /> Volver al carrito
      </Link>

      {validationError && (
        <div style={{ maxWidth: '900px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>

        {/* Formulario Principal */}
        <form onSubmit={handleCompletePurchase} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* 1. Dirección de Entrega */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 1rem 0' }}>
              1. Dirección de Entrega
            </h3>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#475569', marginBottom: '0.4rem' }}>
              Calle, Número, Colonia, Alcaldía/Municipio, Código Postal y Ciudad: *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Av. Reforma 222, Col. Juárez, Cuauhtémoc, CP 06600, CDMX"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>

          {/* 2. Medios de Pago Simulados [BUG-PAY-01] */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 1rem 0' }}>
              2. Medio de Pago Simulado
            </h3>

            {/* Opciones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

              {/* Tarjeta de Crédito / Débito */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem',
                border: '1px solid', borderColor: paymentMethod === 'card' ? '#2563eb' : '#cbd5e1',
                borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: paymentMethod === 'card' ? '#eff6ff' : '#ffffff'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <CreditCard size={20} color="#2563eb" />
                <span style={{ fontWeight: '500', color: '#1e293b' }}>Tarjeta de Crédito / Débito (16 dígitos obligatorios)</span>
              </label>

              {/* PayPal Simulado */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem',
                border: '1px solid', borderColor: paymentMethod === 'paypal' ? '#2563eb' : '#cbd5e1',
                borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: paymentMethod === 'paypal' ? '#eff6ff' : '#ffffff'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <span style={{ fontWeight: 'bold', color: '#003087', fontSize: '1.1rem' }}>Pay<span style={{ color: '#0079C1' }}>Pal</span></span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>(Simulación de checkout con cuenta PayPal)</span>
              </label>

              {/* Google Pay Simulado */}
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem',
                border: '1px solid', borderColor: paymentMethod === 'gpay' ? '#2563eb' : '#cbd5e1',
                borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: paymentMethod === 'gpay' ? '#eff6ff' : '#ffffff'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'gpay'}
                  onChange={() => setPaymentMethod('gpay')}
                />
                <span style={{ fontWeight: 'bold', color: '#4285F4', fontSize: '1.05rem' }}>G<span style={{ color: '#EA4335' }}>o</span><span style={{ color: '#FBBC05' }}>o</span><span style={{ color: '#4285F4' }}>g</span><span style={{ color: '#34A853' }}>l</span><span style={{ color: '#EA4335' }}>e</span> Pay</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>(Pago biométrico con 1 toque)</span>
              </label>

            </div>

            {/* Inputs de Tarjeta con Validación [BUG-PAY-01] */}
            {paymentMethod === 'card' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
                    Número de Tarjeta (16 dígitos) *
                  </label>
                  <input
                    type="text"
                    placeholder="4532123456789012"
                    maxLength={16}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{cardNumber.length}/16 dígitos</span>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
                    Vence (MM/AA) *
                  </label>
                  <input
                    type="text"
                    placeholder="12/28"
                    maxLength={5}
                    value={cardExp}
                    onChange={handleExpChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.2rem' }}>
                    CVV (3-4 dígitos) *
                  </label>
                  <input
                    type="password"
                    placeholder="742"
                    maxLength={4}
                    value={cardCvv}
                    onChange={handleCvvChange}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            )}

          </div>

          {/* 3. Generación y Simulación de Factura con Validación [BUG-BILL-01] */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  ¿Requieres Factura Fiscal Electrónica?
                </h3>
              </div>
              <input
                type="checkbox"
                id="invoiceCheck"
                checked={wantsInvoice}
                onChange={(e) => setWantsInvoice(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {wantsInvoice && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' }}>
                    RFC del Contribuyente (12 o 13 caracteres con homoclave): *
                  </label>
                  <input
                    type="text"
                    required={wantsInvoice}
                    placeholder="Ej. XAXX010101000"
                    maxLength={13}
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#475569', marginBottom: '0.3rem' }}>
                    Nombre o Razón Social (según Constancia de Situación Fiscal): *
                  </label>
                  <input
                    type="text"
                    required={wantsInvoice}
                    placeholder="Ej. Juan Pérez García o Tech Solutions S.A. de C.V."
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  * Se emitirá comprobante con desglose de IVA (16%) y uso de CFDI G03 (Gastos en general).
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary"
            style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}
          >
            {isProcessing ? 'Procesando Pago Seguro...' : `Pagar $${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`}
          </button>

        </form>

        {/* Resumen Lateral */}
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 1rem 0' }}>
            Artículos en el pedido
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#334155' }}>{item.quantity}x {item.name}</span>
                <span style={{ fontWeight: '600' }}>${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>Total a pagar:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>
              ${cartTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} /> Compra 100% Protegida y Cifrada por 0x1 Tech
          </div>
        </div>

      </div>

    </div>
  );
};
