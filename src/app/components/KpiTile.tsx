interface Props {
  label: string;
  value: string;
  subtext?: string;
  accent?: string;
}

export default function KpiTile({ label, value, subtext, accent = 'var(--text)' }: Props) {
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
        marginBottom: '10px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-cormorant-var)',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: '36px',
        lineHeight: 1,
        color: accent,
        marginBottom: subtext ? '4px' : 0,
      }}>
        {value}
      </p>
      {subtext && (
        <p style={{
          fontFamily: 'var(--font-syne-var)',
          fontSize: '11px',
          color: 'var(--muted)',
        }}>
          {subtext}
        </p>
      )}
    </div>
  );
}
