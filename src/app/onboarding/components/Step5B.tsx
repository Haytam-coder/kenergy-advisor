'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props { data: Partial<UserProfile>; onChange: (u: Partial<UserProfile>) => void; onNext: () => void; onBack: () => void; }

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };
const sc2 = (sel: boolean) => clsx('py-3 px-4 border rounded-xl font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');
const sc3 = (sel: boolean) => clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');

export default function Step5B({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.eigeneHeizungsregelung !== undefined && data.hausverwaltungAktiv !== undefined && data.verbesserungenGeplant;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Deine Wohnung</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Details für Eigentümer einer Wohnung.</p>
      <div className="space-y-6">
        <div>
          <label style={lbl}>Eigene Heizungsregelung möglich?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ eigeneHeizungsregelung: opt.value })} className={sc2(data.eigeneHeizungsregelung === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Aktive Hausverwaltung vorhanden?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ hausverwaltungAktiv: opt.value })} className={sc2(data.hausverwaltungAktiv === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Verbesserungen geplant?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Ja', value: 'ja' as const }, { label: 'Nein', value: 'nein' as const }, { label: 'Unsicher', value: 'unsicher' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ verbesserungenGeplant: opt.value })} className={sc3(data.verbesserungenGeplant === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 rounded-xl transition-colors" style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600, border: '1px solid var(--divider)', color: 'var(--muted)' }}>← Zurück</button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', backgroundColor: '#de6818', color: 'white' }}>Weiter →</button>
      </div>
    </div>
  );
}
