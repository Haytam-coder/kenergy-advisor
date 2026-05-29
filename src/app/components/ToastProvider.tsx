'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: number; message: string; type: ToastType; }

const ToastCtx = createContext<{ toast: (msg: string, type?: ToastType) => void }>({ toast: () => {} });

export function useToast() { return useContext(ToastCtx); }

const COLORS: Record<ToastType, string> = {
  success: '#4ade80',
  error: '#f87171',
  info: '#de6818',
};

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--card-bg)',
            border: `1px solid ${COLORS[t.type]}50`,
            borderRadius: '12px',
            padding: '12px 18px',
            fontFamily: 'var(--font-syne-var)',
            fontSize: '12px',
            color: 'var(--text)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            animation: 'toastIn 0.3s ease forwards',
            pointerEvents: 'auto',
            maxWidth: '320px',
          }}>
            <span style={{
              color: COLORS[t.type],
              fontSize: '15px',
              flexShrink: 0,
              fontWeight: 700,
            }}>
              {ICONS[t.type]}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
