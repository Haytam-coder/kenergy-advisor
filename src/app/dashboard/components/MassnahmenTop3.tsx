'use client';

import Link from 'next/link';
import { Massnahme } from '@/lib/types';
import { BudgetOption } from './BudgetFilter';

interface Props {
  massnahmen: Massnahme[];
  ziel: 'geld' | 'umwelt' | 'beides';
  budget: BudgetOption;
}

const kategorieLabel: Record<string, string> = {
  heizung: 'Heizung',
  daemmung: 'Dämmung',
  solar: 'Solar',
  geraete: 'Geräte',
  verhalten: 'Verhalten',
  tarif: 'Tarif',
  foerderung: 'Förderung',
};

const lbl: React.CSSProperties = {
  fontFamily: 'var(--font-syne-var)',
  fontSize: '9px',
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--label-color)',
  display: 'block',
  marginBottom: '14px',
};

function budgetMax(b: BudgetOption): number {
  if (b === 'alle') return Infinity;
  return parseInt(b);
}

export default function MassnahmenTop3({ massnahmen, ziel, budget }: Props) {
  const max = budgetMax(budget);

  const filtered = massnahmen.filter((m) => m.kostenschaetzung.min <= max);

  const sorted = [...filtered].sort((a, b) => {
    if (ziel === 'geld') return b.ersparnisjahr - a.ersparnisjahr;
    if (ziel === 'umwelt') return b.co2ReduktionKg - a.co2ReduktionKg;
    return a.prioritaet - b.prioritaet;
  });

  const top3 = sorted.slice(0, 3);

  if (top3.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)' }}>
          Keine Maßnahmen für dieses Budget gefunden.
        </p>
      </div>
    );
  }

  return (
    <div>
      <span style={lbl}>Top-Maßnahmen</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {top3.map((m, i) => (
          <div key={m.id} style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            transition: 'border-color 0.2s',
          }}>
            {/* Rank */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontFamily: 'var(--font-cormorant-var)',
              fontSize: '32px',
              fontWeight: 300,
              color: 'var(--card-border)',
              lineHeight: 1,
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Tags row */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-syne-var)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: '100px',
                padding: '3px 10px',
              }}>
                {kategorieLabel[m.kategorie] || m.kategorie}
              </span>
              {m.foerderungVerfuegbar && (
                <span style={{
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#22c55e',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: '100px',
                  padding: '3px 10px',
                }}>
                  Förderung möglich
                </span>
              )}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-cormorant-var)',
              fontWeight: 400,
              fontSize: '22px',
              color: 'var(--text)',
              marginBottom: '8px',
              lineHeight: 1.2,
              paddingRight: '40px',
            }}>
              {m.titel}
            </h3>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-syne-var)',
              fontSize: '12px',
              color: 'var(--muted)',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}>
              {m.beschreibung}
            </p>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              borderTop: '1px solid var(--divider)',
              paddingTop: '14px',
              marginBottom: m.kenergy_referral ? '14px' : '0',
            }}>
              <div>
                <span style={{ ...lbl, marginBottom: '2px', fontSize: '8px' }}>Ersparnis/Jahr</span>
                <span style={{
                  fontFamily: 'var(--font-cormorant-var)',
                  fontSize: '18px',
                  color: '#de6818',
                }}>
                  €{m.ersparnisjahr.toLocaleString('de-DE')}
                </span>
              </div>
              <div>
                <span style={{ ...lbl, marginBottom: '2px', fontSize: '8px' }}>Kosten</span>
                <span style={{
                  fontFamily: 'var(--font-cormorant-var)',
                  fontSize: '18px',
                  color: 'var(--text)',
                }}>
                  €{m.kostenschaetzung.min.toLocaleString('de-DE')}
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>+</span>
                </span>
              </div>
              <div>
                <span style={{ ...lbl, marginBottom: '2px', fontSize: '8px' }}>Amortisation</span>
                <span style={{
                  fontFamily: 'var(--font-cormorant-var)',
                  fontSize: '18px',
                  color: 'var(--text)',
                }}>
                  {m.amortisationJahre}
                  <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '2px' }}>J.</span>
                </span>
              </div>
            </div>

            {/* Kenergy CTA */}
            {m.kenergy_referral && (
              <a
                href="https://kenergy-solutions.de"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  background: '#de6818',
                  color: 'white',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#b84200')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#de6818')}
              >
                Kostenloses Angebot von Kenergy →
              </a>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <Link href="/massnahmen" style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          textDecoration: 'none',
          borderBottom: '1px solid var(--divider)',
          paddingBottom: '2px',
          transition: 'color 0.2s, border-color 0.2s',
        }}>
          Alle Maßnahmen ansehen →
        </Link>
      </div>
    </div>
  );
}
