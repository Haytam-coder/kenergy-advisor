'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step2Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const baujahrOptions: { label: string; value: UserProfile['baujahr'] }[] = [
  { label: 'Vor 1970', value: 'vor1970' },
  { label: '1970–1990', value: '1970-1990' },
  { label: '1990–2010', value: '1990-2010' },
  { label: 'Nach 2010', value: 'nach2010' },
];

export default function Step2({ data, onChange, onNext, onBack }: Step2Props) {
  const canProceed = data.plz && data.plz.length === 5 && data.baujahr && data.wohnflaeche && data.personen;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Dein Gebäude</h2>
      <p className="text-gray-500 mb-6">Ein paar technische Eckdaten für die Analyse.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Postleitzahl</label>
          <input
            type="text"
            maxLength={5}
            placeholder="z. B. 60311"
            value={data.plz ?? ''}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              onChange({ plz: val });
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Baujahr des Gebäudes</label>
          <div className="grid grid-cols-2 gap-3">
            {baujahrOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ baujahr: opt.value })}
                className={clsx(
                  'py-3 px-4 border-2 rounded-xl font-medium transition-all',
                  data.baujahr === opt.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Wohnfläche (m²)</label>
          <input
            type="number"
            min={10}
            max={1000}
            placeholder="z. B. 85"
            value={data.wohnflaeche ?? ''}
            onChange={(e) => onChange({ wohnflaeche: parseInt(e.target.value) || undefined })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Personen im Haushalt</label>
          <div className="grid grid-cols-4 gap-3">
            {([1, 2, 3, 4] as const).map((n) => (
              <button
                key={n}
                onClick={() => onChange({ personen: n })}
                className={clsx(
                  'py-3 border-2 rounded-xl font-medium transition-all',
                  data.personen === n
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                {n === 4 ? '4+' : n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onBack}
          className="py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Zurück
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-3 px-6 bg-green-500 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
