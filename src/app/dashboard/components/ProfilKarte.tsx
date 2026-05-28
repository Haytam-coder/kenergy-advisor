'use client';

import { UserProfile } from '@/lib/types';
import { AnalyseResult } from '@/lib/types';

interface Props {
  profile: UserProfile;
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

function klasseColor(klasse: string): string {
  if (['A+', 'A'].includes(klasse)) return '#22c55e';
  if (klasse === 'B') return '#84cc16';
  if (klasse === 'C') return '#eab308';
  if (klasse === 'D') return '#f97316';
  if (['E', 'F'].includes(klasse)) return '#ef4444';
  return '#dc2626';
}

export default function ProfilKarte({ profile, analyse }: Props) {
  const klasse = profile.energieeffizienzklasse || '?';
  const color = klasseColor(klasse);

  const archetype = profile.tabulaArchetype || (profile.propertyType === 'haus' ? 'Einfamilienhaus' : 'Wohnung');

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '20px',
      padding: '28px',
    }}>
      <span style={lbl}>Dein Gebäude</span>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-cormorant-var)',
          fontWeight: 300,
          fontSize: '28px',
          color: 'var(--text)',
          lineHeight: 1.1,
          marginBottom: '10px',
        }}>
          {archetype}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '12px',
            color: 'var(--muted)',
          }}>
            Baujahr {profile.baujahr}
          </span>
          <span style={{ color: 'var(--divider)' }}>·</span>
          <span style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '12px',
            color: 'var(--muted)',
          }}>
            {profile.wohnflaeche} m²
          </span>
          <span style={{ color: 'var(--divider)' }}>·</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: `${color}22`,
            border: `1px solid ${color}55`,
            borderRadius: '100px',
            padding: '3px 10px',
            fontFamily: 'var(--font-syne-var)',
            fontSize: '11px',
            fontWeight: 600,
            color: color,
            letterSpacing: '0.06em',
          }}>
            Klasse {klasse}
          </span>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid var(--divider)',
        paddingTop: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
      }}>
        <div>
          <span style={{ ...lbl, marginBottom: '4px' }}>Jahresverbrauch</span>
          <span style={{
            fontFamily: 'var(--font-cormorant-var)',
            fontSize: '22px',
            fontWeight: 300,
            color: 'var(--text)',
          }}>
            {(analyse.jahresverbrauchKwh ?? 0).toLocaleString('de-DE')}
            <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '4px' }}>kWh</span>
          </span>
        </div>
        <div>
          <span style={{ ...lbl, marginBottom: '4px' }}>Jahreskosten</span>
          <span style={{
            fontFamily: 'var(--font-cormorant-var)',
            fontSize: '22px',
            fontWeight: 300,
            color: 'var(--text)',
          }}>
            {(analyse.jahreskosten ?? 0).toLocaleString('de-DE')}
            <span style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '4px' }}>€</span>
          </span>
        </div>
      </div>

      {profile.daemmzustand && (
        <div style={{ marginTop: '16px' }}>
          <span style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '11px',
            color: 'var(--muted)',
            background: 'var(--input-bg)',
            border: '1px solid var(--input-border)',
            borderRadius: '100px',
            padding: '4px 12px',
          }}>
            {profile.daemmzustand}
          </span>
        </div>
      )}
    </div>
  );
}
