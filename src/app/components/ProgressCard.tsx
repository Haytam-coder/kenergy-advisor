interface Props {
  label: string;
  currentLabel: string;
  optimisedLabel: string;
  percent: number;
  accent?: string;
}

export default function ProgressCard({ label, currentLabel, optimisedLabel, percent, accent = '#de6818' }: Props) {
  const capped = Math.min(100, Math.max(0, percent));
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '20px 24px',
    }}>
      <p style={{
        fontFamily: 'var(--font-syne-var)',
        fontSize: '9px',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'var(--label-color)',
        marginBottom: '14px',
      }}>
        {label}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
          Aktuell: <strong style={{ color: 'var(--text)' }}>{currentLabel}</strong>
        </span>
        <span style={{ fontFamily: 'var(--font-syne-var)', fontSize: '12px', color: 'var(--muted)' }}>
          Optimiert: <strong style={{ color: accent }}>{optimisedLabel}</strong>
        </span>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '4px',
        height: '8px',
        overflow: 'hidden',
      }}>
        <div style={{
          background: accent,
          width: `${capped}%`,
          height: '100%',
          borderRadius: '4px',
          transition: 'width 0.6s ease',
        }} />
      </div>

      <p style={{
        fontFamily: 'var(--font-syne-var)',
        fontSize: '11px',
        color: accent,
        marginTop: '6px',
        textAlign: 'right',
      }}>
        {capped}% Ersparnis
      </p>
    </div>
  );
}
