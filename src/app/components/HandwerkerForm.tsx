'use client';

import { useState } from 'react';
import { useToast } from './ToastProvider';

interface Props {
  massnahmeId: string;
  massnahmeTitel: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontFamily: 'var(--font-syne-var)',
  fontSize: '13px',
  color: 'var(--text)',
  outline: 'none',
};

export default function HandwerkerForm({ massnahmeId, massnahmeTitel }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [plz, setPlz] = useState('');
  const [telefon, setTelefon] = useState('');
  const [sending, setSending] = useState(false);

  async function submit() {
    if (!name.trim() || !plz.trim()) return;
    setSending(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, plz, telefon, massnahme_id: massnahmeId, massnahme_titel: massnahmeTitel }),
      });
      toast('Anfrage gesendet! Wir melden uns innerhalb von 48 Stunden.', 'success');
      setOpen(false);
      setName(''); setPlz(''); setTelefon('');
    } catch {
      toast('Fehler beim Senden. Bitte versuche es erneut.', 'error');
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        display: 'block', width: '100%', textAlign: 'center',
        padding: '16px', background: '#de6818', color: 'white',
        borderRadius: '14px', fontFamily: 'var(--font-syne-var)',
        fontSize: '13px', fontWeight: 600, letterSpacing: '0.06em',
        border: 'none', cursor: 'pointer', transition: 'background 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#b84200')}
        onMouseLeave={e => (e.currentTarget.style.background = '#de6818')}
      >
        Kostenloses Angebot von Kenergy →
      </button>
    );
  }

  const canSubmit = name.trim() && plz.trim() && !sending;

  return (
    <div style={{
      background: 'rgba(222,104,24,0.06)',
      border: '1px solid rgba(222,104,24,0.2)',
      borderRadius: '16px',
      padding: '24px',
    }}>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#de6818', marginBottom: '6px' }}>
        Kostenloses Angebot
      </p>
      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)', marginBottom: '18px', lineHeight: 1.6 }}>
        Wir verbinden dich mit einem zertifizierten Handwerker für „{massnahmeTitel}".
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name *" style={inputStyle} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input value={plz} onChange={e => setPlz(e.target.value)} placeholder="PLZ *" style={inputStyle} />
          <input value={telefon} onChange={e => setTelefon(e.target.value)} placeholder="Telefon (optional)" style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={submit} disabled={!canSubmit} style={{
          flex: 1, padding: '12px',
          background: canSubmit ? '#de6818' : 'rgba(255,255,255,0.05)',
          color: canSubmit ? 'white' : 'var(--muted)',
          border: 'none', borderRadius: '10px',
          fontFamily: 'var(--font-syne-var)', fontSize: '12px', fontWeight: 600,
          cursor: canSubmit ? 'pointer' : 'default', transition: 'all 0.2s',
        }}>
          {sending ? 'Wird gesendet…' : 'Anfrage senden'}
        </button>
        <button onClick={() => setOpen(false)} style={{
          padding: '12px 16px', background: 'transparent',
          border: '1px solid var(--divider)', borderRadius: '10px',
          fontFamily: 'var(--font-syne-var)', fontSize: '12px',
          color: 'var(--muted)', cursor: 'pointer',
        }}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}
