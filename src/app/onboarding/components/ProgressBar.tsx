'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);
  return (
    <div style={{ width: '100%', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Schritt {currentStep} von {totalSteps}
        </span>
        <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '10px', fontWeight: 600, color: '#f0ac24' }}>
          {percent} %
        </span>
      </div>
      <div style={{ width: '100%', height: '1px', backgroundColor: 'var(--card-border)' }}>
        <div style={{ width: `${percent}%`, height: '1px', backgroundColor: '#de6818', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}
