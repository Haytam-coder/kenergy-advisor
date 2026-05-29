'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step1Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
}

function SelectCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={clsx(
      'p-4 border rounded-xl text-center font-medium transition-all',
      selected
        ? 'border-[#de6818] bg-[#de6818]/15 text-white'
        : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white'
    )} style={{ fontFamily: 'var(--font-inter-var)', fontSize: '14px' }}>
      {label}
    </button>
  );
}

const lbl = { fontFamily: 'var(--font-inter-var)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '10px' };

export default function Step1({ data, onChange, onNext }: Step1Props) {
  const canProceed = data.userType && data.propertyType && data.goal;
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-inter-var)', fontWeight: 400, fontSize: '44px', color: 'var(--text)', marginBottom: '6px', lineHeight: 1 }}>Wer bist du?</h2>
      <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', marginBottom: '28px' }}>Damit wir dir die richtigen Tipps geben können.</p>

      <div className="space-y-6">
        <div>
          <label style={lbl}>Ich bin...</label>
          <div className="grid grid-cols-2 gap-2">
            <SelectCard label="🏠 Mieter" selected={data.userType === 'mieter'} onClick={() => onChange({ userType: 'mieter' })} />
            <SelectCard label="🔑 Eigentümer" selected={data.userType === 'eigentuemer'} onClick={() => onChange({ userType: 'eigentuemer' })} />
          </div>
        </div>
        <div>
          <label style={lbl}>Ich wohne in...</label>
          <div className="grid grid-cols-2 gap-2">
            <SelectCard label="🏡 Haus" selected={data.propertyType === 'haus'} onClick={() => onChange({ propertyType: 'haus' })} />
            <SelectCard label="🏢 Wohnung" selected={data.propertyType === 'wohnung'} onClick={() => onChange({ propertyType: 'wohnung' })} />
          </div>
        </div>
        <div>
          <label style={lbl}>Mein Hauptziel ist...</label>
          <div className="grid grid-cols-1 gap-2">
            <SelectCard label="💰 Geld sparen" selected={data.goal === 'geld'} onClick={() => onChange({ goal: 'geld' })} />
            <SelectCard label="🌱 Umwelt schonen" selected={data.goal === 'umwelt'} onClick={() => onChange({ goal: 'umwelt' })} />
            <SelectCard label="✨ Beides" selected={data.goal === 'beides'} onClick={() => onChange({ goal: 'beides' })} />
          </div>
        </div>
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-inter-var)', fontSize: '13px', letterSpacing: '0.08em', backgroundColor: '#de6818', color: 'white' }}>
        Weiter →
      </button>
    </div>
  );
}
