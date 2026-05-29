'use client';

import Link from 'next/link';

interface Props {
  foerderungsIds: string[];
}

const lbl: React.CSSProperties = {
  fontFamily: 'var(--font-inter-var)',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--label-color)',
  display: 'block',
  marginBottom: '12px',
};

export default function FoerderungsBadge({ foerderungsIds }: Props) {
  const count = foerderungsIds.length;

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '24px',
    }}>
      <span style={lbl}>Förderungen</span>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              fontFamily: 'var(--font-inter-var)',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: 1,
              color: '#de6818',
            }}>
              {count}
            </span>
            <span style={{
              fontFamily: 'var(--font-inter-var)',
              fontSize: '13px',
              color: 'var(--text)',
              opacity: 0.7,
            }}>
              {count === 1 ? 'Programm' : 'Programme'}
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-inter-var)',
            fontSize: '12px',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}>
            für die du dich qualifizierst
          </p>
        </div>

        <Link href="/foerderungen" style={{
          flexShrink: 0,
          fontFamily: 'var(--font-inter-var)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          textDecoration: 'none',
          border: '1px solid var(--divider)',
          borderRadius: '100px',
          padding: '8px 14px',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(222,104,24,0.4)';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--divider)';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)';
        }}
        >
          Alle ansehen →
        </Link>
      </div>
    </div>
  );
}
