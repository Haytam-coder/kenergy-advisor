'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props { data: Partial<UserProfile>; onChange: (u: Partial<UserProfile>) => void; onSubmit: () => void; onBack: () => void; submitting: boolean; }

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };
const sc = (sel: boolean) => clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all', sel ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white');

export default function Step6({ data, onChange, onSubmit, onBack, submitting }: Props) {
  const canProceed = data.gerateAlter && data.ledBeleuchtung && data.wohndauer && data.foerderungenBeantragt;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Fast fertig.</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Noch ein paar letzte Details.</p>

      <div className="space-y-6">
        <div>
          <label style={lbl}>Alter deiner Hauptgeräte</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Unter 5 J.', value: 'unter5' as const }, { label: '5–10 J.', value: '5bis10' as const }, { label: 'Über 10 J.', value: 'ueber10' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ gerateAlter: opt.value })} className={sc(data.gerateAlter === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>LED-Beleuchtung vorhanden?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: '✅ Ja, alles', value: 'ja' as const }, { label: '🔆 Teilweise', value: 'teilweise' as const }, { label: '❌ Nein', value: 'nein' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ ledBeleuchtung: opt.value })} className={sc(data.ledBeleuchtung === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Wie lange planst du hier zu wohnen?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Unter 2 J.', value: 'unter2' as const }, { label: '2–5 J.', value: '2bis5' as const }, { label: 'Langfristig', value: 'langfristig' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ wohndauer: opt.value })} className={sc(data.wohndauer === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Förderungen schon beantragt?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ label: 'Ja', value: 'ja' as const }, { label: 'Nein', value: 'nein' as const }, { label: 'Weiß nicht', value: 'weiss_nicht' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ foerderungenBeantragt: opt.value })} className={sc(data.foerderungenBeantragt === opt.value)} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} disabled={submitting} className="py-3 px-6 rounded-xl transition-colors disabled:opacity-30"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', color: '#8a7868' }}>
          ← Zurück
        </button>
        <button onClick={onSubmit} disabled={!canProceed || submitting}
          className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', backgroundColor: '#de6818', color: 'white' }}>
          {submitting ? '⏳ Analyse läuft...' : '→ Analyse starten'}
        </button>
      </div>
    </div>
  );
}
