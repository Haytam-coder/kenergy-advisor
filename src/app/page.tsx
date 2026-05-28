'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './components/ThemeToggle';

const features = [
  {
    icon: '01',
    title: 'Gebäude-Analyse',
    desc: 'TABULA-Archetypen-Matching nach PLZ und Baujahr – präzise Einschätzung deines Gebäudezustands.',
  },
  {
    icon: '02',
    title: 'KI-Sparplan',
    desc: 'Personalisierter Energiesparplan – priorisiert nach deinem individuellen Sparpotenzial.',
  },
  {
    icon: '03',
    title: 'Rechnung-Scan',
    desc: 'Lade deine Stromrechnung hoch – KI erkennt automatisch deinen jährlichen Verbrauch in kWh.',
  },
];

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>

      {/* ── Orb Layer ── */}
      <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* o1 – sehr groß, dunkel-orange, oben rechts */}
        <div style={{
          position: 'absolute',
          width: '1060px', height: '1060px',
          right: '-240px', top: '-240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #c04400 0%, transparent 68%)',
          opacity: 0.55,
        }} />
        {/* o2 – groß, helles Orange */}
        <div style={{
          position: 'absolute',
          width: '680px', height: '680px',
          right: '40px', top: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #e06818 0%, transparent 68%)',
          opacity: 0.38,
          filter: 'blur(20px)',
        }} />
        {/* o3 – mittel, Gold, Kern */}
        <div style={{
          position: 'absolute',
          width: '380px', height: '380px',
          right: '220px', top: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #f5b424 0%, transparent 68%)',
          opacity: 0.28,
          filter: 'blur(10px)',
        }} />
      </div>

      {/* ── Light Mode Orbs (Daylight Glow) ── */}
      <div className="orb-layer-light" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Orb 1 – sehr groß, warmes Orange, oben rechts */}
        <div style={{
          position: 'absolute',
          width: '1060px', height: '1060px',
          right: '-240px', top: '-240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,105,25,0.58) 0%, rgba(255,105,25,0) 68%)',
          willChange: 'transform',
          animation: 'orbFloat1 16s ease-in-out infinite',
        }} />
        {/* Orb 2 – mittel, goldenes Orange, Kern */}
        <div style={{
          position: 'absolute',
          width: '480px', height: '480px',
          right: '60px', top: '80px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,158,55,0.38) 0%, rgba(255,158,55,0) 68%)',
          willChange: 'transform',
          animation: 'orbFloat3 12s ease-in-out infinite',
        }} />
      </div>

      {/* ── Navigation ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 64px' }}>
        <span style={{ fontFamily: 'var(--font-syne-var)', fontWeight: 600, letterSpacing: '0.22em', fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>
          KENERGY<span style={{ color: '#de6818' }}>·</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <Link href="/onboarding" className="btn-glass" style={{ padding: '11px 26px', fontSize: '10px', letterSpacing: '0.16em' }}>
            Analyse starten
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 32px 80px', textAlign: 'center' }}>
        <div className="fade-in" style={{ maxWidth: '760px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '40px' }}>
            <span style={{ display: 'block', width: '36px', height: '1px', background: 'var(--muted)' }} />
            KI-Energieberatung für deutsche Haushalte
            <span style={{ display: 'block', width: '36px', height: '1px', background: 'var(--muted)' }} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: 'clamp(72px, 10vw, 130px)', fontWeight: 300, lineHeight: 0.92, letterSpacing: '-0.025em', marginBottom: '52px', color: 'var(--text)' }}>
            The<br />Modern<br /><i style={{ color: 'var(--muted)' }}>Energy</i><br />Advisor
          </h1>

          <div style={{ width: '72px', height: '1px', background: 'var(--divider)', margin: '0 auto 28px' }} />

          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '14px', lineHeight: 1.85, color: 'var(--muted)', maxWidth: '420px', margin: '0 auto 56px' }}>
            Erfahre in 5 Minuten, wie du bis zu mehrere hundert Euro im Jahr sparen kannst – individuell analysiert von unserer KI.
          </p>

          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', color: 'var(--text)', textDecoration: 'none', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            <div style={{
              width: '54px', height: '54px',
              border: '1px solid var(--divider)',
              borderRadius: '50%',
              background: 'var(--card-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px',
              transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s',
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(240,172,36,0.12)';
                el.style.borderColor = 'rgba(240,172,36,0.45)';
                el.style.boxShadow = '0 0 36px rgba(220,100,24,0.22)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'var(--card-bg)';
                el.style.borderColor = 'var(--divider)';
                el.style.boxShadow = 'none';
              }}
            >→</div>
            Analyse beginnen
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
          <div style={{ width: '1px', height: '44px', background: 'var(--divider)' }} />
          Scrollen
        </div>
      </section>

      {/* ── Features / Services ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 64px 160px', borderTop: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--divider)', paddingBottom: '22px', marginBottom: '3px' }}>
          <h2 className="fade-in" style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '44px', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text)' }}>
            Leistungen
          </h2>
          <span style={{ fontSize: '9px', letterSpacing: '0.28em', color: 'var(--muted)' }}>02</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              className="fade-in"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--divider)',
                padding: '52px 42px',
                transitionDelay: `${i * 0.1}s`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '80px', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, color: 'var(--subtle)', marginBottom: '36px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '28px', fontWeight: 400, marginBottom: '16px', color: 'var(--text)' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', lineHeight: 1.85, color: 'var(--muted)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="fade-in" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)' }}>
        {[
          { value: '6', sup: '', label: 'Schritte' },
          { value: '~5', sup: 'Min', label: 'Dauer' },
          { value: '0', sup: '€', label: 'Kosten' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '96px 48px', borderRight: i < 2 ? '1px solid var(--divider)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: '82px', fontStyle: 'italic', fontWeight: 300, lineHeight: 1, color: 'var(--text)', marginBottom: '14px' }}>
              {s.value}{s.sup && <sup style={{ fontSize: '38px', fontStyle: 'normal', verticalAlign: 'super' }}>{s.sup}</sup>}
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer CTA ── */}
      <section className="fade-in" style={{ position: 'relative', zIndex: 1, padding: '160px 32px', textAlign: 'center', borderTop: '1px solid var(--divider)' }}>
        <h2 style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: 'clamp(54px, 6.5vw, 90px)', fontWeight: 300, fontStyle: 'italic', lineHeight: 0.95, letterSpacing: '-0.025em', marginBottom: '52px', color: 'var(--text)' }}>
          Energie <span style={{ fontStyle: 'normal', fontWeight: 400, display: 'block' }}>verändert alles.</span>
        </h2>
        <Link href="/onboarding" className="btn-glass" style={{ fontSize: '11px', padding: '16px 48px', letterSpacing: '0.18em' }}>
          Kostenlose Analyse starten →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '36px 64px', borderTop: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Kenergy Advisor
        </span>
        <span style={{ fontSize: '10px', color: 'var(--subtle)' }}>© 2026</span>
        <span style={{ fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.1em' }}>
          LAUNCH Rhein-Main Build Days
        </span>
      </footer>
    </div>
  );
}
