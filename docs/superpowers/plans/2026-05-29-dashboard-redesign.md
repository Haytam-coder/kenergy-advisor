# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Kenergy Advisor dashboard as a CRM-style multi-page app with a persistent left sidebar, KPI/progress-bar savings visualisation, and fully implemented Maßnahmen, Förderungen, and Chat pages.

**Architecture:** A shared `DashboardShell` component wraps all dashboard-area pages with a fixed 220px left sidebar and a scrollable main content area. Each page loads profile + analysis from Supabase via existing storage functions and redirects to `/onboarding` if no profile is found. All visuals are CSS-only — no chart library.

**Tech Stack:** Next.js App Router, React, TypeScript, Supabase (existing `@/lib/storage`), inline styles + CSS vars (existing design system: `var(--font-syne-var)`, `var(--font-cormorant-var)`, `#de6818` orange, `#4ade80` green)

---

## File Map

**New files:**
- `src/app/components/Sidebar.tsx` — Fixed left nav with active-state routing
- `src/app/components/DashboardShell.tsx` — Shell: sidebar + scrollable main area
- `src/app/components/KpiTile.tsx` — Reusable metric card (big number + label)
- `src/app/components/ProgressCard.tsx` — Before/after progress bar card
- `src/app/dashboard/components/TopMassnahmenCards.tsx` — 3 horizontal preview cards
- `src/app/massnahmen/page.tsx` — Maßnahmen list with filters
- `src/app/massnahmen/components/MassnahmenTable.tsx` — Filterable table
- `src/app/massnahmen/components/KategorieFilter.tsx` — Category tab strip
- `src/app/massnahmen/[id]/page.tsx` — Maßnahme detail
- `src/app/foerderungen/data.ts` — Static programme info by ID
- `src/app/foerderungen/page.tsx` — Förderungen overview
- `src/app/chat/page.tsx` — KI-Berater chat

**Modified files:**
- `src/app/dashboard/page.tsx` — Complete rewrite: new grid layout wrapped in DashboardShell

---

## Before you start

- [ ] **Read the Next.js guide for this version**

  ```bash
  ls node_modules/next/dist/docs/
  ```

  Skim any file about App Router routing and layouts — this version may differ from standard Next.js docs.

---

## Task 1: Sidebar component

**Files:**
- Create: `src/app/components/Sidebar.tsx`

- [ ] **Step 1: Create the Sidebar**

  ```tsx
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
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors on the new file.

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/components/Sidebar.tsx
  git commit -m "feat: add Sidebar component with active nav state"
  ```

---

## Task 2: DashboardShell component

**Files:**
- Create: `src/app/components/DashboardShell.tsx`

- [ ] **Step 1: Create DashboardShell**

  ```tsx
  import Sidebar from './Sidebar';

  interface Props {
    children: React.ReactNode;
  }

  export default function DashboardShell({ children }: Props) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
        {/* Fixed orb decorations (same as existing dashboard) */}
        <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.45 }} />
          <div style={{ position: 'absolute', width: '600px', height: '600px', right: '20px', top: '20px', borderRadius: '50%', background: 'radial-gradient(circle, #e06818 0%, transparent 68%)', opacity: 0.28, filter: 'blur(20px)' }} />
          <div style={{ position: 'absolute', width: '340px', height: '340px', left: '-60px', bottom: '120px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.18, filter: 'blur(28px)' }} />
        </div>
        <div className="orb-layer-light" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,105,25,0.5) 0%, rgba(255,105,25,0) 68%)', animation: 'orbFloat1 16s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '420px', height: '420px', right: '40px', top: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,158,55,0.32) 0%, rgba(255,158,55,0) 68%)', animation: 'orbFloat3 12s ease-in-out infinite' }} />
        </div>

        <Sidebar />

        {/* Main content — offset by sidebar width */}
        <main style={{
          flex: 1,
          marginLeft: '220px',
          position: 'relative',
          zIndex: 10,
          overflowX: 'hidden',
        }}>
          {children}
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/components/DashboardShell.tsx
  git commit -m "feat: add DashboardShell layout wrapper with sidebar"
  ```

---

## Task 3: KpiTile and ProgressCard components

**Files:**
- Create: `src/app/components/KpiTile.tsx`
- Create: `src/app/components/ProgressCard.tsx`

- [ ] **Step 1: Create KpiTile**

  ```tsx
  interface Props {
    label: string;
    value: string;
    subtext?: string;
    accent?: string; // CSS color, defaults to var(--text)
  }

  export default function KpiTile({ label, value, subtext, accent = 'var(--text)' }: Props) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}>
        <p style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--label-color)',
          marginBottom: '10px',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-cormorant-var)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: '36px',
          lineHeight: 1,
          color: accent,
          marginBottom: subtext ? '4px' : 0,
        }}>
          {value}
        </p>
        {subtext && (
          <p style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '11px',
            color: 'var(--muted)',
          }}>
            {subtext}
          </p>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Create ProgressCard**

  ```tsx
  interface Props {
    label: string;
    currentLabel: string;  // e.g. "1.800 €"
    optimisedLabel: string; // e.g. "560 €"
    percent: number;        // 0–100, width of the filled bar
    accent?: string;        // bar color, defaults to #de6818
  }

  export default function ProgressCard({ label, currentLabel, optimisedLabel, percent, accent = '#de6818' }: Props) {
    const capped = Math.min(100, Math.max(0, percent));
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}>
        <p style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--label-color)',
          marginBottom: '14px',
        }}>
          {label}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
            Aktuell: <strong style={{ color: 'var(--text)' }}>{currentLabel}</strong>
          </span>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
            Optimiert: <strong style={{ color: accent }}>{optimisedLabel}</strong>
          </span>
        </div>

        {/* Track */}
        <div style={{
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '4px',
          height: '8px',
          overflow: 'hidden',
        }}>
          <div style={{
            background: accent,
            width: `${capped}%`,
            height: '100%',
            borderRadius: '4px',
            transition: 'width 0.6s ease',
          }} />
        </div>

        <p style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '11px',
          color: accent,
          marginTop: '6px',
          textAlign: 'right',
        }}>
          {capped}% Ersparnis
        </p>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/components/KpiTile.tsx src/app/components/ProgressCard.tsx
  git commit -m "feat: add KpiTile and ProgressCard shared components"
  ```

---

## Task 4: Shared Maßnahmen constants

**Files:**
- Create: `src/app/massnahmen/constants.ts`

- [ ] **Step 1: Create constants.ts**

  ```ts
  export const KATEGORIE_ICON: Record<string, string> = {
    heizung: '🔥', daemmung: '🏠', solar: '☀️',
    geraete: '💡', verhalten: '🌿', tarif: '💸', foerderung: '💰',
  };

  export const KATEGORIE_LABEL: Record<string, string> = {
    heizung: 'Heizung', daemmung: 'Dämmung', solar: 'Solar',
    geraete: 'Geräte', verhalten: 'Verhalten', tarif: 'Tarif', foerderung: 'Förderung',
  };
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/app/massnahmen/constants.ts
  git commit -m "feat: add shared Maßnahmen category constants"
  ```

---

## Task 5: TopMassnahmenCards component

**Files:**
- Create: `src/app/dashboard/components/TopMassnahmenCards.tsx`

- [ ] **Step 1: Create TopMassnahmenCards**

  ```tsx
  import Link from 'next/link';
  import { Massnahme } from '@/lib/types';
  import { KATEGORIE_ICON, KATEGORIE_LABEL } from '@/app/massnahmen/constants';

  interface Props {
    massnahmen: Massnahme[];
  }

  export default function TopMassnahmenCards({ massnahmen }: Props) {
    const top3 = [...massnahmen]
      .sort((a, b) => a.prioritaet - b.prioritaet)
      .slice(0, 3);

    return (
      <div>
        <p style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '9px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--label-color)',
          marginBottom: '14px',
        }}>
          Top-Maßnahmen
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {top3.map((m) => (
            <Link key={m.id} href={`/massnahmen/${m.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '18px',
                height: '100%',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(222,104,24,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--card-border)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{KATEGORIE_ICON[m.kategorie] ?? '⚡'}</span>
                  {m.foerderungVerfuegbar && (
                    <span style={{
                      fontFamily: 'var(--font-syne-var)',
                      fontSize: '8px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#22c55e',
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.2)',
                      borderRadius: '100px',
                      padding: '2px 8px',
                    }}>
                      Förderung
                    </span>
                  )}
                </div>

                <p style={{
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '8px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: '4px',
                }}>
                  {KATEGORIE_LABEL[m.kategorie] ?? m.kategorie}
                </p>

                <p style={{
                  fontFamily: 'var(--font-cormorant-var)',
                  fontSize: '18px',
                  color: 'var(--text)',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                }}>
                  {m.titel}
                </p>

                <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '10px' }}>
                  <p style={{
                    fontFamily: 'var(--font-syne-var)',
                    fontSize: '9px',
                    color: 'var(--muted)',
                    marginBottom: '2px',
                  }}>
                    Ersparnis/Jahr
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-cormorant-var)',
                    fontSize: '22px',
                    color: '#de6818',
                  }}>
                    €{m.ersparnisjahr.toLocaleString('de-DE')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '12px', textAlign: 'right' }}>
          <Link href="/massnahmen" style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--muted)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--divider)',
            paddingBottom: '1px',
          }}>
            Alle Maßnahmen →
          </Link>
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/dashboard/components/TopMassnahmenCards.tsx
  git commit -m "feat: add TopMassnahmenCards horizontal preview component"
  ```

---

## Task 5: Redesign /dashboard page

**Files:**
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Replace dashboard/page.tsx with new layout**

  Replace the entire file with:

  ```tsx
  'use client';

  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { UserProfile, AnalyseResult, Massnahme } from '@/lib/types';
  import { loadProfile, loadAnalysis, saveAnalysis } from '@/lib/storage';
  import DashboardShell from '@/app/components/DashboardShell';
  import KpiTile from '@/app/components/KpiTile';
  import ProgressCard from '@/app/components/ProgressCard';
  import ProfilKarte from './components/ProfilKarte';
  import FoerderungsBadge from './components/FoerderungsBadge';
  import TopMassnahmenCards from './components/TopMassnahmenCards';

  export default function DashboardPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [analyse, setAnalyse] = useState<AnalyseResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function init() {
        const p = await loadProfile();
        if (!p) { router.push('/onboarding'); return; }
        setProfile(p);

        const cached = await loadAnalysis();
        const cacheValid = cached &&
          cached.jahresverbrauchKwh > 0 &&
          cached.maxErsparnisjahr > 0 &&
          Array.isArray(cached.massnahmen) &&
          cached.massnahmen.length > 0;

        if (cacheValid) { setAnalyse(cached!); setLoading(false); return; }

        try {
          const r = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          });
          if (!r.ok) throw new Error('API error');
          const data: AnalyseResult = await r.json();
          if (!data.jahresverbrauchKwh || !data.maxErsparnisjahr) throw new Error('Invalid response');
          await saveAnalysis(data);
          setAnalyse(data);
        } catch {
          const fb = buildFallback(p);
          await saveAnalysis(fb);
          setAnalyse(fb);
        } finally {
          setLoading(false);
        }
      }
      init();
    }, [router]);

    if (loading || !profile) {
      return (
        <DashboardShell>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: '36px', height: '36px', border: '2px solid rgba(222,104,24,0.25)', borderTop: '2px solid #de6818', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontFamily: 'var(--font-cormorant-var)', fontStyle: 'italic', fontWeight: 300, fontSize: '24px', color: 'var(--text)' }}>
              Dein Energieplan wird erstellt…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </DashboardShell>
      );
    }

    if (!analyse) return null;

    const jahreskosten = analyse.jahreskosten;
    const optimierteKosten = Math.max(0, jahreskosten - analyse.maxErsparnisjahr);
    const kostenPercent = jahreskosten > 0
      ? Math.round((analyse.maxErsparnisjahr / jahreskosten) * 100)
      : 0;

    const co2Aktuell = analyse.jahresverbrauchKwh * 0.18;
    const co2Optimiert = Math.max(0, co2Aktuell - analyse.co2ReduktionKgJahr);
    const co2Percent = co2Aktuell > 0
      ? Math.round((analyse.co2ReduktionKgJahr / co2Aktuell) * 100)
      : 0;

    const bestAmortisation = analyse.massnahmen.length > 0
      ? Math.min(...analyse.massnahmen.map(m => m.amortisationJahre))
      : 0;

    return (
      <DashboardShell>
        <div style={{ padding: '40px 40px 80px' }}>

          {/* Page header */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
              Dein Energieplan
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
              Bereit zum <em style={{ color: '#de6818' }}>Sparen.</em>
            </h1>
          </div>

          {/* Row 1: KPI tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <KpiTile
              label="Sparpotenzial"
              value={`€${analyse.maxErsparnisjahr.toLocaleString('de-DE')}`}
              subtext="pro Jahr"
              accent="#de6818"
            />
            <KpiTile
              label="CO₂-Reduktion"
              value={`${analyse.co2ReduktionKgJahr.toLocaleString('de-DE')} kg`}
              subtext="pro Jahr"
              accent="#4ade80"
            />
            <KpiTile
              label="Schnellste Amortisation"
              value={`${bestAmortisation} Jahre`}
              subtext="bis zur Rentabilität"
            />
          </div>

          {/* Row 2: Progress cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <ProgressCard
              label="Jahreskosten"
              currentLabel={`${jahreskosten.toLocaleString('de-DE')} €`}
              optimisedLabel={`${optimierteKosten.toLocaleString('de-DE')} €`}
              percent={kostenPercent}
              accent="#de6818"
            />
            <ProgressCard
              label="CO₂-Jahresausstoß"
              currentLabel={`${Math.round(co2Aktuell).toLocaleString('de-DE')} kg`}
              optimisedLabel={`${Math.round(co2Optimiert).toLocaleString('de-DE')} kg`}
              percent={co2Percent}
              accent="#4ade80"
            />
          </div>

          {/* Row 3: Profil + Förderungen */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginBottom: '16px' }}>
            <ProfilKarte profile={profile} analyse={analyse} />
            <FoerderungsBadge foerderungsIds={analyse.qualifiziertefoerderungen ?? []} />
          </div>

          {/* Row 4: Top 3 measures */}
          <TopMassnahmenCards massnahmen={analyse.massnahmen} />
        </div>
      </DashboardShell>
    );
  }

  // ---- fallback (unchanged from original) ----
  function buildFallback(p: UserProfile): AnalyseResult {
    const jahreskosten = (p.monatlicheKosten || 150) * 12;
    const heizBedarf = (p.heizenergiebedarfKwh || 150) * (p.wohnflaeche || 80);
    const jahresverbrauchKwh = p.stromverbrauchKwh ? p.stromverbrauchKwh + heizBedarf : heizBedarf;
    const maxErsparnis = Math.round(jahreskosten * 0.28);
    const co2 = Math.round(jahresverbrauchKwh * 0.18);
    const isEigentuemer = p.userType === 'eigentuemer';
    const isHaus = p.propertyType === 'haus';

    const massnahmen: Massnahme[] = isEigentuemer
      ? [
          { id: 'heizung-abgleich', titel: 'Hydraulischer Abgleich', beschreibung: 'Optimiert die Wärmeverteilung und senkt den Heizenergieverbrauch deutlich. Pflichtmaßnahme bei staatlicher Förderung.', kategorie: 'heizung', zielgruppe: ['eigentuemer_haus', 'eigentuemer_wohnung'], kostenschaetzung: { min: 300, max: 800 }, ersparnisjahr: 220, co2ReduktionKg: 450, amortisationJahre: 2, foerderungVerfuegbar: true, prioritaet: 1, kenergy_referral: false },
          { id: 'kellerdecke', titel: 'Kellerdeckendämmung', beschreibung: 'Günstige Maßnahme mit hohem Effekt. Reduziert Wärmeverluste nach unten und amortisiert sich in wenigen Jahren.', kategorie: 'daemmung', zielgruppe: ['eigentuemer_haus'], kostenschaetzung: { min: 400, max: 1200 }, ersparnisjahr: 150, co2ReduktionKg: 300, amortisationJahre: 4, foerderungVerfuegbar: true, prioritaet: 2, kenergy_referral: false },
          ...(isHaus ? [{ id: 'solar-pv', titel: 'Photovoltaik-Anlage', beschreibung: 'Eine eigene Solar-Anlage macht dich weitgehend unabhängig. Mit aktuellem Einspeisetarif und Eigenverbrauch sehr rentabel.', kategorie: 'solar' as const, zielgruppe: ['eigentuemer_haus' as const], kostenschaetzung: { min: 8000, max: 18000 }, ersparnisjahr: 900, co2ReduktionKg: 1800, amortisationJahre: 10, foerderungVerfuegbar: true, prioritaet: 3, kenergy_referral: true }] : []),
          { id: 'stromanbieter', titel: 'Stromanbieter wechseln', beschreibung: 'Ein Wechsel zu einem günstigeren Ökostromanbieter spart sofort und ohne Investition. Viele Anbieter zahlen Wechselboni.', kategorie: 'tarif', zielgruppe: ['eigentuemer_haus', 'eigentuemer_wohnung'], kostenschaetzung: { min: 0, max: 0 }, ersparnisjahr: 180, co2ReduktionKg: 200, amortisationJahre: 0, foerderungVerfuegbar: false, prioritaet: 4, kenergy_referral: false },
          { id: 'led', titel: 'LED-Beleuchtung komplett', beschreibung: 'LED-Leuchtmittel verbrauchen bis zu 80% weniger Strom. Die Investition rechnet sich innerhalb eines Jahres.', kategorie: 'geraete', zielgruppe: ['eigentuemer_haus', 'eigentuemer_wohnung'], kostenschaetzung: { min: 80, max: 250 }, ersparnisjahr: 90, co2ReduktionKg: 120, amortisationJahre: 1, foerderungVerfuegbar: false, prioritaet: 5, kenergy_referral: false },
        ]
      : [
          { id: 'stromanbieter', titel: 'Stromanbieter wechseln', beschreibung: 'Ein Wechsel zu einem günstigeren Ökostromanbieter spart sofort und ohne Investition. Viele Anbieter zahlen Wechselboni.', kategorie: 'tarif', zielgruppe: ['mieter_haus', 'mieter_wohnung'], kostenschaetzung: { min: 0, max: 0 }, ersparnisjahr: 180, co2ReduktionKg: 200, amortisationJahre: 0, foerderungVerfuegbar: false, prioritaet: 1, kenergy_referral: false },
          { id: 'heizverhalten', titel: 'Heizverhalten optimieren', beschreibung: 'Nachtabsenkung und Abwesenheitssteuerung senken den Heizenergieverbrauch um 10–15%. Ein programmierbares Thermostat hilft dabei.', kategorie: 'verhalten', zielgruppe: ['mieter_haus', 'mieter_wohnung'], kostenschaetzung: { min: 30, max: 80 }, ersparnisjahr: 120, co2ReduktionKg: 250, amortisationJahre: 1, foerderungVerfuegbar: false, prioritaet: 2, kenergy_referral: false },
          { id: 'led', titel: 'LED-Beleuchtung komplett', beschreibung: 'LED-Leuchtmittel verbrauchen bis zu 80% weniger Strom. Die Investition rechnet sich innerhalb eines Jahres.', kategorie: 'geraete', zielgruppe: ['mieter_haus', 'mieter_wohnung'], kostenschaetzung: { min: 80, max: 250 }, ersparnisjahr: 90, co2ReduktionKg: 120, amortisationJahre: 1, foerderungVerfuegbar: false, prioritaet: 3, kenergy_referral: false },
          { id: 'stosslüften', titel: 'Stoßlüften statt Kipplüften', beschreibung: 'Kurzes, kräftiges Lüften spart gegenüber stundenlangem Kippen bis zu 200 € Heizkosten pro Jahr – komplett kostenlos.', kategorie: 'verhalten', zielgruppe: ['mieter_haus', 'mieter_wohnung'], kostenschaetzung: { min: 0, max: 0 }, ersparnisjahr: 80, co2ReduktionKg: 160, amortisationJahre: 0, foerderungVerfuegbar: false, prioritaet: 4, kenergy_referral: false },
          { id: 'standby', titel: 'Standby-Verbrauch eliminieren', beschreibung: 'Schaltbare Steckdosenleisten senken den Standby-Verbrauch von Unterhaltungselektronik und Haushaltsgeräten deutlich.', kategorie: 'geraete', zielgruppe: ['mieter_haus', 'mieter_wohnung'], kostenschaetzung: { min: 20, max: 60 }, ersparnisjahr: 60, co2ReduktionKg: 80, amortisationJahre: 1, foerderungVerfuegbar: false, prioritaet: 5, kenergy_referral: false },
        ];

    return {
      jahresverbrauchKwh: Math.round(jahresverbrauchKwh),
      jahreskosten,
      maxErsparnisjahr: maxErsparnis,
      co2ReduktionKgJahr: co2,
      co2Aequivalent: `${Math.round(co2 / 200)} Autofahrten Frankfurt–Berlin`,
      massnahmen,
      qualifiziertefoerderungen: isEigentuemer
        ? ['kfw-261', 'bafa-beg', 'stromanbieter-wechsel']
        : ['stromanbieter-wechsel'],
      kurzfazit: 'Mit den richtigen Maßnahmen kannst du erheblich Energie und Kosten sparen.',
    };
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Run dev server and check /dashboard in browser**

  ```bash
  npm run dev
  ```

  Open http://localhost:3000/dashboard. Verify:
  - Sidebar visible on the left
  - 3 KPI tiles in a row
  - 2 progress bar cards
  - Profil + Förderungs row
  - 3 horizontal Maßnahmen cards

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/dashboard/page.tsx
  git commit -m "feat: redesign dashboard with sidebar shell, KPI tiles, and progress cards"
  ```

---

## Task 6: KategorieFilter component

**Files:**
- Create: `src/app/massnahmen/components/KategorieFilter.tsx`

- [ ] **Step 1: Create KategorieFilter**

  ```tsx
  'use client';

  export type KategorieOption = 'alle' | 'heizung' | 'daemmung' | 'solar' | 'geraete' | 'verhalten' | 'tarif' | 'foerderung';

  const TABS: { value: KategorieOption; label: string }[] = [
    { value: 'alle',      label: 'Alle' },
    { value: 'heizung',   label: 'Heizung' },
    { value: 'daemmung',  label: 'Dämmung' },
    { value: 'solar',     label: 'Solar' },
    { value: 'geraete',   label: 'Geräte' },
    { value: 'verhalten', label: 'Verhalten' },
    { value: 'tarif',     label: 'Tarif' },
    { value: 'foerderung','label': 'Förderung' },
  ];

  interface Props {
    active: KategorieOption;
    onChange: (v: KategorieOption) => void;
  }

  export default function KategorieFilter({ active, onChange }: Props) {
    return (
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {TABS.map(({ value, label }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              onClick={() => onChange(value)}
              style={{
                fontFamily: 'var(--font-syne-var)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                borderRadius: '100px',
                border: isActive ? '1px solid rgba(222,104,24,0.5)' : '1px solid var(--divider)',
                background: isActive ? 'rgba(222,104,24,0.1)' : 'transparent',
                color: isActive ? '#de6818' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/massnahmen/components/KategorieFilter.tsx
  git commit -m "feat: add KategorieFilter tab component"
  ```

---

## Task 7: MassnahmenTable component

**Files:**
- Create: `src/app/massnahmen/components/MassnahmenTable.tsx`

- [ ] **Step 1: Create MassnahmenTable**

  ```tsx
  'use client';

  import { useRouter } from 'next/navigation';
  import { Massnahme } from '@/lib/types';
  import { BudgetOption } from '@/app/dashboard/components/BudgetFilter';
  import { KategorieOption } from './KategorieFilter';
  import { KATEGORIE_ICON, KATEGORIE_LABEL } from '../constants';

  interface Props {
    massnahmen: Massnahme[];
    budget: BudgetOption;
    kategorie: KategorieOption;
  }

  function budgetMax(b: BudgetOption): number {
    if (b === 'alle') return Infinity;
    return parseInt(b, 10);
  }

  export default function MassnahmenTable({ massnahmen, budget, kategorie }: Props) {
    const router = useRouter();
    const max = budgetMax(budget);

    const filtered = massnahmen
      .filter(m => (m.kostenschaetzung?.min ?? 0) <= max)
      .filter(m => kategorie === 'alle' || m.kategorie === kategorie)
      .sort((a, b) => a.prioritaet - b.prioritaet);

    if (filtered.length === 0) {
      return (
        <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', padding: '32px 0', textAlign: 'center' }}>
          Keine Maßnahmen für diese Filter.
        </p>
      );
    }

    const col: React.CSSProperties = {
      fontFamily: 'var(--font-syne-var)',
      fontSize: '9px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'var(--label-color)',
      padding: '0 16px 12px',
      textAlign: 'left',
      fontWeight: 400,
    };

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--divider)' }}>
            <th style={{ ...col, paddingLeft: 0, width: '40%' }}>Maßnahme</th>
            <th style={col}>Kosten</th>
            <th style={col}>Ersparnis/Jahr</th>
            <th style={col}>Amortisation</th>
            <th style={col}>Förderung</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr
              key={m.id}
              onClick={() => router.push(`/massnahmen/${m.id}`)}
              style={{ borderBottom: '1px solid var(--divider)', cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Title + category */}
              <td style={{ padding: '14px 16px 14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{KATEGORIE_ICON[m.kategorie] ?? '⚡'}</span>
                  <div>
                    <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--text)', marginBottom: '2px' }}>
                      {m.titel}
                    </p>
                    <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '10px', color: 'var(--muted)' }}>
                      {KATEGORIE_LABEL[m.kategorie] ?? m.kategorie}
                    </p>
                  </div>
                </div>
              </td>

              {/* Kosten */}
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                {m.kostenschaetzung.min === 0 && m.kostenschaetzung.max === 0
                  ? <span style={{ color: '#4ade80' }}>Kostenlos</span>
                  : `${m.kostenschaetzung.min.toLocaleString('de-DE')}–${m.kostenschaetzung.max.toLocaleString('de-DE')} €`
                }
              </td>

              {/* Ersparnis */}
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-cormorant-var)', fontSize: '18px', color: '#de6818', whiteSpace: 'nowrap' }}>
                €{m.ersparnisjahr.toLocaleString('de-DE')}
              </td>

              {/* Amortisation */}
              <td style={{ padding: '14px 16px', fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                {m.amortisationJahre === 0 ? '—' : `${m.amortisationJahre} Jahre`}
              </td>

              {/* Förderungs-Badge */}
              <td style={{ padding: '14px 16px' }}>
                {m.foerderungVerfuegbar ? (
                  <span style={{
                    fontFamily: 'var(--font-syne-var)',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#22c55e',
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '100px',
                    padding: '3px 10px',
                    whiteSpace: 'nowrap',
                  }}>
                    Möglich
                  </span>
                ) : (
                  <span style={{ color: 'var(--muted)', fontSize: '12px' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add src/app/massnahmen/components/MassnahmenTable.tsx
  git commit -m "feat: add MassnahmenTable with budget and category filtering"
  ```

---

## Task 8: Maßnahmen list page

**Files:**
- Create: `src/app/massnahmen/page.tsx`

- [ ] **Step 1: Create massnahmen/page.tsx**

  ```tsx
  'use client';

  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { UserProfile, AnalyseResult } from '@/lib/types';
  import { loadProfile, loadAnalysis } from '@/lib/storage';
  import DashboardShell from '@/app/components/DashboardShell';
  import BudgetFilter, { BudgetOption } from '@/app/dashboard/components/BudgetFilter';
  import KategorieFilter, { KategorieOption } from './components/KategorieFilter';
  import MassnahmenTable from './components/MassnahmenTable';

  export default function MassnahmenPage() {
    const router = useRouter();
    const [analyse, setAnalyse] = useState<AnalyseResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState<BudgetOption>('alle');
    const [kategorie, setKategorie] = useState<KategorieOption>('alle');

    useEffect(() => {
      async function init() {
        const p = await loadProfile();
        if (!p) { router.push('/onboarding'); return; }
        const a = await loadAnalysis();
        if (!a) { router.push('/dashboard'); return; }
        setAnalyse(a);
        setLoading(false);
      }
      init();
    }, [router]);

    if (loading || !analyse) {
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
        <div style={{ padding: '40px 40px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
              Dein Aktionsplan
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
              Alle <em style={{ color: '#de6818' }}>Maßnahmen.</em>
            </h1>
          </div>

          {/* Filters */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            <KategorieFilter active={kategorie} onChange={setKategorie} />
            <BudgetFilter active={budget} onChange={setBudget} />
          </div>

          {/* Table */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '8px 24px 8px',
            overflowX: 'auto',
          }}>
            <MassnahmenTable
              massnahmen={analyse.massnahmen}
              budget={budget}
              kategorie={kategorie}
            />
          </div>
        </div>
      </DashboardShell>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Check /massnahmen in browser**

  Navigate to http://localhost:3000/massnahmen. Verify:
  - Sidebar active item is "Maßnahmen"
  - Category tabs and budget filter visible
  - Table shows all measures, each row clickable
  - Clicking a row navigates to `/massnahmen/[id]` (404 expected until Task 9)

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/massnahmen/page.tsx
  git commit -m "feat: add Maßnahmen list page with table and filters"
  ```

---

## Task 9: Maßnahme detail page

**Files:**
- Create: `src/app/massnahmen/[id]/page.tsx`

- [ ] **Step 1: Create massnahmen/[id]/page.tsx**

  ```tsx
  'use client';

  import { useEffect, useState } from 'react';
  import { useRouter, useParams } from 'next/navigation';
  import Link from 'next/link';
  import { AnalyseResult, Massnahme } from '@/lib/types';
  import { loadProfile, loadAnalysis } from '@/lib/storage';
  import DashboardShell from '@/app/components/DashboardShell';
  import KpiTile from '@/app/components/KpiTile';
  import { KATEGORIE_ICON } from '@/app/massnahmen/constants';

  export default function MassnahmeDetailPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [massnahme, setMassnahme] = useState<Massnahme | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function init() {
        const p = await loadProfile();
        if (!p) { router.push('/onboarding'); return; }
        const a: AnalyseResult | null = await loadAnalysis();
        if (!a) { router.push('/massnahmen'); return; }
        const found = a.massnahmen.find(m => m.id === id) ?? null;
        setMassnahme(found);
        setLoading(false);
      }
      init();
    }, [router, id]);

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

    if (!massnahme) {
      return (
        <DashboardShell>
          <div style={{ padding: '40px' }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', color: 'var(--muted)' }}>Maßnahme nicht gefunden.</p>
            <Link href="/massnahmen" style={{ color: '#de6818', fontFamily: 'var(--font-syne-var)', fontSize: '12px' }}>← Zurück</Link>
          </div>
        </DashboardShell>
      );
    }

    const autofahrten = Math.round(massnahme.co2ReduktionKg / 200);
    const kostenText = massnahme.kostenschaetzung.min === 0 && massnahme.kostenschaetzung.max === 0
      ? 'Kostenlos'
      : `${massnahme.kostenschaetzung.min.toLocaleString('de-DE')}–${massnahme.kostenschaetzung.max.toLocaleString('de-DE')} €`;

    return (
      <DashboardShell>
        <div style={{ padding: '40px 40px 80px', maxWidth: '800px' }}>

          {/* Back link */}
          <Link href="/massnahmen" style={{
            fontFamily: 'var(--font-syne-var)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--muted)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '28px',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Alle Maßnahmen
          </Link>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
            <span style={{ fontSize: '36px', flexShrink: 0 }}>{KATEGORIE_ICON[massnahme.kategorie] ?? '⚡'}</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '36px', lineHeight: 1.1, color: 'var(--text)', marginBottom: '8px' }}>
                {massnahme.titel}
              </h1>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                {massnahme.beschreibung}
              </p>
            </div>
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            <KpiTile label="Investition" value={kostenText} />
            <KpiTile label="Ersparnis/Jahr" value={`€${massnahme.ersparnisjahr.toLocaleString('de-DE')}`} accent="#de6818" />
            <KpiTile
              label="Amortisation"
              value={massnahme.amortisationJahre === 0 ? 'Sofort' : `${massnahme.amortisationJahre} Jahre`}
            />
          </div>

          {/* CO₂ card */}
          <div style={{
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <span style={{ fontSize: '28px' }}>🌿</span>
            <div>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.7)', marginBottom: '4px' }}>
                CO₂-Reduktion
              </p>
              <p style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '28px', color: '#4ade80', marginBottom: '4px' }}>
                {massnahme.co2ReduktionKg.toLocaleString('de-DE')} kg / Jahr
              </p>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
                = {autofahrten} Autofahrten Frankfurt–Berlin
              </p>
            </div>
          </div>

          {/* Förderungs info */}
          {massnahme.foerderungVerfuegbar && (
            <div style={{
              background: 'rgba(34,197,94,0.06)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: '16px',
              padding: '20px 24px',
              marginBottom: '16px',
            }}>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#22c55e', marginBottom: '6px' }}>
                Förderung verfügbar
              </p>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
                Für diese Maßnahme gibt es staatliche Förderungen (KfW / BAFA). Sieh dir die{' '}
                <Link href="/foerderungen" style={{ color: '#de6818', textDecoration: 'none' }}>Förderungen-Übersicht</Link>
                {' '}für Details an.
              </p>
            </div>
          )}

          {/* CTA */}
          {massnahme.kenergy_referral && (
            <a
              href="https://kenergy-solutions.de"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '16px',
                background: '#de6818',
                color: 'white',
                borderRadius: '14px',
                fontFamily: 'var(--font-syne-var)',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#b84200')}
              onMouseLeave={e => (e.currentTarget.style.background = '#de6818')}
            >
              Kostenloses Angebot von Kenergy →
            </a>
          )}
        </div>
      </DashboardShell>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Check detail page in browser**

  Click any row on `/massnahmen`. Verify:
  - Back link works
  - KPI tiles show correct values
  - CO₂ card visible
  - Förderungs card appears only when applicable
  - Kenergy CTA appears only when `kenergy_referral === true`

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/massnahmen/components/ src/app/massnahmen/
  git commit -m "feat: add Maßnahme detail page with KPIs, CO2, and CTA"
  ```

---

## Task 10: Förderungen data and page

**Files:**
- Create: `src/app/foerderungen/data.ts`
- Create: `src/app/foerderungen/page.tsx`

- [ ] **Step 1: Create foerderungen/data.ts**

  ```ts
  export interface FoerderProgramm {
    id: string;
    name: string;
    description: string;
    maxBetrag: string;
    link: string;
    badge: string; // short label for the badge
  }

  export const FOERDER_PROGRAMME: Record<string, FoerderProgramm> = {
    'kfw-261': {
      id: 'kfw-261',
      name: 'KfW-Kredit 261',
      description: 'Bundesförderung für Effiziente Gebäude (BEG). Zinsgünstiger Kredit für energetische Sanierung oder Neubau. Kombinierbar mit BAFA-Zuschüssen.',
      maxBetrag: 'bis zu 150.000 €',
      link: 'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilien/Finanzierungsangebote/Bundesf%C3%B6rderung-f%C3%BCr-effiziente-Geb%C3%A4ude-Kredit-(261)/',
      badge: 'KfW 261',
    },
    'bafa-beg': {
      id: 'bafa-beg',
      name: 'BAFA BEG Einzelmaßnahmen',
      description: 'Direkte Zuschüsse vom Bundesamt für Wirtschaft für Einzelmaßnahmen wie Heizungstausch, Dämmung oder Fenster. Kein Kredit — Geld zurück nach Einbau.',
      maxBetrag: '15–20 % der Investitionskosten',
      link: 'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/Bundesfoerderung_fuer_effiziente_Gebaeude/Einzelmassnahmen/einzelmassnahmen_node.html',
      badge: 'BAFA BEG',
    },
    'stromanbieter-wechsel': {
      id: 'stromanbieter-wechsel',
      name: 'Stromanbieter wechseln',
      description: 'Kein Förderprogramm, aber sofortige Ersparnis: Ein Wechsel zu einem günstigeren Ökostromanbieter spart 150–300 € pro Jahr — ohne Investition. Viele Anbieter zahlen Wechselboni.',
      maxBetrag: '150–300 € / Jahr',
      link: 'https://www.verivox.de/strom/',
      badge: 'Sofort',
    },
  };
  ```

- [ ] **Step 2: Create foerderungen/page.tsx**

  ```tsx
  'use client';

  import { useEffect, useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { loadProfile, loadAnalysis } from '@/lib/storage';
  import DashboardShell from '@/app/components/DashboardShell';
  import { FOERDER_PROGRAMME } from './data';

  export default function FoerderungenPage() {
    const router = useRouter();
    const [foerderungsIds, setFoerderungsIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function init() {
        const p = await loadProfile();
        if (!p) { router.push('/onboarding'); return; }
        const a = await loadAnalysis();
        setFoerderungsIds(a?.qualifiziertefoerderungen ?? []);
        setLoading(false);
      }
      init();
    }, [router]);

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

    const programmes = foerderungsIds
      .map(id => FOERDER_PROGRAMME[id])
      .filter(Boolean);

    return (
      <DashboardShell>
        <div style={{ padding: '40px 40px 80px', maxWidth: '800px' }}>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
              Finanzielle Unterstützung
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
              Deine <em style={{ color: '#de6818' }}>Förderungen.</em>
            </h1>
          </div>

          {programmes.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)' }}>
              Keine Förderungen für dein Profil gefunden.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {programmes.map(prog => (
                <div key={prog.id} style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '24px', fontWeight: 400, color: 'var(--text)' }}>
                      {prog.name}
                    </h2>
                    <span style={{
                      fontFamily: 'var(--font-syne-var)',
                      fontSize: '9px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: '#de6818',
                      background: 'rgba(222,104,24,0.1)',
                      border: '1px solid rgba(222,104,24,0.25)',
                      borderRadius: '100px',
                      padding: '4px 12px',
                      flexShrink: 0,
                      marginLeft: '12px',
                    }}>
                      {prog.badge}
                    </span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                    {prog.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '2px' }}>
                        Förderhöhe
                      </p>
                      <p style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '20px', color: '#4ade80' }}>
                        {prog.maxBetrag}
                      </p>
                    </div>
                    <a
                      href={prog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-syne-var)',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        color: 'var(--text)',
                        textDecoration: 'none',
                        border: '1px solid var(--divider)',
                        borderRadius: '100px',
                        padding: '10px 20px',
                        transition: 'border-color 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(222,104,24,0.4)'; e.currentTarget.style.color = '#de6818'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--divider)'; e.currentTarget.style.color = 'var(--text)'; }}
                    >
                      Mehr erfahren →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    );
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 4: Check /foerderungen in browser**

  Navigate to http://localhost:3000/foerderungen. Verify:
  - Sidebar active item is "Förderungen"
  - Cards show for the programmes in `analyse.qualifiziertefoerderungen`
  - Each card has name, description, funding amount, external link

- [ ] **Step 5: Commit**

  ```bash
  git add src/app/foerderungen/
  git commit -m "feat: add Förderungen page with programme cards"
  ```

---

## Task 11: Chat page

**Files:**
- Create: `src/app/chat/page.tsx`

- [ ] **Step 1: Create chat/page.tsx**

  ```tsx
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

          {/* Header */}
          <div style={{ marginBottom: '24px', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
              Dein persönlicher Energieberater
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
              KI-<em style={{ color: '#de6818' }}>Berater.</em>
            </h1>
          </div>

          {/* Messages */}
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

          {/* Input bar */}
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
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 3: Check /chat in browser**

  Navigate to http://localhost:3000/chat. Verify:
  - Sidebar active item is "KI-Berater"
  - Empty state shows 3 suggestion chips
  - Clicking a chip sends the message and shows a response
  - Input bar works with Enter key
  - Messages scroll to bottom automatically

- [ ] **Step 4: Commit**

  ```bash
  git add src/app/chat/
  git commit -m "feat: add KI-Berater chat page with suggestion chips and message history"
  ```

---

## Final verification

- [ ] **Check all pages in browser with fresh data**

  1. Go to http://localhost:3000/dashboard — sidebar shows, KPI tiles load
  2. Click "Maßnahmen" in sidebar — table shows, filters work, row click navigates to detail
  3. On a detail page — back link works, KPIs correct
  4. Click "Förderungen" in sidebar — programme cards show
  5. Click "KI-Berater" in sidebar — chat works, sends a message

- [ ] **Check TypeScript one final time**

  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors.

- [ ] **Final commit**

  ```bash
  git add -A
  git commit -m "feat: complete dashboard redesign — sidebar, all pages, charts"
  ```
