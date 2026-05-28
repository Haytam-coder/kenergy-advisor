'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { saveProfile, saveAnalysis, saveOnboardingStep } from '@/lib/storage';
import { getTabulaData, getTabulaArchetype } from '@/lib/tabula';
import ThemeToggle from '@/app/components/ThemeToggle';
import ProgressBar from './components/ProgressBar';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5A from './components/Step5A';
import Step5B from './components/Step5B';
import Step5C from './components/Step5C';
import Step5D from './components/Step5D';
import Step6 from './components/Step6';

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({ monatlicheKosten: 150 });

  function update(updates: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  async function goToStep2() { setStep(2); saveOnboardingStep(2); }

  async function goToStep3() {
    if (profile.propertyType && profile.baujahr) {
      const tabula = getTabulaData(profile.propertyType, profile.baujahr);
      const archetype = getTabulaArchetype(profile.propertyType);
      if (profile.plz) fetch(`/api/brightsky?plz=${profile.plz}`).catch(() => {});
      update({
        tabulaArchetype: archetype,
        heizenergiebedarfKwh: tabula.heizenergiebedarfKwh,
        daemmzustand: tabula.daemmzustand,
        energieeffizienzklasse: tabula.energieeffizienzklasse,
      });
    }
    setStep(3); saveOnboardingStep(3);
  }

  function goToStep4() {
    if (profile.bereitsSaniert === 'ja' && profile.heizenergiebedarfKwh) {
      update({ heizenergiebedarfKwh: Math.round(profile.heizenergiebedarfKwh * 0.8) });
    }
    setStep(4); saveOnboardingStep(4);
  }

  function goToStep5() { setStep(5); saveOnboardingStep(5); }
  function goToStep6() { setStep(6); saveOnboardingStep(6); }

  async function handleSubmit() {
    setSubmitting(true);
    const finalProfile = profile as UserProfile;
    await saveProfile(finalProfile);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProfile),
      });
      if (res.ok) await saveAnalysis(await res.json());
    } catch { /* Dashboard zeigt Fallback */ }
    router.push('/dashboard');
  }

  function getStep5Component() {
    const isEigentuemer = profile.userType === 'eigentuemer';
    const isHaus = profile.propertyType === 'haus';
    if (isEigentuemer && isHaus)  return <Step5A data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    if (isEigentuemer && !isHaus) return <Step5B data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    if (!isEigentuemer && isHaus) return <Step5C data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    return <Step5D data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* Orb Layer */}
      <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          width: '1060px', height: '1060px',
          right: '-240px', top: '-240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #c04400 0%, transparent 68%)',
          opacity: 0.55,
        }} />
        <div style={{
          position: 'absolute',
          width: '680px', height: '680px',
          right: '40px', top: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #e06818 0%, transparent 68%)',
          opacity: 0.38,
          filter: 'blur(20px)',
        }} />
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

      {/* Light Mode Orbs */}
      <div className="orb-layer-light" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute',
          width: '1060px', height: '1060px',
          right: '-240px', top: '-240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,105,25,0.58) 0%, rgba(255,105,25,0) 68%)',
          willChange: 'transform',
          animation: 'orbFloat1 16s ease-in-out infinite',
        }} />
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

      {/* Navigation */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-syne-var)', fontWeight: 600, letterSpacing: '0.22em', fontSize: '12px', color: 'var(--text)', textDecoration: 'none', textTransform: 'uppercase' }}>
          KENERGY<span style={{ color: '#de6818' }}>·</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Energie-Analyse
          </span>
        </div>
      </nav>

      {/* Form Card */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', padding: '16px 16px 64px' }}>
        <div style={{ width: '100%', maxWidth: '520px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '32px' }}>
          <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          {step === 1 && <Step1 data={profile} onChange={update} onNext={goToStep2} />}
          {step === 2 && <Step2 data={profile} onChange={update} onNext={goToStep3} onBack={() => setStep(1)} />}
          {step === 3 && <Step3 data={profile} onChange={update} onNext={goToStep4} onBack={() => setStep(2)} />}
          {step === 4 && <Step4 data={profile} onChange={update} onNext={goToStep5} onBack={() => setStep(3)} />}
          {step === 5 && getStep5Component()}
          {step === 6 && <Step6 data={profile} onChange={update} onSubmit={handleSubmit} onBack={() => setStep(5)} submitting={submitting} />}
        </div>
      </div>
    </div>
  );
}
