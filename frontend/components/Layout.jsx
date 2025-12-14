import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { regions } from '../data/staticData';

export default function Layout({ children }) {
  const { itemCount, region, setRegion } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            <span className="logo-icon">☁️</span>
            <span>CloudCart AI</span>
          </Link>

          <nav className="nav">
            <div className="region-selector">
              <label>🌍</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions.map(r => (
                  <option key={r.value} value={r.value}>
                    {r.flag} {r.label}
                  </option>
                ))}
              </select>
            </div>

            <Link href="/" className="nav-link">
              🛒 Catalog
            </Link>

            <Link href="/cart" className="nav-link">
              🛍️ Cart {itemCount > 0 && <span className="badge badge-info">{itemCount}</span>}
            </Link>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      <main className="container" style={{ paddingTop: '32px', paddingBottom: '32px', minHeight: 'calc(100vh - 140px)' }}>
        {children}
      </main>

      <footer className="footer">
        Built with 💜 for AWS Cost Optimization | Powered by AI
      </footer>
    </div>
  );
}
