'use client';

export type BudgetOption = 'alle' | '500' | '2000' | '10000';

interface Props {
  active: BudgetOption;
  onChange: (v: BudgetOption) => void;
}

const options: { label: string; value: BudgetOption }[] = [
  { label: 'Alles', value: 'alle' },
  { label: 'unter €500', value: '500' },
  { label: 'unter €2.000', value: '2000' },
  { label: 'unter €10.000', value: '10000' },
];

const lbl: React.CSSProperties = {
  fontFamily: 'var(--font-inter-var)',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.28em',
  textTransform: 'uppercase',
  color: 'var(--label-color)',
  display: 'block',
  marginBottom: '10px',
};

export default function BudgetFilter({ active, onChange }: Props) {
  return (
    <div>
      <span style={lbl}>Budget-Filter</span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isActive = active === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                fontFamily: 'var(--font-inter-var)',
                fontSize: '12px',
                letterSpacing: '0.04em',
                padding: '8px 16px',
                borderRadius: '100px',
                border: isActive ? '1px solid rgba(222,104,24,0.6)' : '1px solid var(--divider)',
                background: isActive ? 'rgba(222,104,24,0.15)' : 'var(--card-bg)',
                color: isActive ? '#de6818' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
