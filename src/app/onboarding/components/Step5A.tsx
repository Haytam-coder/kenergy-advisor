'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props { data: Partial<UserProfile>; onChange: (u: Partial<UserProfile>) => void; onNext: () => void; onBack: () => void; }

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };
const sc = (sel: boolean) => clsx('py-3 px-4 border rounded-xl font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');

export default function Step5A({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.dachausrichtung !== undefined && data.solarVorhanden !== undefined && data.sanierenGeplant;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Dein Haus</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Details für Eigentümer eines Hauses.</p>
      <div className="space-y-6">
        <div>
          <label style={lbl}>Dachausrichtung</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '☀️ Süden', value: 'sued' as const }, { label: '↔️ Ost/West', value: 'ost_west' as const }, { label: '🌑 Norden', value: 'nord' as const }, { label: '❓ Weiß nicht', value: 'weiss_nicht' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ dachausrichtung: opt.value })} className={sc(data.dachausrichtung === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Solaranlage vorhanden?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ solarVorhanden: opt.value })} className={sc(data.solarVorhanden === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Sanierung in 2 Jahren geplant?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Ja', value: 'ja' as const }, { label: 'Nein', value: 'nein' as const }, { label: 'Unsicher', value: 'unsicher' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ sanierenGeplant: opt.value })} className={clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all', data.sanierenGeplant === opt.value ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white')} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 rounded-xl transition-colors" style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', color: '#8a7868' }}>← Zurück</button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', backgroundColor: '#de6818', color: 'white' }}>Weiter →</button>
      </div>
    </div>
  );
}
