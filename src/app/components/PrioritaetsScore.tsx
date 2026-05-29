interface Props {
  amortisationJahre: number;
  size?: 'sm' | 'lg';
}

export default function PrioritaetsScore({ amortisationJahre, size = 'sm' }: Props) {
  const score = amortisationJahre === 0
    ? 10
    : Math.min(10, Math.max(1, 11 - Math.round(amortisationJahre)));

  const color = score >= 8 ? '#4ade80' : score >= 5 ? '#de6818' : '#f87171';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size === 'lg' ? '6px' : '3px',
      background: `${color}14`,
      border: `1px solid ${color}38`,
      borderRadius: '100px',
      padding: size === 'lg' ? '6px 14px' : '2px 8px',
      verticalAlign: 'middle',
    }}>
      <span style={{
        fontFamily: 'var(--font-cormorant-var)',
        fontSize: size === 'lg' ? '24px' : '13px',
        fontStyle: 'italic',
        color,
        lineHeight: 1,
      }}>
        {score}
      </span>
      <span style={{
        fontFamily: 'var(--font-syne-var)',
        fontSize: size === 'lg' ? '9px' : '7px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color,
        opacity: 0.8,
      }}>
        /10
      </span>
    </span>
  );
}
