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
