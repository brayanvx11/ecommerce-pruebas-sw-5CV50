import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const showSuccess = useCallback((message, duration = 3500) => {
    addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message, duration = 4000) => {
    addToast(message, 'error', duration);
  }, [addToast]);

  const showInfo = useCallback((message, duration = 3500) => {
    addToast(message, 'info', duration);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let bg = '#10b981';
          let Icon = CheckCircle2;
          if (toast.type === 'error') {
            bg = '#ef4444';
            Icon = AlertCircle;
          } else if (toast.type === 'info') {
            bg = '#3b82f6';
            Icon = Info;
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${bg}`,
                borderRadius: '0.5rem',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                minWidth: '280px',
                maxWidth: '420px',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <Icon size={20} color={bg} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', fontWeight: '500', flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '2px',
                  display: 'flex'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: (msg) => console.log(msg),
      showSuccess: (msg) => console.log(msg),
      showError: (msg) => console.error(msg),
      showInfo: (msg) => console.info(msg)
    };
  }
  return context;
};
