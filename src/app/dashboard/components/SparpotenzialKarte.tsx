'use client';

import { AnalyseResult } from '@/lib/types';

interface Props {
  analyse: AnalyseResult;
}

const lbl: React.CSSProperties = {
  fontFamily: 'var(--font-syne-var)',
  fontSize: '9px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--label-color)',
  display: 'block',
  marginBottom: '16px',
};

export default function SparpotenzialKarte({ analyse }: Props) {
  const autofahrten = Math.round(analyse.co2ReduktionKgJahr / 200);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(222,104,24,0.12) 0%, rgba(222,104,24,0.04) 100%)',
      border: '1px solid rgba(222,104,24,0.25)',
      borderRadius: '20px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle accent line */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #de6818, transparent)',
        borderRadius: '20px 20px 0 0',
      }} />

      <span style={lbl}>Sparpotenzial</span>

      <div style={{ marginBottom: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-cormorant-var)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '48px',
          lineHeight: 1,
          color: '#de6818',
        }}>
          bis zu €{analyse.maxErsparnisjahr.toLocaleString('de-DE')}
        </span>
        <span style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '13px',
          color: 'var(--muted)',
          marginLeft: '8px',
        }}>
          / Jahr
        </span>
      </div>

      <p style={{
        fontFamily: 'var(--font-syne-var)',
        fontSize: '13px',
        color: 'var(--text)',
        opacity: 0.75,
        marginBottom: '20px',
        lineHeight: 1.5,
      }}>
        Das entspricht{' '}
        <strong style={{ color: 'var(--text)', opacity: 1 }}>
          {analyse.co2ReduktionKgJahr.toLocaleString('de-DE')} kg CO₂
        </strong>{' '}
        weniger pro Jahr.
      </p>

      <div style={{
        borderTop: '1px solid rgba(222,104,24,0.2)',
        paddingTop: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '18px' }}>🚗</span>
        <span style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '12px',
          color: 'var(--muted)',
        }}>
          = {autofahrten} Autofahrten Frankfurt–Berlin
        </span>
      </div>

      {analyse.kurzfazit && (
        <p style={{
          marginTop: '16px',
          fontFamily: 'var(--font-syne-var)',
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}>
          „{analyse.kurzfazit}"
        </p>
      )}
    </div>
  );
}
