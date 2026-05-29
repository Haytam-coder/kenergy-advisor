'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step3Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const baujahrLabel: Record<string, string> = { vor1970: 'vor 1970', '1970-1990': '1970–1990', '1990-2010': '1990–2010', nach2010: 'nach 2010' };
const lbl = { fontFamily: 'var(--font-inter-var)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '10px' };

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ padding: '16px', borderRadius: '12px', border: highlight ? '1px solid rgba(222,104,24,0.35)' : '1px solid var(--card-border)', backgroundColor: highlight ? 'rgba(222,104,24,0.08)' : 'var(--card-bg)' }}>
      <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-inter-var)', fontWeight: 600, fontSize: '14px', color: highlight ? '#f0ac24' : 'var(--text)' }}>{value}</p>
    </div>
  );
}

export default function Step3({ data, onChange, onNext, onBack }: Step3Props) {
  const canProceed = !!data.bereitsSaniert;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-inter-var)', fontWeight: 400, fontSize: '44px', color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>Gebäudedaten</h2>
      <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', marginBottom: '24px' }}>Aus der TABULA-Datenbank ermittelt.</p>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <InfoCard label="Gebäudetyp" value={`${data.propertyType === 'haus' ? 'Einfamilienhaus' : 'MFH'} (${baujahrLabel[data.baujahr ?? ''] ?? data.baujahr})`} />
        <InfoCard label="Heizenergiebedarf" value={`~${data.heizenergiebedarfKwh ?? '—'} kWh/m²`} />
        <InfoCard label="Dämmzustand" value={data.daemmzustand ?? '—'} />
        <InfoCard label="Energieeffizienzklasse" value={data.energieeffizienzklasse ?? '—'} highlight />
      </div>

      <div>
        <label style={lbl}>Wurde dein Gebäude bereits teilsaniert?</label>
        <div className="grid grid-cols-3 gap-2">
          {[{ label: 'Ja, teilweise', value: 'ja' as const }, { label: 'Nein', value: 'nein' as const }, { label: 'Weiß nicht', value: 'weiss_nicht' as const }].map((opt) => (
            <button key={opt.value} onClick={() => onChange({ bereitsSaniert: opt.value })}
              className={clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all',
                data.bereitsSaniert === opt.value ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white'
              )}
              style={{ fontFamily: 'var(--font-inter-var)', fontSize: '12px' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 rounded-xl transition-colors"
          style={{ fontFamily: 'var(--font-inter-var)', fontSize: '14px', fontWeight: 600, border: '1px solid var(--divider)', color: 'var(--muted)' }}>
          ← Zurück
        </button>
        <button onClick={onNext} disabled={!canProceed}
          className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-inter-var)', fontSize: '14px', backgroundColor: '#de6818', color: 'white' }}>
          Weiter →
        </button>
      </div>
    </div>
  );
}
