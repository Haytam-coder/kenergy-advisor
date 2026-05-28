'use client';

export type KategorieOption = 'alle' | 'heizung' | 'daemmung' | 'solar' | 'geraete' | 'verhalten' | 'tarif' | 'foerderung';

const TABS: { value: KategorieOption; label: string }[] = [
  { value: 'alle',       label: 'Alle' },
  { value: 'heizung',    label: 'Heizung' },
  { value: 'daemmung',   label: 'Dämmung' },
  { value: 'solar',      label: 'Solar' },
  { value: 'geraete',    label: 'Geräte' },
  { value: 'verhalten',  label: 'Verhalten' },
  { value: 'tarif',      label: 'Tarif' },
  { value: 'foerderung', label: 'Förderung' },
];

interface Props {
  active: KategorieOption;
  onChange: (v: KategorieOption) => void;
}

export default function KategorieFilter({ active, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {TABS.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            style={{
              fontFamily: 'var(--font-syne-var)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: '100px',
              border: isActive ? '1px solid rgba(222,104,24,0.5)' : '1px solid var(--divider)',
              background: isActive ? 'rgba(222,104,24,0.1)' : 'transparent',
              color: isActive ? '#de6818' : 'var(--muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
