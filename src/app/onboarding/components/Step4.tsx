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
  { label: '🔥 Heizung', value: 'heizung' },
  { label: '⚡ Elektrisch', value: 'elektrisch' },
  { label: '☀️ Solar', value: 'solar' },
];

const lbl = { fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--label-color)', display: 'block', marginBottom: '12px' };

export default function Step4({ data, onChange, onNext, onBack }: Step4Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const canProceed = data.heizungstyp && data.warmwasser && data.monatlicheKosten;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadStatus('Rechnung wird analysiert...');
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(',')[1];
        const mediaType = file.type.includes('pdf') ? 'image/jpeg' : file.type;
        const res = await fetch('/api/extract-bill', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: base64, mediaType }) });
        const result = await res.json();
        if (result.kwh) { onChange({ stromverbrauchKwh: result.kwh }); setUploadStatus(`✅ ${result.kwh} kWh/Jahr erkannt`); }
        else setUploadStatus('⚠️ Wert nicht erkannt – bitte manuell eingeben');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setUploadStatus('❌ Fehler beim Lesen der Datei'); setUploading(false); }
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.1 }}>Energie & Kosten</h2>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '28px' }}>Dein aktueller Energiemix.</p>

      <div className="space-y-6">
        <div>
          <label style={lbl}>Heizungstyp</label>
          <div className="grid grid-cols-3 gap-2">
            {heizungsOptions.map((opt) => (
              <button key={opt.value} onClick={() => onChange({ heizungstyp: opt.value })}
                className={clsx('p-3 border rounded-xl text-center transition-all',
                  data.heizungstyp === opt.value ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white'
                )}>
                <div className="text-2xl mb-1">{opt.icon}</div>
                <div style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', fontWeight: 500 }}>{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Warmwasserbereitung</label>
          <div className="grid grid-cols-3 gap-2">
            {warmwasserOptions.map((opt) => (
              <button key={opt.value} onClick={() => onChange({ warmwasser: opt.value })}
                className={clsx('py-3 px-2 border rounded-xl text-sm font-medium transition-all',
                  data.warmwasser === opt.value ? 'border-[#de6818] bg-[#de6818]/15 text-white' : 'border-white/10 bg-white/4 text-[#8a7868] hover:border-[#de6818]/50 hover:text-white'
                )}
                style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ ...lbl, marginBottom: '8px' }}>
            Monatliche Energiekosten: <span style={{ color: '#f0ac24', fontWeight: 600 }}>€{data.monatlicheKosten ?? 150}</span>
          </label>
          <input type="range" min={50} max={500} step={10} value={data.monatlicheKosten ?? 150}
            onChange={(e) => onChange({ monatlicheKosten: parseInt(e.target.value) })}
            className="w-full accent-[#de6818]" />
          <div className="flex justify-between mt-1" style={{ fontFamily: 'var(--font-syne-var)', fontSize: '10px', color: 'var(--subtle)' }}>
            <span>€50</span><span>€500</span>
          </div>
        </div>

        <div>
          <label style={{ ...lbl, marginBottom: '8px' }}>Stromrechnung hochladen <span style={{ color: 'var(--subtle)', textTransform: 'none', letterSpacing: 0, fontSize: '12px' }}>(optional)</span></label>
          <label className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors"
            style={{ border: '1px dashed var(--divider)', backgroundColor: 'var(--card-bg)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = 'rgba(222,104,24,0.4)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = 'var(--divider)'; }}>
            <span className="text-xl">📄</span>
            <div>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>PDF, JPG oder PNG</p>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', color: 'var(--muted)' }}>KI liest automatisch deinen kWh-Verbrauch</p>
            </div>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
          {uploadStatus && <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>{uploadStatus}</p>}
          {data.stromverbrauchKwh && (
            <div className="mt-2 flex items-center gap-2">
              <label style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>Manuell:</label>
              <input type="number" value={data.stromverbrauchKwh} onChange={(e) => onChange({ stromverbrauchKwh: parseInt(e.target.value) || undefined })} placeholder="kWh/Jahr"
                style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--text)', backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)', borderRadius: '8px', padding: '6px 12px', width: '120px', outline: 'none' }} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="py-3 px-6 rounded-xl transition-colors"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', fontWeight: 600, border: '1px solid var(--divider)', color: 'var(--muted)' }}>
          ← Zurück
        </button>
        <button onClick={onNext} disabled={!canProceed}
          className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', backgroundColor: '#de6818', color: 'white' }}>
          Weiter →
        </button>
      </div>
    </div>
  );
}
