'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from '@/app/components/ThemeToggle';
import { clearAll } from '@/lib/storage';

const NAV = [
  { href: '/dashboard',    label: 'Übersicht',   icon: '⊞' },
  { href: '/massnahmen',   label: 'Maßnahmen',   icon: '⚡' },
  { href: '/foerderungen', label: 'Förderungen', icon: '💰' },
  { href: '/chat',         label: 'KI-Berater',  icon: '💬' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleReset() {
    await clearAll();
    router.push('/onboarding');
  }

  return (
    <aside style={{
      position: 'fixed',
      top: 0, left: 0, bottom: 0,
      width: '220px',
      background: 'var(--card-bg)',
      borderRight: '1px solid var(--card-border)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--card-border)' }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-syne-var)',
          fontWeight: 600,
          letterSpacing: '0.22em',
          fontSize: '12px',
          color: 'var(--text)',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          KENERGY<span style={{ color: '#de6818' }}>·</span>
        </Link>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, paddingTop: '12px' }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 20px',
              textDecoration: 'none',
              color: active ? 'var(--text)' : 'var(--muted)',
              background: active ? 'rgba(222,104,24,0.08)' : 'transparent',
              borderLeft: `2px solid ${active ? '#de6818' : 'transparent'}`,
              fontFamily: 'var(--font-syne-var)',
              fontSize: '12px',
              letterSpacing: '0.06em',
              transition: 'color 0.2s, background 0.2s',
            }}>
              <span style={{ width: '18px', textAlign: 'center', fontSize: '15px' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + reset */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <ThemeToggle />
        <button onClick={handleReset} style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          fontFamily: 'var(--font-syne-var)',
          fontSize: '10px',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          textAlign: 'left',
          padding: 0,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
        >
          Profil zurücksetzen
        </button>
      </div>
    </aside>
  );
}
