'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Verbrauchsdaten analysieren…',
  'Einsparpotenziale berechnen…',
  'Förderungen prüfen…',
  'Maßnahmen priorisieren…',
  'Energieplan erstellen…',
];

export default function LoadingSteps() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>
      <div style={{
        width: '48px', height: '48px',
        border: '2px solid rgba(222,104,24,0.2)',
        borderTop: '2px solid #de6818',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '260px' }}>
        {STEPS.map((step, i) => (
          <div key={step} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: i <= current ? 1 : 0.2,
            transition: 'opacity 0.5s ease',
          }}>
            <div style={{
              width: '18px', height: '18px',
              borderRadius: '50%',
              flexShrink: 0,
              background: i < current ? '#4ade80' : i === current ? '#de6818' : 'rgba(255,255,255,0.08)',
              border: i === current ? '2px solid rgba(222,104,24,0.35)' : 'none',
              transition: 'background 0.4s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', color: 'black', fontWeight: 700,
            }}>
              {i < current ? '✓' : ''}
            </div>
            <p style={{
              fontFamily: 'var(--font-syne-var)',
              fontSize: '11px',
              letterSpacing: '0.04em',
              color: i === current ? 'var(--text)' : 'var(--muted)',
              transition: 'color 0.4s ease',
              margin: 0,
            }}>
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
