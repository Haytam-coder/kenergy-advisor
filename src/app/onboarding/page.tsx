'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/types';
import { saveProfile, saveAnalysis, saveOnboardingStep } from '@/lib/localStorage';
import { getTabulaData, getTabulaArchetype } from '@/lib/tabula';
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
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    monatlicheKosten: 150,
  });

  function update(updates: Partial<UserProfile>) {
    setProfile((prev) => ({ ...prev, ...updates }));
  }

  async function goToStep2() {
    setStep(2);
    saveOnboardingStep(2);
  }

  async function goToStep3() {
    // Load TABULA data + call Brightsky in background
    if (profile.propertyType && profile.baujahr) {
      const tabula = getTabulaData(profile.propertyType, profile.baujahr);
      const archetype = getTabulaArchetype(profile.propertyType);
      let heizenergie = tabula.heizenergiebedarfKwh;

      // Fetch Brightsky data in background (non-blocking)
      if (profile.plz) {
        fetch(`/api/brightsky?plz=${profile.plz}`).catch(() => {});
      }

      update({
        tabulaArchetype: archetype,
        heizenergiebedarfKwh: heizenergie,
        daemmzustand: tabula.daemmzustand,
        energieeffizienzklasse: tabula.energieeffizienzklasse,
      });
    }
    setStep(3);
    saveOnboardingStep(3);
  }

  function goToStep4() {
    // Adjust heizenergiebedarf if already partially renovated
    if (profile.bereitsSaniert === 'ja' && profile.heizenergiebedarfKwh) {
      update({ heizenergiebedarfKwh: Math.round(profile.heizenergiebedarfKwh * 0.8) });
    }
    setStep(4);
    saveOnboardingStep(4);
  }

  function goToStep5() {
    setStep(5);
    saveOnboardingStep(5);
  }

  function goToStep6() {
    setStep(6);
    saveOnboardingStep(6);
  }

  async function handleSubmit() {
    setSubmitting(true);
    const finalProfile = profile as UserProfile;
    saveProfile(finalProfile);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProfile),
      });
      if (res.ok) {
        const analysis = await res.json();
        saveAnalysis(analysis);
      }
    } catch {
      // Fehler ignorieren – Dashboard zeigt Fallback
    }

    router.push('/dashboard');
  }

  function getStep5Component() {
    const isEigentuemer = profile.userType === 'eigentuemer';
    const isHaus = profile.propertyType === 'haus';

    if (isEigentuemer && isHaus) {
      return <Step5A data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    }
    if (isEigentuemer && !isHaus) {
      return <Step5B data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    }
    if (!isEigentuemer && isHaus) {
      return <Step5C data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
    }
    return <Step5D data={profile} onChange={update} onNext={goToStep6} onBack={() => setStep(4)} />;
  }

  // Display step: step 5 sub-variants all count as step 5
  const displayStep = step;

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-green-600">⚡ Kenergy Advisor</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <ProgressBar currentStep={displayStep} totalSteps={TOTAL_STEPS} />

          {step === 1 && (
            <Step1 data={profile} onChange={update} onNext={goToStep2} />
          )}
          {step === 2 && (
            <Step2 data={profile} onChange={update} onNext={goToStep3} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <Step3 data={profile} onChange={update} onNext={goToStep4} onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <Step4 data={profile} onChange={update} onNext={goToStep5} onBack={() => setStep(3)} />
          )}
          {step === 5 && getStep5Component()}
          {step === 6 && (
            <Step6 data={profile} onChange={update} onSubmit={handleSubmit} onBack={() => setStep(5)} submitting={submitting} />
          )}
        </div>
      </div>
    </div>
  );
}
