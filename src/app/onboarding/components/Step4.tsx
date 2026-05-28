'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import clsx from 'clsx';

interface Step4Props {
  data: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: () => void;
  onBack: () => void;
}

const heizungsOptions: { label: string; value: UserProfile['heizungstyp']; icon: string }[] = [
  { label: 'Gas', value: 'gas', icon: '🔥' },
  { label: 'Öl', value: 'oel', icon: '🛢️' },
  { label: 'Fernwärme', value: 'fernwaerme', icon: '🏭' },
  { label: 'Wärmepumpe', value: 'waermepumpe', icon: '♨️' },
  { label: 'Nachtspeicher', value: 'nachtspeicher', icon: '⚡' },
  { label: 'Pellets', value: 'pellets', icon: '🪵' },
];

const warmwasserOptions: { label: string; value: UserProfile['warmwasser'] }[] = [
  { label: '🔥 Über Heizung', value: 'heizung' },
  { label: '⚡ Elektrisch', value: 'elektrisch' },
  { label: '☀️ Solar', value: 'solar' },
];

export default function Step4({ data, onChange, onNext, onBack }: Step4Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const canProceed = data.heizungstyp && data.warmwasser && data.monatlicheKosten;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus('Rechnung wird analysiert...');

    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const mediaType = file.type.includes('pdf') ? 'image/jpeg' : file.type;

        const res = await fetch('/api/extract-bill', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mediaType }),
        });
        const result = await res.json();

        if (result.kwh) {
          onChange({ stromverbrauchKwh: result.kwh });
          setUploadStatus(`✅ ${result.kwh} kWh/Jahr erkannt`);
        } else {
          setUploadStatus('⚠️ Wert nicht erkannt – bitte manuell eingeben');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadStatus('❌ Fehler beim Lesen der Datei');
      setUploading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Energie & Kosten</h2>
      <p className="text-gray-500 mb-6">Dein aktueller Energiemix.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Heizungstyp</label>
          <div className="grid grid-cols-3 gap-3">
            {heizungsOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ heizungstyp: opt.value })}
                className={clsx(
                  'p-3 border-2 rounded-xl text-center transition-all',
                  data.heizungstyp === opt.value
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                )}
              >
                <div className="text-2xl mb-1">{opt.icon}</div>
                <div className="text-xs font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Warmwasserbereitung</label>
          <div className="grid grid-cols-3 gap-3">
            {warmwasserOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ warmwasser: opt.value })}
                className={clsx(
                  'py-3 px-2 border-2 rounded-xl text-sm font-medium transition-all',
                  data.warmwasser === opt.value
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monatliche Energiekosten: <span className="text-green-600">€{data.monatlicheKosten ?? 150}</span>
          </label>
          <input
            type="range"
            min={50}
            max={500}
            step={10}
            value={data.monatlicheKosten ?? 150}
            onChange={(e) => onChange({ monatlicheKosten: parseInt(e.target.value) })}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>€50</span>
            <span>€500</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Stromrechnung hochladen <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition-colors">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-sm font-medium text-gray-700">PDF, JPG oder PNG auswählen</p>
              <p className="text-xs text-gray-400">KI liest automatisch deinen kWh-Verbrauch aus</p>
            </div>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          {uploadStatus && (
            <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
          )}
          {data.stromverbrauchKwh && (
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm text-gray-600">Oder manuell eingeben:</label>
              <input
                type="number"
                value={data.stromverbrauchKwh}
                onChange={(e) => onChange({ stromverbrauchKwh: parseInt(e.target.value) || undefined })}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-28"
                placeholder="kWh/Jahr"
              />
            </div>
          )}
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
