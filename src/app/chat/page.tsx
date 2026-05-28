'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, ChatMessage } from '@/lib/types';
import { loadProfile, loadChatHistory, saveChatHistory } from '@/lib/storage';
import DashboardShell from '@/app/components/DashboardShell';

const SUGGESTIONS = [
  'Erkläre meine Top-Maßnahme',
  'Was bringt mir die meiste Ersparnis?',
  'Wie beantrage ich Förderung?',
];

export default function ChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const p = await loadProfile();
      if (!p) { router.push('/onboarding'); return; }
      setProfile(p);
      const history = await loadChatHistory();
      setMessages(history);
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || !profile || sending) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim(), timestamp: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setSending(true);

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), history: messages, profile }),
      });
      const data = await r.json();
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.reply ?? 'Entschuldigung, ich konnte keine Antwort generieren.',
        timestamp: Date.now(),
      };
      const withReply = [...next, assistantMsg];
      setMessages(withReply);
      await saveChatHistory(withReply);
    } catch {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: 'Verbindungsfehler. Bitte versuche es nochmal.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(222,104,24,0.25)', borderTop: '2px solid #de6818', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '40px 40px 0' }}>

        <div style={{ marginBottom: '24px', flexShrink: 0 }}>
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
            Dein persönlicher Energieberater
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
            KI-<em style={{ color: '#de6818' }}>Berater.</em>
          </h1>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
          {messages.length === 0 && (
            <div style={{ paddingTop: '32px' }}>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', marginBottom: '20px', textAlign: 'center' }}>
                Wie kann ich dir helfen?
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    style={{
                      fontFamily: 'var(--font-syne-var)',
                      fontSize: '12px',
                      letterSpacing: '0.04em',
                      color: 'var(--text)',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '100px',
                      padding: '10px 18px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(222,104,24,0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--card-border)')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user'
                  ? 'rgba(222,104,24,0.15)'
                  : 'var(--card-bg)',
                border: m.role === 'user'
                  ? '1px solid rgba(222,104,24,0.25)'
                  : '1px solid var(--card-border)',
                fontFamily: 'var(--font-syne-var)',
                fontSize: '13px',
                color: 'var(--text)',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {sending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                fontFamily: 'var(--font-syne-var)',
                fontSize: '13px',
                color: 'var(--muted)',
              }}>
                …
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{
          flexShrink: 0,
          padding: '16px 0 32px',
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          gap: '10px',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Schreib eine Frage…"
            style={{
              flex: 1,
              background: 'var(--input-bg)',
              border: '1px solid var(--input-border)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontFamily: 'var(--font-syne-var)',
              fontSize: '13px',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || sending}
            style={{
              background: input.trim() && !sending ? '#de6818' : 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: 'var(--font-syne-var)',
              fontSize: '12px',
              fontWeight: 600,
              color: input.trim() && !sending ? 'white' : 'var(--muted)',
              cursor: input.trim() && !sending ? 'pointer' : 'default',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Senden
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
