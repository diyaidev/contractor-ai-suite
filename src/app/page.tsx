import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome Back, Contractor</h1>
        <p style={{ color: '#888' }}>Manage your projects and use AI tools to close more deals.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Interior Visualizer Card */}
        <div className="card glass">
          <div style={{ height: '150px', background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🛋️</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Interior Visualizer</h2>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Visualize room remodels with product-locked textures.</p>
          <Link href="/visualizer" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Launch Tool
          </Link>
        </div>

        {/* Pool Estimator Card */}
        <div className="card glass">
          <div style={{ height: '150px', background: 'linear-gradient(45deg, #10b981, #3b82f6)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🏊</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pool Estimator</h2>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Remote site survey & automated quoting.</p>
          <Link href="/pool-estimator" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Launch Tool
          </Link>
        </div>

        {/* HVAC Triage Card */}
        <div className="card glass">
          <div style={{ height: '150px', background: 'linear-gradient(45deg, #f59e0b, #ef4444)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🔧</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>HVAC Triage</h2>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Multimodal AI diagnostics for technicians.</p>
          <Link href="/hvac-triage" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Launch Tool
          </Link>
        </div>
      </div>
    </div>
  );
}
