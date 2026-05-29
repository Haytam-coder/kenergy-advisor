'use client';

import { useRouter } from 'next/navigation';
import { Massnahme } from '@/lib/types';
import { BudgetOption } from '@/app/dashboard/components/BudgetFilter';
import { KategorieOption } from './KategorieFilter';
import { KATEGORIE_ICON, KATEGORIE_LABEL } from '../constants';
import PrioritaetsScore from '@/app/components/PrioritaetsScore';

interface Props {
  massnahmen: Massnahme[];
  budget: BudgetOption;
  kategorie: KategorieOption;
}

function budgetMax(b: BudgetOption): number {
  if (b === 'alle') return Infinity;
  return parseInt(b, 10);
}

export default function MassnahmenTable({ massnahmen, budget, kategorie }: Props) {
  const router = useRouter();
  const max = budgetMax(budget);

  const filtered = massnahmen
    .filter(m => (m.kostenschaetzung?.min ?? 0) <= max)
    .filter(m => kategorie === 'alle' || m.kategorie === kategorie)
    .sort((a, b) => a.prioritaet - b.prioritaet);

  if (filtered.length === 0) {
    return (
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', padding: '32px 0', textAlign: 'center' }}>
        Keine Maßnahmen für diese Filter.
      </p>
    );
  }

  const col: React.CSSProperties = {
    fontFamily: 'var(--font-syne-var)',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: 'var(--label-color)',
    padding: '0 16px 12px',
    textAlign: 'left',
    fontWeight: 400,
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--divider)' }}>
          <th style={{ ...col, paddingLeft: 0, width: '40%' }}>Maßnahme</th>
          <th style={col}>Kosten</th>
          <th style={col}>Ersparnis/Jahr</th>
          <th style={col}>Amortisation</th>
          <th style={col}>Förderung</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map(m => (
          <tr
            key={m.id}
            onClick={() => router.push(`/massnahmen/${m.id}`)}
            style={{ borderBottom: '1px solid var(--divider)', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <td style={{ padding: '14px 16px 14px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{KATEGORIE_ICON[m.kategorie] ?? '⚡'}</span>
                <div>
                  <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--text)', marginBottom: '2px' }}>
                    {m.titel}
                  </p>
                  <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '10px', color: 'var(--muted)' }}>
                    {KATEGORIE_LABEL[m.kategorie] ?? m.kategorie}
                  </p>
                </div>
              </div>
            </td>

            <td style={{ padding: '14px 16px', fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {m.kostenschaetzung.min === 0 && m.kostenschaetzung.max === 0
                ? <span style={{ color: '#4ade80' }}>Kostenlos</span>
                : `${m.kostenschaetzung.min.toLocaleString('de-DE')}–${m.kostenschaetzung.max.toLocaleString('de-DE')} €`
              }
            </td>

            <td style={{ padding: '14px 16px', fontFamily: 'var(--font-cormorant-var)', fontSize: '18px', color: '#de6818', whiteSpace: 'nowrap' }}>
              €{m.ersparnisjahr.toLocaleString('de-DE')}
            </td>

            <td style={{ padding: '14px 16px', fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {m.amortisationJahre === 0 ? '—' : `${m.amortisationJahre} Jahre`}
                <PrioritaetsScore amortisationJahre={m.amortisationJahre} size="sm" />
              </div>
            </td>

            <td style={{ padding: '14px 16px' }}>
              {m.foerderungVerfuegbar ? (
                <span style={{
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#22c55e',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: '100px',
                  padding: '3px 10px',
                  whiteSpace: 'nowrap',
                }}>
                  Möglich
                </span>
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
