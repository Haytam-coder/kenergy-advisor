'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalyseResult } from '@/lib/types';
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

        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--label-color)', marginBottom: '6px' }}>
            Dein Aktionsplan
          </p>
          <h1 style={{ fontFamily: 'var(--font-cormorant-var)', fontWeight: 300, fontSize: '38px', lineHeight: 1.1, color: 'var(--text)' }}>
            Alle <em style={{ color: '#de6818' }}>Maßnahmen.</em>
          </h1>
        </div>

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
