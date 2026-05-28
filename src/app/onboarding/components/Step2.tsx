'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step2Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };
const inputSt: React.CSSProperties = { fontFamily: 'var(--font-syne-var)', fontSize: '14px', color: 'var(--text)', backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '12px', padding: '12px 16px', width: '100%', outline: 'none', transition: 'border-color 0.2s' };

export default function Step2({ data, onChange, onNext, onBack }: Step2Props) {
  const baujahrValid = data.baujahr && Number(data.baujahr) >= 1800 && Number(data.baujahr) <= new Date().getFullYear();
  const canProceed = data.plz && data.plz.length === 5 && baujahrValid && data.wohnflaeche && data.personen;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Dein Gebäude</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Ein paar technische Eckdaten für die Analyse.</p>

      <div className="space-y-6">
        <div>
          <label style={lbl}>Postleitzahl</label>
          <input type="text" maxLength={5} placeholder="z. B. 60311" value={data.plz ?? ''}
            onChange={(e) => onChange({ plz: e.target.value.replace(/\D/g, '') })}
            style={inputSt}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(222,104,24,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }} />
        </div>

        <div>
          <label style={lbl}>Baujahr des Gebäudes</label>
          <input
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            placeholder="z. B. 1968"
            value={data.baujahr ?? ''}
            onChange={(e) => onChange({ baujahr: e.target.value as UserProfile['baujahr'] })}
            style={inputSt}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(222,104,24,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }}
          />
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
            Ungefähres Baujahr – präzise Zuordnung zum TABULA-Archetyp
          </p>
        </div>

        <div>
          <label style={lbl}>Wohnfläche (m²)</label>
          <input type="number" min={10} max={1000} placeholder="z. B. 85" value={data.wohnflaeche ?? ''}
            onChange={(e) => onChange({ wohnflaeche: parseInt(e.target.value) || undefined })}
            style={inputSt}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(222,104,24,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; }} />
        </div>

        <div>
          <label style={lbl}>Personen im Haushalt</label>
          <div className="grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as const).map((n) => (
              <button key={n} onClick={() => onChange({ personen: n })}
                className={clsx('py-3 border rounded-xl font-medium transition-all',
                  data.personen === n ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white'
                )}
                style={{ fontFamily: 'var(--font-syne-var)', fontSize: '14px' }}>
                {n === 4 ? '4+' : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 rounded-xl transition-colors"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600, border: '1px solid var(--divider)', color: 'var(--muted)' }}>
          ← Zurück
        </button>
        <button onClick={onNext} disabled={!canProceed}
          className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', backgroundColor: '#de6818', color: 'white' }}>
          Weiter →
        </button>
      </div>
    </div>
  );
}
