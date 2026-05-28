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
