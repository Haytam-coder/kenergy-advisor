'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  }

  return (
    <button
      onClick={toggle}
      style={{
        background: 'none',
        border: '1px solid var(--divider)',
        borderRadius: '100px',
        padding: '8px 16px',
        color: 'var(--muted)',
        fontFamily: 'var(--font-syne-var)',
        fontSize: '10px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'border-color 0.3s, color 0.3s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(222,104,24,0.4)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--divider)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)';
      }}
    >
      {theme === 'dark' ? '☀ Hell' : '◗ Dunkel'}
    </button>
  );
}
