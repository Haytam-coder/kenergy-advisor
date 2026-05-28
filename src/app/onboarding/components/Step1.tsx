'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step1Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
}

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-4 border-2 rounded-xl text-center font-medium transition-all',
        selected
          ? 'border-green-500 bg-green-50 text-green-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
      )}
    >
      {label}
    </button>
  );
}

export default function Step1({ data, onChange, onNext }: Step1Props) {
  const canProceed = data.userType && data.propertyType && data.goal;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Wer bist du?</h2>
      <p className="text-gray-500 mb-6">Damit wir dir die richtigen Tipps geben können.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Ich bin...</label>
          <div className="grid grid-cols-2 gap-3">
            <SelectCard
              label="🏠 Mieter"
              selected={data.userType === 'mieter'}
              onClick={() => onChange({ userType: 'mieter' })}
            />
            <SelectCard
              label="🔑 Eigentümer"
              selected={data.userType === 'eigentuemer'}
              onClick={() => onChange({ userType: 'eigentuemer' })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Ich wohne in...</label>
          <div className="grid grid-cols-2 gap-3">
            <SelectCard
              label="🏡 Haus"
              selected={data.propertyType === 'haus'}
              onClick={() => onChange({ propertyType: 'haus' })}
            />
            <SelectCard
              label="🏢 Wohnung"
              selected={data.propertyType === 'wohnung'}
              onClick={() => onChange({ propertyType: 'wohnung' })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Mein Hauptziel ist...</label>
          <div className="grid grid-cols-1 gap-3">
            <SelectCard
              label="💰 Geld sparen"
              selected={data.goal === 'geld'}
              onClick={() => onChange({ goal: 'geld' })}
            />
            <SelectCard
              label="🌱 Umwelt schonen"
              selected={data.goal === 'umwelt'}
              onClick={() => onChange({ goal: 'umwelt' })}
            />
            <SelectCard
              label="✨ Beides"
              selected={data.goal === 'beides'}
              onClick={() => onChange({ goal: 'beides' })}
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="mt-8 w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
      >
        Weiter →
      </button>
    </div>
  );
}
