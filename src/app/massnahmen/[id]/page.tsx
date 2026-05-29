'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AnalyseResult, Massnahme } from '@/lib/types';
import { loadProfile, loadAnalysis } from '@/lib/storage';
import DashboardShell from '@/app/components/DashboardShell';
import KpiTile from '@/app/components/KpiTile';
import { KATEGORIE_ICON } from '@/app/massnahmen/constants';
import AmortisationsRechner from '@/app/components/AmortisationsRechner';
import PrioritaetsScore from '@/app/components/PrioritaetsScore';
import HandwerkerForm from '@/app/components/HandwerkerForm';

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
          <p style={{ fontFamily: 'var(--font-syne-var)', color: 'var(--muted)', marginBottom: '12px' }}>Maßnahme nicht gefunden.</p>
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

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
          <span style={{ fontSize: '36px', flexShrink: 0 }}>{KATEGORIE_ICON[massnahme.kategorie] ?? '⚡'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '36px', lineHeight: 1.1, color: 'var(--text)' }}>
                {massnahme.titel}
              </h1>
              <PrioritaetsScore amortisationJahre={massnahme.amortisationJahre} size="lg" />
            </div>
            <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
              {massnahme.beschreibung}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
          <KpiTile label="Investition" value={kostenText} />
          <KpiTile label="Ersparnis/Jahr" value={`€${massnahme.ersparnisjahr.toLocaleString('de-DE')}`} accent="#de6818" />
          <KpiTile
            label="Amortisation"
            value={massnahme.amortisationJahre === 0 ? 'Sofort' : `${massnahme.amortisationJahre} Jahre`}
          />
        </div>

        <AmortisationsRechner
          ersparnisjahr={massnahme.ersparnisjahr}
          kostenMin={massnahme.kostenschaetzung.min}
          kostenMax={massnahme.kostenschaetzung.max}
        />

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

        {massnahme.kenergy_referral && (
          <HandwerkerForm massnahmeId={massnahme.id} massnahmeTitel={massnahme.titel} />
        )}
      </div>
    </DashboardShell>
  );
}
