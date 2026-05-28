'use client';

import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step3Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const baujahrLabel: Record<string, string> = {
  vor1970: 'vor 1970',
  '1970-1990': '1970–1990',
  '1990-2010': '1990–2010',
  nach2010: 'nach 2010',
};

export default function Step3({ data, onChange, onNext, onBack }: Step3Props) {
  const canProceed = !!data.bereitsSaniert;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Gebäudedaten bestätigen</h2>
      <p className="text-gray-500 mb-6">Wir haben folgende Daten aus der TABULA-Datenbank ermittelt.</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <InfoCard
          label="Gebäudetyp"
          value={`${data.propertyType === 'haus' ? 'Einfamilienhaus' : 'Mehrfamilienhaus'} (Baujahr ${baujahrLabel[data.baujahr ?? ''] ?? data.baujahr})`}
        />
        <InfoCard
          label="Heizenergiebedarf"
          value={`~${data.heizenergiebedarfKwh ?? '—'} kWh/m²/Jahr`}
        />
        <InfoCard
          label="Dämmzustand"
          value={data.daemmzustand ?? '—'}
        />
        <InfoCard
          label="Energieeffizienzklasse"
          value={data.energieeffizienzklasse ?? '—'}
          highlight
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Wurde dein Gebäude bereits teilsaniert?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Ja, teilweise', value: 'ja' as const },
            { label: 'Nein', value: 'nein' as const },
            { label: 'Weiß nicht', value: 'weiss_nicht' as const },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ bereitsSaniert: opt.value })}
              className={clsx(
                'py-3 px-3 border-2 rounded-xl text-sm font-medium transition-all',
                data.bereitsSaniert === opt.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              )}
            >
              {opt.label}
            </button>
          ))}
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

function InfoCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={clsx('p-4 rounded-xl border', highlight ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50')}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={clsx('font-semibold text-sm', highlight ? 'text-green-700' : 'text-gray-800')}>{value}</p>
    </div>
  );
}
