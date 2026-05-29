'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { loadProfile } from '@/lib/storage';
import type { ChatMessage, UserProfile } from '@/lib/types';

const STARTERS = [
  'Wie viel kann ich im Jahr sparen?',
  'Was ist ein Energieaudit?',
  'Welche Fördermittel gibt es?',
];

const FALLBACK_PROFILE: UserProfile = {
  userType: 'eigentuemer', propertyType: 'haus', goal: 'geld',
  plz: '60000', baujahr: 1980, wohnflaeche: 120, personen: 2,
  tabulaArchetype: 'EFH.DE.N.68.Gen', heizenergiebedarfKwh: 18000,
  daemmzustand: 'schlecht', energieeffizienzklasse: 'F', bereitsSaniert: 'nein',
  heizungstyp: 'gas', warmwasser: 'heizung', monatlicheKosten: 200,
  gerateAlter: 'ueber10', ledBeleuchtung: 'teilweise',
  wohndauer: 'langfristig', foerderungenBeantragt: 'nein',
};


function RobotIcon({ size = 26, color = 'rgba(255,255,255,0.85)' }: { size?: number; color?: string }) {
  const s = (size / 40) * 26;
  const fill = color.replace(/[\d.]+\)$/, (m) => String(parseFloat(m) * 0.7) + ')');
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="10" y="13" width="20" height="16" rx="3" stroke={color} strokeWidth="1.5" />
      <circle cx="16" cy="19" r="2" stroke={color} strokeWidth="1.5" />
      <circle cx="24" cy="19" r="2" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="24" width="12" height="2" rx="1" fill={fill} />
      <line x1="20" y1="13" x2="20" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="8" r="1.5" fill={color} />
      <line x1="10" y1="20" x2="7" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="20" x2="33" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GlassRobotAvatar({ size = 32, isDark = true }: { size?: number; isDark?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      border: isDark ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(224,96,32,0.35)',
      boxShadow: isDark ? 'inset 0 0 12px rgba(232,112,32,0.15)' : 'inset 0 0 10px rgba(224,96,32,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <RobotIcon size={size} color={isDark ? 'rgba(255,255,255,0.85)' : 'rgba(224,96,32,0.75)'} />
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 2px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: 'rgba(232,112,32,0.7)',
          display: 'inline-block',
          animation: `chatTyping 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const touchStartX = useRef(0);

  // Load profile and restore messages from sessionStorage
  useEffect(() => {
    loadProfile().then((p) => setProfile(p));
    try {
      const saved = sessionStorage.getItem('kenergy_chat');
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Detect theme
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme !== 'light');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Persist messages
  useEffect(() => {
    try { sessionStorage.setItem('kenergy_chat', JSON.stringify(messages)); } catch { /* ignore */ }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  // Keyboard: Escape closes panel
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg: ChatMessage = { role: 'user', content: msg, timestamp: Date.now() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages, profile: profile ?? FALLBACK_PROFILE }),
      });
      const data = await res.json();
      const reply: ChatMessage = { role: 'assistant', content: data.reply ?? 'Entschuldigung, etwas ist schiefgelaufen.', timestamp: Date.now() };
      setMessages([...newHistory, reply]);
    } catch {
      setMessages([...newHistory, { role: 'assistant', content: 'Verbindungsfehler – bitte versuch es erneut.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, profile]);

  // Swipe to close
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0].clientX - touchStartX.current > 60) setIsOpen(false);
  };

  const font = 'var(--font-inter-var), Inter, sans-serif';
  const panelBg = isDark ? 'rgba(10,6,0,0.18)' : 'rgba(200,195,190,0.38)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.14)';
  const textPrimary = isDark ? '#F5F0E8' : '#1A1614';
  const textSecondary = isDark ? '#9A8870' : '#7A6E68';
  const dividerColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const inputBg = isDark ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.60)';
  const aiBubbleBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.70)';
  const aiBubbleBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <>
      {/* ── Floating Trigger ── */}
      <button
        className="chat-trigger"
        onClick={() => setIsOpen(true)}
        aria-label="KENERGY AI Chat öffnen"
        style={{
          display: isOpen ? 'none' : undefined,
          ...(!isDark && {
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(232,112,32,0.45)',
            boxShadow: 'inset 0 0 20px rgba(232,112,32,0.35), 0 8px 32px rgba(200,80,20,0.28), 0 0 0 0 rgba(224,96,32,0.4)',
          }),
        }}
      >
        <RobotIcon color={isDark ? 'rgba(255,255,255,0.85)' : 'rgba(224,96,32,0.75)'} />
      </button>

      {/* ── Side Panel ── */}
      <aside
        ref={panelRef}
        className={`chat-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="KENERGY AI Energieberater"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        style={{
          background: panelBg,
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: `1px solid ${panelBorder}`,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px',
          borderBottom: `1px solid ${dividerColor}`,
          flexShrink: 0,
        }}>
          <GlassRobotAvatar size={32} isDark={isDark} />
          <span style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: textPrimary, flex: 1 }}>
            KENERGY <span style={{ color: '#E87020', fontWeight: 400 }}>· AI</span>
          </span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Chat schließen"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, fontSize: '20px', lineHeight: 1, padding: '4px', borderRadius: '6px', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = textSecondary)}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 && (
            <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <GlassRobotAvatar size={48} isDark={isDark} />
                <p style={{ fontFamily: font, fontSize: '13px', color: textSecondary, marginTop: '12px', lineHeight: 1.6 }}>
                  Dein persönlicher KI-Energieberater.<br />Stell mir eine Frage.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      textAlign: 'left', background: aiBubbleBg, border: `1px solid ${aiBubbleBorder}`,
                      borderRadius: '12px', padding: '10px 14px', cursor: 'pointer',
                      fontFamily: font, fontSize: '13px', color: textPrimary,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(232,112,32,0.4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = aiBubbleBorder; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className="chat-msg"
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: '8px',
                alignItems: 'flex-end',
              }}
            >
              {msg.role === 'assistant' && <GlassRobotAvatar size={24} isDark={isDark} />}
              <div style={{
                maxWidth: '82%',
                padding: '10px 13px',
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? 'rgba(224,96,32,0.80)' : aiBubbleBg,
                border: msg.role === 'user' ? 'none' : `1px solid ${aiBubbleBorder}`,
                fontFamily: font,
                fontSize: '14px',
                lineHeight: 1.6,
                color: msg.role === 'user' ? '#fff' : textPrimary,
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-msg" style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <GlassRobotAvatar size={24} isDark={isDark} />
              <div style={{ background: aiBubbleBg, border: `1px solid ${aiBubbleBorder}`, borderRadius: '4px 16px 16px 16px', padding: '8px 12px' }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 16px 20px',
          borderTop: `1px solid ${dividerColor}`,
          background: inputBg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          flexShrink: 0,
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Frag mich etwas zur Energie..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontFamily: font, fontSize: '14px', color: textPrimary,
              caretColor: '#E87020',
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Nachricht senden"
            style={{
              background: 'none', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
              opacity: input.trim() && !loading ? 1 : 0.35,
              transition: 'opacity 0.2s, transform 0.15s',
              transform: 'translateY(0)',
              padding: '2px',
            }}
            onMouseEnter={(e) => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <GlassRobotAvatar size={32} isDark={isDark} />
          </button>
        </div>
      </aside>
    </>
  );
}
