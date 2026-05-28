'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5C({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.heizungSelbstRegelbar !== undefined && data.stromanbietterGewechselt !== undefined && data.vermieterkontakt;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Dein gemietetes Haus</h2>
      <p className="text-gray-500 mb-6">Ein paar Fragen zur Situation als Mieter.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Heiztemperatur selbst regulierbar?</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ heizungSelbstRegelbar: opt.value })}
                className={clsx('py-3 px-4 border-2 rounded-xl font-medium transition-all',
                  data.heizungSelbstRegelbar === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Stromanbieter schon mal gewechselt?</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ label: '✅ Ja', value: true }, { label: '❌ Nein', value: false }].map((opt) => (
              <button key={String(opt.value)} onClick={() => onChange({ stromanbietterGewechselt: opt.value })}
                className={clsx('py-3 px-4 border-2 rounded-xl font-medium transition-all',
                  data.stromanbietterGewechselt === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Kontakt zum Vermieter?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Regelmäßig', value: 'regelmaessig' as const },
              { label: 'Selten', value: 'selten' as const },
              { label: 'Nie', value: 'nie' as const },
            ].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ vermieterkontakt: opt.value })}
                className={clsx('py-3 px-3 border-2 rounded-xl text-sm font-medium transition-all',
                  data.vermieterkontakt === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
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
