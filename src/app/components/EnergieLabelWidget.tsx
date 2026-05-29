const LABELS = ['A+++', 'A++', 'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

const LABEL_COLORS: Record<string, string> = {
  'A+++': '#00A651', 'A++': '#4CB748', 'A+': '#8DC640', 'A': '#C8D400',
  'B': '#F5E600', 'C': '#F5B400', 'D': '#EF7D00', 'E': '#E63027',
  'F': '#BC1622', 'G': '#9B0E15',
};

function improveLabel(label: string, steps: number): string {
  const idx = LABELS.indexOf(label);
  if (idx === -1) return label;
  return LABELS[Math.max(0, idx - steps)];
}

interface Props {
  currentLabel: string;
  improvableMassnahmenCount: number;
}

export default function EnergieLabelWidget({ currentLabel, improvableMassnahmenCount }: Props) {
  const steps = Math.min(3, Math.floor(improvableMassnahmenCount / 2));
  const targetLabel = improveLabel(currentLabel, steps);
  const currentColor = LABEL_COLORS[currentLabel] ?? '#888';
  const targetColor = LABEL_COLORS[targetLabel] ?? '#888';
  const isImproved = targetLabel !== currentLabel;

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
        marginBottom: '16px',
      }}>
        Energie-Effizienzklasse
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Current */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            background: currentColor,
            color: 'white',
            fontFamily: 'var(--font-syne-var)',
            fontWeight: 700,
            fontSize: '20px',
            padding: '10px 16px',
            borderRadius: '8px',
            minWidth: '60px',
            textAlign: 'center',
          }}>
            {currentLabel}
          </div>
          <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '8px', color: 'var(--muted)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Aktuell
          </p>
        </div>

        {isImproved && (
          <>
            <span style={{ color: 'var(--muted)', fontSize: '18px', flexShrink: 0 }}>→</span>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                background: targetColor,
                color: 'white',
                fontFamily: 'var(--font-syne-var)',
                fontWeight: 700,
                fontSize: '20px',
                padding: '10px 16px',
                borderRadius: '8px',
                minWidth: '60px',
                textAlign: 'center',
                boxShadow: `0 0 18px ${targetColor}55`,
              }}>
                {targetLabel}
              </div>
              <p style={{ fontFamily: 'var(--font-syne-var)', fontSize: '8px', color: '#4ade80', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Erreichbar
              </p>
            </div>
          </>
        )}

        {/* Scale */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {LABELS.map((l, i) => {
            const isCurrent = l === currentLabel;
            const isTarget = l === targetLabel && isImproved;
            return (
              <div key={l} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isCurrent || isTarget ? 1 : 0.22,
              }}>
                <div style={{
                  width: `${Math.max(18, 82 - i * 7)}%`,
                  height: '5px',
                  background: LABEL_COLORS[l],
                  borderRadius: '2px',
                }} />
                <span style={{
                  fontFamily: 'var(--font-syne-var)',
                  fontSize: '8px',
                  color: isTarget ? '#4ade80' : isCurrent ? 'var(--text)' : 'var(--muted)',
                  fontWeight: isCurrent || isTarget ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}>
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
