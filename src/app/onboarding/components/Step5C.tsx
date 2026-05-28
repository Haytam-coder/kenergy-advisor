'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props { data: Partial<UserProfile>; onChange: (u: Partial<UserProfile>) => void; onNext: () => void; onBack: () => void; }

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };
const sc2 = (sel: boolean) => clsx('py-3 px-4 border rounded-xl font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');
const sc3 = (sel: boolean) => clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');

export default function Step5C({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.heizungSelbstRegelbar !== undefined && data.stromanbietterGewechselt !== undefined && data.vermieterkontakt;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Dein gemietetes Haus</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Ein paar Fragen zur Situation als Mieter.</p>
      <div className="space-y-6">
        <div>
          <label style={lbl}>Heiztemperatur selbst regulierbar?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ heizungSelbstRegelbar: opt.value })} className={sc2(data.heizungSelbstRegelbar === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Stromanbieter schon mal gewechselt?</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ stromanbietterGewechselt: opt.value })} className={sc2(data.stromanbietterGewechselt === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Kontakt zum Vermieter?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Regelmäßig', value: 'regelmaessig' as const }, { label: 'Selten', value: 'selten' as const }, { label: 'Nie', value: 'nie' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ vermieterkontakt: opt.value })} className={sc3(data.vermieterkontakt === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
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
