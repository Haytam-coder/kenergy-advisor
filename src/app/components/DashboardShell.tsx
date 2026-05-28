import Sidebar from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Fixed orb decorations */}
      <div className="orb-layer" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.45 }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', right: '20px', top: '20px', borderRadius: '50%', background: 'radial-gradient(circle, #e06818 0%, transparent 68%)', opacity: 0.28, filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', width: '340px', height: '340px', left: '-60px', bottom: '120px', borderRadius: '50%', background: 'radial-gradient(circle, #c04400 0%, transparent 68%)', opacity: 0.18, filter: 'blur(28px)' }} />
      </div>
      <div className="orb-layer-light" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '900px', height: '900px', right: '-200px', top: '-200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,105,25,0.5) 0%, rgba(255,105,25,0) 68%)', animation: 'orbFloat1 16s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '420px', height: '420px', right: '40px', top: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,158,55,0.32) 0%, rgba(255,158,55,0) 68%)', animation: 'orbFloat3 12s ease-in-out infinite' }} />
      </div>

      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main style={{
        flex: 1,
        marginLeft: '220px',
        position: 'relative',
        zIndex: 10,
        overflowX: 'hidden',
      }}>
        {children}
      </main>
    </div>
  );
}
