'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, AnalyseResult, Massnahme } from '@/lib/types';
import { loadProfile, loadAnalysis, saveAnalysis } from '@/lib/storage';
import DashboardShell from '@/app/components/DashboardShell';
import KpiTile from '@/app/components/KpiTile';
import ProgressCard from '@/app/components/ProgressCard';
import ProfilKarte from './components/ProfilKarte';
import FoerderungsBadge from './components/FoerderungsBadge';
import TopMassnahmenCards from './components/TopMassnahmenCards';
import LoadingSteps from '@/app/components/LoadingSteps';
import EnergieLabelWidget from '@/app/components/EnergieLabelWidget';

// ── Score Gauge ────────────────────────────────────────────────────────────

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  if (Math.abs(end - start) < 0.1) return '';
  const s = polarToXY(cx, cy, r, start);
  const e = polarToXY(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}
function scoreColor(s: number) {
  if (s >= 80) return '#22c55e'; if (s >= 65) return '#84cc16';
  if (s >= 50) return '#eab308'; if (s >= 35) return '#f59e0b';
  if (s >= 20) return '#f97316'; return '#ef4444';
}
function klasseFromScore(s: number) {
  if (s >= 90) return 'A+'; if (s >= 80) return 'A'; if (s >= 68) return 'B';
  if (s >= 55) return 'C'; if (s >= 40) return 'D'; if (s >= 28) return 'E';
  if (s >= 18) return 'F'; if (s >= 10) return 'G'; return 'H';
}
function energieeffizienzToScore(k: string) {
  const m: Record<string, number> = { 'A+': 92, A: 82, B: 70, C: 57, D: 43, E: 30, F: 20, G: 12, H: 5 };
  return m[k] ?? 38;
}

function ScoreGauge({ displayScore, arcProgress, size = 200 }: {
  displayScore: number; arcProgress: number; size?: number;
}) {
  const cx = 100, cy = 100, r = 78, G_START = 135, G_SWEEP = 270;
  const color = scoreColor(displayScore);
  const klasse = klasseFromScore(displayScore);
  const filledEnd = G_START + G_SWEEP * (arcProgress / 100);
  return (
    <svg width={size} height={size * 0.88} viewBox="0 0 200 190" fill="none">
      <path d={describeArc(cx, cy, r, G_START, G_START + G_SWEEP)}
        stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" fill="none" />
      {arcProgress > 0 && (
        <path d={describeArc(cx, cy, r, G_START, filledEnd)}
          stroke={color} strokeWidth="10" strokeLinecap="round" fill="none"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }} />
      )}
      {[0, 25, 50, 75, 100].map((pct) => {
        const deg = G_START + G_SWEEP * (pct / 100);
        const inner = polarToXY(cx, cy, r - 14, deg);
        const outer = polarToXY(cx, cy, r - 6, deg);
        return <line key={pct} x1={inner.x.toFixed(1)} y1={inner.y.toFixed(1)}
          x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" />;
      })}
      <text x="100" y="92" textAnchor="middle" fill={color}
        style={{ fontFamily: 'var(--font-cormorant-var)', fontSize: 52, fontWeight: 300, fontStyle: 'italic' }}>
        {displayScore}
      </text>
      <text x="100" y="112" textAnchor="middle" fill="rgba(255,255,255,0.45)"
        style={{ fontFamily: 'var(--font-syne-var)', fontSize: 10, letterSpacing: 3 }}>
        ENERGIE-SCORE
      </text>
      <rect x="84" y="120" width="32" height="20" rx="4" fill={color} opacity="0.18" />
      <text x="100" y="134" textAnchor="middle" fill={color}
        style={{ fontFamily: 'var(--font-syne-var)', fontSize: 11, fontWeight: 700 }}>
        {klasse}
      </text>
    </svg>
  );
}

function ScoreInfo({ score }: { score: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8 }}>
      <button onClick={() => setOpen(v => !v)} style={{ background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: 'var(--font-syne-var)', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)',
        display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
        Wie berechnet?
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>›</span>
      </button>
      {open && (
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6,
          padding: '10px 12px', borderRadius: 10, background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          {[['Effizienzklasse','40%'],['Heizungssystem','25%'],['Gebäudealter','20%'],['Sanierungspotenzial','15%']].map(([label, pct]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: 11, color: 'var(--muted)' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: 11, fontWeight: 600, color: '#f0ac24' }}>{pct}</span>
            </div>
          ))}
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: 9, color: 'var(--subtle)', marginTop: 4, lineHeight: 1.5 }}>
            0 = sehr schlecht · 100 = Passivhaus
          </p>
        </div>
      )}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analyse, setAnalyse] = useState<AnalyseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<'idle' | 'phase1' | 'phase2'>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [arcProgress, setArcProgress] = useState(0);
  const [popStyle, setPopStyle] = useState<React.CSSProperties>({ transform: 'scale(0.4)', opacity: 0 });
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

      if (cacheValid) { setAnalyse(cached!); setLoading(false); startScore(cached!); return; }

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
        startScore(data);
      } catch {
        const fb = buildFallback(p);
        await saveAnalysis(fb);
        setAnalyse(fb);
        startScore(fb);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  function startScore(data: AnalyseResult) {
    const target = energieeffizienzToScore(data.energieeffizienzklasse ?? 'D');
    setPhase('phase1');
    setTimeout(() => setPopStyle({ transform: 'scale(1.08)', opacity: 1, transition: 'transform 400ms cubic-bezier(0.34,1.56,0.64,1), opacity 300ms ease' }), 50);
    setTimeout(() => setPopStyle({ transform: 'scale(1)', opacity: 1, transition: 'transform 200ms ease-out' }), 450);
    counterRef.current = setInterval(() => {
      setDisplayScore(prev => { if (prev >= target) { clearInterval(counterRef.current!); return prev; } return prev + 1; });
    }, 30);
    const t0 = performance.now();
    const animArc = (now: number) => {
      const t = Math.min((now - t0) / 1000, 1);
      setArcProgress((1 - Math.pow(1 - t, 3)) * target);
      if (t < 1) requestAnimationFrame(animArc);
    };
    requestAnimationFrame(animArc);
    setTimeout(() => setPhase('phase2'), 1400);
  }

  useEffect(() => () => { if (counterRef.current) clearInterval(counterRef.current); }, []);

  if (loading || !profile) {
    return (
      <DashboardShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <LoadingSteps />
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
      {/* Phase 1: Centered score overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'center', pointerEvents: phase === 'phase1' ? 'auto' : 'none',
        opacity: phase === 'phase1' ? 1 : 0, transition: 'opacity 400ms ease', background: 'rgba(7,5,0,0.6)' }}>
        <div style={popStyle}>
          <ScoreGauge displayScore={displayScore} arcProgress={arcProgress} size={300} />
        </div>
      </div>

      <div style={{ padding: '40px 40px 80px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
              Dein Energieplan
            </p>
            <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
              Bereit zum <em style={{ color: '#de6818' }}>Sparen.</em>
            </h1>
          </div>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{
              marginTop: '8px',
              padding: '10px 18px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              fontFamily: 'var(--font-syne-var)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--muted)',
              cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--divider)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
          >
            ⎙ PDF / Drucken
          </button>
        </div>

        {/* Score gauge row */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', marginBottom: '16px',
          opacity: phase === 'phase2' ? 1 : 0, transform: phase === 'phase2' ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 400ms ease, transform 400ms ease' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 16, padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScoreGauge displayScore={displayScore} arcProgress={arcProgress} size={188} />
            <ScoreInfo score={displayScore} />
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 16, padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--label-color)' }}>Dein Gebäude auf einen Blick</p>
            <p style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 400, fontSize: 32,
              color: 'var(--text)', lineHeight: 1.1 }}>
              Bereit zum <em style={{ color: '#de6818' }}>Sparen.</em>
            </p>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 400 }}>
              Dein Energiescore zeigt den aktuellen Zustand deines Gebäudes.
              Mit den empfohlenen Maßnahmen kannst du bis zu{' '}
              <strong style={{ color: '#f0ac24' }}>€{analyse.maxErsparnisjahr.toLocaleString('de-DE')}</strong> pro Jahr sparen.
            </p>
          </div>
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

        {/* Row 2.5: Energie-Label + Förderungen */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginBottom: '16px' }}>
          <EnergieLabelWidget
            currentLabel={profile.energieeffizienzklasse ?? 'D'}
            improvableMassnahmenCount={analyse.massnahmen.filter(m => ['heizung', 'daemmung', 'solar'].includes(m.kategorie)).length}
          />
          <FoerderungsBadge foerderungsIds={analyse.qualifiziertefoerderungen ?? []} />
        </div>

        {/* Row 3: Profil */}
        <div style={{ marginBottom: '16px' }}>
          <ProfilKarte profile={profile} analyse={analyse} />
        </div>

        {/* Row 4: Top 3 measures */}
        <TopMassnahmenCards massnahmen={analyse.massnahmen} />
      </div>
    </DashboardShell>
  );
}

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
