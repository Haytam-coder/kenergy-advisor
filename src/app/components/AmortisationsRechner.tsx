'use client';

import { useState } from 'react';

interface Props {
  ersparnisjahr: number;
  kostenMin: number;
  kostenMax: number;
}

export default function AmortisationsRechner({ ersparnisjahr, kostenMin, kostenMax }: Props) {
  const defaultVal = Math.round((kostenMin + kostenMax) / 2);
  const [investition, setInvestition] = useState(defaultVal);

  if (ersparnisjahr <= 0 || (kostenMin === 0 && kostenMax === 0)) return null;

  const breakEvenYears = investition > 0 ? Math.ceil(investition / ersparnisjahr) : 0;
  const displayCount = Math.min(breakEvenYears + 2, 12);

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '20px 24px',
      marginBottom: '16px',
    }}>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '16px' }}>
        Amortisations-Rechner
      </p>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', color: 'var(--muted)' }}>Investition</span>
          <span style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '22px', color: '#de6818' }}>
            {investition.toLocaleString('de-DE')} €
          </span>
        </div>
        <input
          type="range"
          min={Math.max(0, kostenMin)}
          max={Math.max(kostenMax, kostenMin + 1)}
          value={investition}
          onChange={e => setInvestition(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#de6818', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', color: 'var(--muted)' }}>{kostenMin.toLocaleString('de-DE')} €</span>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', color: 'var(--muted)' }}>{kostenMax.toLocaleString('de-DE')} €</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
        {Array.from({ length: displayCount }, (_, i) => {
          const isBreak = i === breakEvenYears;
          const isPast = i < breakEvenYears;
          return (
            <div key={i} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isBreak ? '#4ade80' : isPast ? 'rgba(222,104,24,0.18)' : 'rgba(255,255,255,0.05)',
                border: isBreak ? '2px solid #4ade80' : '1px solid var(--divider)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isBreak ? '13px' : '9px',
                color: isBreak ? 'black' : 'var(--muted)',
                fontFamily: 'var(--font-syne-var)',
                fontWeight: isBreak ? 700 : 400,
                transition: 'all 0.3s',
              }}>
                {isBreak ? '✓' : i}
              </div>
              {isBreak && (
                <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '7px', color: '#4ade80', whiteSpace: 'nowrap', letterSpacing: '0.08em' }}>
                  Break-even
                </span>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', color: 'var(--muted)', textAlign: 'center' }}>
        Rentiert sich nach{' '}
        <strong style={{ color: '#4ade80' }}>
          {breakEvenYears === 0 ? 'sofort' : `${breakEvenYears} ${breakEvenYears === 1 ? 'Jahr' : 'Jahren'}`}
        </strong>
        {' '}bei {ersparnisjahr.toLocaleString('de-DE')} € Ersparnis/Jahr
      </p>
    </div>
  );
}
