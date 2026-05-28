'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5B({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.eigeneHeizungsregelung !== undefined && data.hausverwaltungAktiv !== undefined && data.verbesserungenGeplant;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Deine Wohnung</h2>
      <p className="text-gray-500 mb-6">Details für Eigentümer einer Wohnung.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Eigene Heizungsregelung möglich?</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ eigeneHeizungsregelung: opt.value })}
                className={clsx('py-3 px-4 border-2 rounded-xl font-medium transition-all',
                  data.eigeneHeizungsregelung === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Aktive Hausverwaltung vorhanden?</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ hausverwaltungAktiv: opt.value })}
                className={clsx('py-3 px-4 border-2 rounded-xl font-medium transition-all',
                  data.hausverwaltungAktiv === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Verbesserungen geplant?</label>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'Ja', value: 'ja' as const }, { label: 'Nein', value: 'nein' as const }, { label: 'Noch unsicher', value: 'unsicher' as const }].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ verbesserungenGeplant: opt.value })}
                className={clsx('py-3 px-3 border-2 rounded-xl text-sm font-medium transition-all',
                  data.verbesserungenGeplant === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">← Zurück</button>
        <button onClick={onNext} disabled={!canProceed}
          className="flex-1 py-3 px-6 bg-green-500 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors">
          Weiter →
        </button>
      </div>
    </div>
  );
}
