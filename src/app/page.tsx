'use client';

import { useEffect, useState } from 'react';
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

interface LiveStats {
  analysesCount: number;
  totalErsparnis: number;
  totalCo2Kg: number;
}

const steps = [
  {
    num: '1',
    title: 'Gebäude erfassen',
    desc: 'Gib PLZ, Baujahr und Gebäudetyp ein. Unsere KI gleicht dein Haus mit über 5.000 TABULA-Archetypen ab.',
    label: 'Eingabe',
  },
  {
    num: '2',
    title: 'KI analysiert',
    desc: 'In Sekunden berechnet die KI deinen Energieverbrauch, Einsparpotenziale und passende Maßnahmen.',
    label: 'Analyse',
  },
  {
    num: '3',
    title: 'Sparplan erhalten',
    desc: 'Du bekommst einen priorisierten, personalisierten Maßnahmenplan – kostenlos und sofort.',
    label: 'Ergebnis',
  },
];

const partners = [
  'Launch Rhein-Main',
  'TABULA',
  'dena',
  'KfW',
  'BAFA',
];

export default function LandingPage() {
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setLiveStats).catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* SVG Filter */}
      <svg className="svg-filters" aria-hidden="true">
        <defs>
          <filter id="glass-distort" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="3" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="3.5" result="blurred" />
            <feBlend in="blurred" in2="SourceGraphic" mode="normal" result="blend" />
            <feComponentTransfer in="blend">
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* ── Navigation ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 64px' }}>
        <span style={{ fontFamily: 'var(--font-inter-var)', fontWeight: 600, letterSpacing: '0.22em', fontSize: '12px', color: 'var(--text)', textTransform: 'uppercase' }}>
          KENERGY<span style={{ color: '#de6818' }}>·</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <Link href="/onboarding" className="btn-glass" style={{ padding: '11px 26px', fontSize: '10px', letterSpacing: '0.16em' }}>
            Analyse starten
          </Link>
        </div>
      </nav>

      {/* ── Hero (light + background only here) ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 32px 80px', textAlign: 'center' }}>

        {/* Hero Background Image – contained in hero */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div
            className="hero-bg-img"
            style={{
              position: 'absolute',
              inset: '-8%',
              backgroundImage: 'url(/hero-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              filter: 'url(#glass-distort) saturate(0.5) contrast(1.15)',
              mixBlendMode: 'luminosity',
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 55%, rgba(255,255,255,0.015) 100%)',
          }} />
        </div>

        {/* Dark mode orbs – contained in hero */}
        <div className="orb-layer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute',
            width: '1060px', height: '1060px',
            left: 'calc(50% - 530px)', top: 'calc(50% - 530px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #c04400 0%, transparent 68%)',
            opacity: 0.55,
            willChange: 'transform',
            animation: 'ambientDrift1 4s ease-in-out infinite',
            animationDelay: '-1s',
          }} />
          <div style={{
            position: 'absolute',
            width: '680px', height: '680px',
            left: 'calc(50% - 340px)', top: 'calc(50% - 340px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e06818 0%, transparent 68%)',
            opacity: 0.38,
            filter: 'blur(20px)',
            willChange: 'transform',
            animation: 'ambientDrift2 5s ease-in-out infinite',
            animationDelay: '-2s',
          }} />
          <div style={{
            position: 'absolute',
            width: '380px', height: '380px',
            left: 'calc(50% - 190px)', top: 'calc(50% - 190px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f5b424 0%, transparent 68%)',
            opacity: 0.28,
            filter: 'blur(10px)',
            willChange: 'transform',
            animation: 'ambientDrift3 3s ease-in-out infinite',
            animationDelay: '-1s',
          }} />
        </div>

        {/* Light mode orbs – contained in hero */}
        <div className="orb-layer-light" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute',
            width: '1060px', height: '1060px',
            left: 'calc(50% - 530px)', top: 'calc(50% - 530px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,105,25,0.58) 0%, rgba(255,105,25,0) 68%)',
            willChange: 'transform',
            animation: 'ambientDrift1 5s ease-in-out infinite',
            animationDelay: '-1s',
          }} />
          <div style={{
            position: 'absolute',
            width: '480px', height: '480px',
            left: 'calc(50% - 240px)', top: 'calc(50% - 240px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,158,55,0.38) 0%, rgba(255,158,55,0) 68%)',
            willChange: 'transform',
            animation: 'ambientDrift4 4s ease-in-out infinite',
            animationDelay: '-1s',
          }} />
        </div>

        {/* Hero Content */}
        <div className="fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '760px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-inter-var)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
            <span style={{ display: 'block', width: '36px', height: '1px', background: 'var(--muted)' }} />
            KI-Energieberatung für deutsche Haushalte
            <span style={{ display: 'block', width: '36px', height: '1px', background: 'var(--muted)' }} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-inter-var)', fontSize: 'clamp(60px, 8vw, 108px)', fontWeight: 300, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: '24px', color: 'var(--text)' }}>
            The<br />Modern<br /><i style={{ color: 'var(--muted)' }}>Energy</i><br />Advisor
          </h1>

          <div style={{ width: '72px', height: '1px', background: 'var(--divider)', margin: '0 auto 16px' }} />

          <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '16px', lineHeight: 1.7, color: 'var(--muted)', maxWidth: '440px', margin: '0 auto 40px' }}>
            Erfahre in 5 Minuten, wie du bis zu mehrere hundert Euro im Jahr sparen kannst – individuell analysiert von unserer KI.
          </p>

          <Link href="/onboarding" style={{ display: 'inline-flex', alignItems: 'center', gap: '18px', color: 'var(--text)', textDecoration: 'none', fontFamily: 'var(--font-inter-var)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            <div style={{
              width: '54px', height: '54px',
              border: '1px solid var(--divider)',
              borderRadius: '50%',
              background: 'var(--card-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px',
              transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s, transform 0.35s ease',
            }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'rgba(240,172,36,0.12)';
                el.style.borderColor = 'rgba(240,172,36,0.45)';
                el.style.boxShadow = '0 0 36px rgba(220,100,24,0.22)';
                el.style.transform = 'scale(1.22)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = 'var(--card-bg)';
                el.style.borderColor = 'var(--divider)';
                el.style.boxShadow = 'none';
                el.style.transform = 'scale(1)';
              }}
            >→</div>
            Analyse beginnen
          </Link>
        </div>

      </section>

      {/* ── Partner / Referenzen ── */}
      <section className="fade-in" style={{ borderTop: '1px solid var(--divider)', padding: '52px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}>
          {partners.map((p) => (
            <span key={p} className="section-overline" style={{ color: 'var(--subtle)' }}>
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* ── So funktioniert es (3 Schritte) ── */}
      <section style={{ borderTop: '1px solid var(--divider)', padding: '120px 64px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--divider)', paddingBottom: '22px', marginBottom: '80px' }}>
          <h2 className="fade-in" style={{ fontFamily: 'var(--font-inter-var)', fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            So funktioniert es
          </h2>
          <span className="section-overline">01</span>
        </div>

        {/* Vertical Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Center vertical line */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--divider)', transform: 'translateX(-50%)' }} />

          {steps.map((s, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={s.num} className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '32px', position: 'relative', transitionDelay: `${i * 0.14}s` }}>
                {/* Dot on center line */}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--divider)', zIndex: 2 }} />

                {isLeft ? (
                  <>
                    <div style={{ paddingRight: '48px' }}>
                      <div
                        style={{
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: '20px',
                          padding: '40px 36px',
                          transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'scale(1.04)';
                          el.style.boxShadow = '0 0 40px rgba(220,100,24,0.22), 0 12px 40px rgba(0,0,0,0.1)';
                          el.style.borderColor = 'rgba(240,172,36,0.45)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'scale(1)';
                          el.style.boxShadow = 'none';
                          el.style.borderColor = 'var(--card-border)';
                        }}
                      >
                        <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '13px', fontWeight: 500, color: '#de6818', marginBottom: '14px', letterSpacing: '0.02em' }}>
                          {s.num} – {s.label}
                        </p>
                        <h3 style={{ fontFamily: 'var(--font-inter-var)', fontSize: '36px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px', color: 'var(--text)' }}>{s.title}</h3>
                        <p className="section-body">{s.desc}</p>
                      </div>
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div style={{ paddingLeft: '48px' }}>
                      <div
                        style={{
                          background: 'var(--card-bg)',
                          border: '1px solid var(--card-border)',
                          borderRadius: '20px',
                          padding: '40px 36px',
                          transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
                          cursor: 'default',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'scale(1.04)';
                          el.style.boxShadow = '0 0 40px rgba(220,100,24,0.22), 0 12px 40px rgba(0,0,0,0.1)';
                          el.style.borderColor = 'rgba(240,172,36,0.45)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = 'scale(1)';
                          el.style.boxShadow = 'none';
                          el.style.borderColor = 'var(--card-border)';
                        }}
                      >
                        <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '13px', fontWeight: 500, color: '#de6818', marginBottom: '14px', letterSpacing: '0.02em' }}>
                          {s.num} – {s.label}
                        </p>
                        <h3 style={{ fontFamily: 'var(--font-inter-var)', fontSize: '36px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px', color: 'var(--text)' }}>{s.title}</h3>
                        <p className="section-body">{s.desc}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Features / Leistungen ── */}
      <section style={{ borderTop: '1px solid var(--divider)', padding: '80px 64px 120px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--divider)', paddingBottom: '22px', marginBottom: '3px' }}>
          <h2 className="fade-in" style={{ fontFamily: 'var(--font-inter-var)', fontSize: '48px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text)' }}>
            Leistungen
          </h2>
          <span className="section-overline">02</span>
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
                transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transitionDelay = '0s';
                el.style.transform = 'scale(1.06)';
                el.style.boxShadow = '0 0 40px rgba(220,100,24,0.22), 0 12px 40px rgba(0,0,0,0.12)';
                el.style.borderColor = 'rgba(240,172,36,0.45)';
                el.style.zIndex = '2';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transitionDelay = '0s';
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--divider)';
                el.style.zIndex = '0';
              }}
            >
              <p style={{ fontFamily: 'var(--font-inter-var)', fontSize: '13px', fontWeight: 500, color: '#de6818', marginBottom: '14px', letterSpacing: '0.02em' }}>
                {f.icon}
              </p>
              <h3 style={{ fontFamily: 'var(--font-inter-var)', fontSize: '32px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '16px', color: 'var(--text)' }}>
                {f.title}
              </h3>
              <p className="section-body">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)' }}>
        {[
          { value: '6', sup: '', label: 'Schritte' },
          { value: '~5', sup: 'Min', label: 'Dauer' },
          { value: '0', sup: '€', label: 'Kosten' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '96px 48px', borderRight: i < 2 ? '1px solid var(--divider)' : 'none' }}>
            <div style={{ fontFamily: 'var(--font-inter-var)', fontSize: '82px', fontStyle: 'italic', fontWeight: 400, lineHeight: 1, color: 'var(--text)', marginBottom: '14px' }}>
              {s.value}{s.sup && <sup style={{ fontSize: '38px', fontStyle: 'normal', verticalAlign: 'super' }}>{s.sup}</sup>}
            </div>
            <div className="section-overline">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Live Stats ── */}
      {liveStats && liveStats.analysesCount > 0 && (
        <div className="fade-in" style={{ position: 'relative', zIndex: 1, padding: '48px 64px', borderTop: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <span style={{ color: '#4ade80', fontWeight: 600 }}>{liveStats.analysesCount}</span> Haushalte analysiert
          </span>
          <span style={{ color: 'var(--divider)', fontSize: '18px' }}>·</span>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <span style={{ color: '#de6818', fontWeight: 600 }}>{liveStats.totalErsparnis.toLocaleString('de-DE')} €</span> Sparpotenzial berechnet
          </span>
          <span style={{ color: 'var(--divider)', fontSize: '18px' }}>·</span>
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <span style={{ color: '#4ade80', fontWeight: 600 }}>{Math.round(liveStats.totalCo2Kg / 1000).toLocaleString('de-DE')} t</span> CO₂ identifiziert
          </span>
        </div>
      )}

      {/* ── Footer CTA ── */}
      <section className="fade-in" style={{ padding: '160px 32px', textAlign: 'center', borderTop: '1px solid var(--divider)' }}>
        <h2 style={{ fontFamily: 'var(--font-inter-var)', fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '52px', color: 'var(--text)' }}>
          Energie<br /><span style={{ fontWeight: 400 }}>verändert alles.</span>
        </h2>
        <Link href="/onboarding" className="btn-glass" style={{ fontSize: '11px', padding: '16px 48px', letterSpacing: '0.18em' }}>
          Kostenlose Analyse starten →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '36px 64px', borderTop: '1px solid var(--divider)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
