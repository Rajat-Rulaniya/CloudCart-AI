import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import ServiceCard from '../components/ServiceCard';

export default function Home() {
  const { loadDemoArchitecture, itemCount } = useCart();

  return (
    <>
      <Head>
        <title>CloudCart AI - Smart AWS Cost Planning</title>
        <meta name="description" content="AI-powered cloud cost planner that exposes hidden AWS costs and provides optimization suggestions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="hero">
        <h1>☁️ CloudCart AI</h1>
        <p>
          An AI-powered cloud cost planner that simulates real-world AWS usage,
          exposes hidden costs, and provides intelligent optimization suggestions.
        </p>
        <div className="hero-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={loadDemoArchitecture}
          >
            🚀 Load Demo Architecture
          </button>
          {itemCount > 0 && (
            <Link href="/cart" className="btn btn-success btn-lg">
              🛒 View Cart ({itemCount})
            </Link>
          )}
        </div>
      </section>

      <section>
        <div className="page-header">
          <h2 className="page-title">🛒 Service Catalog</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Configure AWS services like products and add them to your cart
          </p>
        </div>

        <div className="service-grid">
          <ServiceCard type="ec2" />
          <ServiceCard type="s3" />
          <ServiceCard type="rds" />
          <ServiceCard type="dataTransfer" />
        </div>

        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-xl)',
          fontStyle: 'italic'
        }}>
          * More services to be added soon...
        </p>
      </section>

      <section style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 className="page-title" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          ✨ Why CloudCart AI?
        </h2>

        <div className="service-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '32px' }}>🔍</span>
            </div>
            <h3 className="card-title">Hidden Cost Detection</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              AI analyzes your architecture to find data transfer, NAT Gateway,
              and inter-service costs you might miss.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '32px' }}>🚀</span>
            </div>
            <h3 className="card-title">Smart Optimization</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              Get actionable recommendations to reduce costs: spot instances,
              reserved capacity, right-sizing, and more.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '32px' }}>🏭</span>
            </div>
            <h3 className="card-title">Production Mode</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              Toggle to see real production costs with backups, monitoring,
              logging, and redundancy overhead.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '32px' }}>🔮</span>
            </div>
            <h3 className="card-title">What-If Simulation</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              Ask questions like "What if traffic doubles?" and get AI-powered
              cost projections instantly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
