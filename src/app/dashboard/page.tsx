'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserProfile, AnalyseResult, Massnahme } from '@/lib/types';
import { loadProfile, loadAnalysis, saveAnalysis } from '@/lib/storage';
import ThemeToggle from '@/app/components/ThemeToggle';
import ProfilKarte from './components/ProfilKarte';
import SparpotenzialKarte from './components/SparpotenzialKarte';
import BudgetFilter, { BudgetOption } from './components/BudgetFilter';
import MassnahmenTop3 from './components/MassnahmenTop3';
import FoerderungsBadge from './components/FoerderungsBadge';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analyse, setAnalyse] = useState<AnalyseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<BudgetOption>('alle');

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
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', position: 'relative', overflow: 'hidden' }}>
        <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.45 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', margin: '0 auto 20px', border: '2px solid rgba(222,104,24,0.25)', borderTop: '2px solid #de6818', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-cormorant-var)', fontStyle: 'italic', fontWeight: 300, fontSize: '24px', color: 'var(--text)', marginBottom: '8px' }}>
            Dein persönlicher Energieplan wird erstellt…
          </p>
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
            Claude analysiert dein Gebäudeprofil
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!analyse) return null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* Dark orbs */}
      <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.45 }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', right: '20px', top: '20px', borderRadius: '50%', background: 'radial-gradient(circle, #e06818 0%, transparent 68%)', opacity: 0.28, filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', width: '340px', height: '340px', left: '-60px', bottom: '120px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.18, filter: 'blur(28px)' }} />
      </div>

      {/* Light orbs */}
      <div className="orb-layer-light" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,105,25,0.5) 0%, rgba(255,105,25,0) 68%)', animation: 'orbFloat1 16s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '420px', height: '420px', right: '40px', top: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,158,55,0.32) 0%, rgba(255,158,55,0) 68%)', animation: 'orbFloat3 12s ease-in-out infinite' }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-syne-var)', fontWeight: 600, letterSpacing: '0.22em', fontSize: '12px', color: 'var(--text)', textDecoration: 'none', textTransform: 'uppercase' }}>
          KENERGY<span style={{ color: '#de6818' }}>·</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Dashboard
          </span>
        </div>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '760px', margin: '0 auto', padding: '8px 16px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '8px' }}>
            Dein Energieplan
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '42px', lineHeight: 1.1, color: 'var(--text)' }}>
            Bereit zum <em style={{ color: '#de6818' }}>Sparen.</em>
          </h1>
        </div>

        {/* Sparpotenzial — prominent */}
        <div style={{ marginBottom: '16px' }}>
          <SparpotenzialKarte analyse={analyse} />
        </div>

        {/* Profil + Förderungen */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}
          className="md:grid-cols-5-custom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">
            <ProfilKarte profile={profile} analyse={analyse} />
            <FoerderungsBadge foerderungsIds={analyse.qualifiziertefoerderungen ?? []} />
          </div>
        </div>

        {/* Budget + Maßnahmen */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px' }}>
          <div style={{ marginBottom: '24px' }}>
            <BudgetFilter active={budget} onChange={setBudget} />
          </div>
          <MassnahmenTop3 massnahmen={analyse.massnahmen} ziel={profile.goal} budget={budget} />
        </div>

        {/* Bottom links */}
        <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/chat', label: 'KI-Berater fragen' },
            { href: '/massnahmen', label: 'Alle Maßnahmen' },
            { href: '/foerderungen', label: 'Förderungen' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--font-syne-var)', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--muted)', textDecoration: 'none', border: '1px solid var(--divider)', borderRadius: '100px', padding: '10px 18px', transition: 'border-color 0.2s, color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(222,104,24,0.4)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--divider)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)'; }}>
              {label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
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
