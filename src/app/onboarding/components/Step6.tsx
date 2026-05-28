'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

export default function Step6({ data, onChange, onSubmit, onBack, submitting }: Props) {
  const canProceed = data.gerateAlter && data.ledBeleuchtung && data.wohndauer && data.foerderungenBeantragt;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Fast fertig! 🎉</h2>
      <p className="text-gray-500 mb-6">Noch ein paar letzte Details.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Alter deiner Hauptgeräte (Kühlschrank & Waschmaschine)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Unter 5 Jahre', value: 'unter5' as const },
              { label: '5–10 Jahre', value: '5bis10' as const },
              { label: 'Über 10 Jahre', value: 'ueber10' as const },
            ].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ gerateAlter: opt.value })}
                className={clsx('py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all',
                  data.gerateAlter === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">LED-Beleuchtung vorhanden?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '✅ Ja, alles', value: 'ja' as const },
              { label: '🔆 Teilweise', value: 'teilweise' as const },
              { label: '❌ Nein', value: 'nein' as const },
            ].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ ledBeleuchtung: opt.value })}
                className={clsx('py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all',
                  data.ledBeleuchtung === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Wie lange planst du noch hier zu wohnen?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Unter 2 Jahre', value: 'unter2' as const },
              { label: '2–5 Jahre', value: '2bis5' as const },
              { label: 'Langfristig', value: 'langfristig' as const },
            ].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ wohndauer: opt.value })}
                className={clsx('py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all',
                  data.wohndauer === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Förderungen schon mal beantragt?</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Ja', value: 'ja' as const },
              { label: 'Nein', value: 'nein' as const },
              { label: 'Weiß nicht', value: 'weiss_nicht' as const },
            ].map((opt) => (
              <button key={opt.value} onClick={() => onChange({ foerderungenBeantragt: opt.value })}
                className={clsx('py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all',
                  data.foerderungenBeantragt === opt.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} disabled={submitting}
          className="py-3 px-6 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40">
          ← Zurück
        </button>
        <button onClick={onSubmit} disabled={!canProceed || submitting}
          className="flex-1 py-3 px-6 bg-green-500 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600 transition-colors">
          {submitting ? '⏳ Analyse läuft...' : '✨ Analyse starten'}
        </button>
      </div>
    </div>
  );
}
