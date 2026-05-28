import Link from 'next/link';
import { Massnahme } from '@/lib/types';
import { KATEGORIE_ICON, KATEGORIE_LABEL } from '@/app/massnahmen/constants';

interface Props {
  massnahmen: Massnahme[];
}

export default function TopMassnahmenCards({ massnahmen }: Props) {
  const top3 = [...massnahmen]
    .sort((a, b) => a.prioritaet - b.prioritaet)
    .slice(0, 3);

  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-syne-var)',
        fontSize: '9px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'var(--label-color)',
        marginBottom: '14px',
      }}>
        Top-Maßnahmen
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {top3.map((m) => (
          <Link key={m.id} href={`/massnahmen/${m.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '16px',
              padding: '18px',
              height: '100%',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(222,104,24,0.35)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--card-border)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>{KATEGORIE_ICON[m.kategorie] ?? '⚡'}</span>
                {m.foerderungVerfuegbar && (
                  <span style={{
                    fontFamily: 'var(--font-syne-var)',
                    fontSize: '8px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#22c55e',
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '100px',
                    padding: '2px 8px',
                  }}>
                    Förderung
                  </span>
                )}
              </div>

              <p style={{
                fontFamily: 'var(--font-syne-var)',
                fontSize: '8px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                marginBottom: '4px',
              }}>
                {KATEGORIE_LABEL[m.kategorie] ?? m.kategorie}
              </p>

              <p style={{
                fontFamily: 'var(--font-cormorant-var)',
                fontSize: '18px',
                color: 'var(--text)',
                lineHeight: 1.2,
                marginBottom: '12px',
              }}>
                {m.titel}
              </p>

              <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '10px' }}>
                <p style={{
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '9px',
                  color: 'var(--muted)',
                  marginBottom: '2px',
                }}>
                  Ersparnis/Jahr
                </p>
                <p style={{
                  fontFamily: 'var(--font-cormorant-var)',
                  fontSize: '22px',
                  color: '#de6818',
                }}>
                  €{m.ersparnisjahr.toLocaleString('de-DE')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Link href="/massnahmen" style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'var(--muted)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--divider)',
          paddingBottom: '1px',
        }}>
          Alle Maßnahmen →
        </Link>
      </div>
    </div>
  );
}
