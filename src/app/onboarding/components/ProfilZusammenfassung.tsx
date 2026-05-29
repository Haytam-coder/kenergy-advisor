import { UserProfile } from '@/lib/types';

interface Props {
  data: Partial<UserProfile>;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

const LABELS: Record<string, Record<string, string>> = {
  userType: { eigentuemer: 'Eigentümer', mieter: 'Mieter' },
  propertyType: { haus: 'Haus', wohnung: 'Wohnung' },
  goal: { geld: 'Kosten sparen', umwelt: 'Umwelt schützen', beides: 'Beides' },
  heizungstyp: { gas: 'Gas', oel: 'Öl', fernwaerme: 'Fernwärme', waermepumpe: 'Wärmepumpe', nachtspeicher: 'Nachtspeicher', pellets: 'Pellets' },
};

function val(key: string, raw: unknown): string {
  if (raw == null || raw === '') return '—';
  if (LABELS[key]) return LABELS[key][String(raw)] ?? String(raw);
  return String(raw);
}

export default function ProfilZusammenfassung({ data, onSubmit, onBack, submitting }: Props) {
  const items = [
    { label: 'Nutzertyp', value: val('userType', data.userType) },
    { label: 'Immobilie', value: val('propertyType', data.propertyType) },
    { label: 'Ziel', value: val('goal', data.goal) },
    { label: 'PLZ', value: val('', data.plz) },
    { label: 'Baujahr', value: val('', data.baujahr) },
    { label: 'Wohnfläche', value: data.wohnflaeche ? `${data.wohnflaeche} m²` : '—' },
    { label: 'Personen', value: val('', data.personen) },
    { label: 'Effizienzklasse', value: val('', data.energieeffizienzklasse) },
    { label: 'Heizung', value: val('heizungstyp', data.heizungstyp) },
    { label: 'Monatl. Kosten', value: data.monatlicheKosten ? `${data.monatlicheKosten} €` : '—' },
  ];

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '8px' }}>
        Schritt 7 von 7
      </p>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '28px', color: 'var(--text)', marginBottom: '4px' }}>
        Dein Profil
      </h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)', marginBottom: '20px', lineHeight: 1.5 }}>
        Bitte prüfe deine Angaben, bevor wir die Analyse starten.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--divider)',
            borderRadius: '10px',
            padding: '10px 12px',
          }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '2px' }}>
              {label}
            </p>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onBack} style={{
          padding: '12px 18px', background: 'transparent',
          border: '1px solid var(--divider)', borderRadius: '10px',
          fontFamily: 'var(--font-syne-var)', fontSize: '12px',
          color: 'var(--muted)', cursor: 'pointer',
        }}>
          ← Zurück
        </button>
        <button onClick={onSubmit} disabled={submitting} style={{
          flex: 1, padding: '14px',
          background: submitting ? 'rgba(222,104,24,0.4)' : '#de6818',
          color: 'white', border: 'none', borderRadius: '10px',
          fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600,
          letterSpacing: '0.06em', cursor: submitting ? 'default' : 'pointer',
          transition: 'background 0.2s',
        }}>
          {submitting ? 'Analyse läuft…' : 'Analyse starten →'}
        </button>
      </div>
    </div>
  );
}
