import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import CostChart, { ServiceBarChart } from '../components/CostChart';
import AIInsightsPanel from '../components/AIInsightsPanel';
import Tooltip from '../components/Tooltip';
import {
  calculateCost,
  analyzeHiddenCosts,
  getOptimizations,
  runSimulation,
  analyzeWorkload,
  explainProductionMode
} from '../lib/api';

function AILoadingModal({ isOpen, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">🤖</div>
        <h3 className="modal-title">AI is Working...</h3>
        <p className="modal-text">{message}</p>
        <div className="modal-progress">
          <div className="modal-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const {
    cartItems,
    region,
    productionMode,
    setProductionMode,
    removeFromCart,
    clearCart,
    loadDemoArchitecture,
    addToCart,
    isEmpty
  } = useCart();

  const [costs, setCosts] = useState(null);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [activeAction, setActiveAction] = useState('');
  const [error, setError] = useState('');
  const [showProductionModal, setShowProductionModal] = useState(false);

  const aiPanelRef = useRef(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCosts(null);
      return;
    }

    const fetchCosts = async () => {
      setIsLoadingCosts(true);
      setError('');
      try {
        const result = await calculateCost(region, productionMode, cartItems);
        setCosts(result);
      } catch (err) {
        setError('Failed to calculate costs. Make sure the backend is running.');
        console.error('Cost calculation error:', err);
      } finally {
        setIsLoadingCosts(false);
      }
    };

    fetchCosts();
  }, [cartItems, region, productionMode]);

  const scrollToAI = () => {
    aiPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleProductionToggle = async () => {
    const newMode = !productionMode;

    if (newMode && cartItems.length > 0) {
      setShowProductionModal(true);

      try {
        const result = await explainProductionMode(region, cartItems);

        setProductionMode(true);

        setAiResponse(result.aiExplanation);
        setActiveAction('production');

        setTimeout(() => {
          scrollToAI();
        }, 500);

      } catch (err) {
        console.error('Production mode error:', err);
        setAiResponse('⚠️ Could not get AI recommendations. Production mode enabled with standard overhead.');
        setProductionMode(true);
      } finally {
        setShowProductionModal(false);
      }
    } else {
      setProductionMode(false);
      setAiResponse('');
    }
  };

  const handleAnalyzeHidden = async () => {
    setIsLoadingAI(true);
    setActiveAction('hidden');
    setAiResponse('');
    try {
      const result = await analyzeHiddenCosts(region, productionMode, cartItems);
      setAiResponse(result.aiExplanation);
    } catch (err) {
      setAiResponse('⚠️ Failed to analyze hidden costs. Please try again.');
      console.error('Hidden cost analysis error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleOptimize = async () => {
    setIsLoadingAI(true);
    setActiveAction('optimize');
    setAiResponse('');
    try {
      const result = await getOptimizations(region, productionMode, cartItems);
      setAiResponse(result.aiExplanation);
    } catch (err) {
      setAiResponse('⚠️ Failed to generate optimizations. Please try again.');
      console.error('Optimization error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleSimulate = async (prompt) => {
    setIsLoadingAI(true);
    setActiveAction('simulate');
    setAiResponse('');
    try {
      const result = await runSimulation(region, productionMode, cartItems, prompt);
      setAiResponse(result.aiExplanation);
    } catch (err) {
      setAiResponse('⚠️ Failed to run simulation. Please try again.');
      console.error('Simulation error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAnalyzeWorkload = async (description) => {
    setIsLoadingAI(true);
    setActiveAction('workload');
    setAiResponse('');
    try {
      const result = await analyzeWorkload(region, productionMode, cartItems, description);
      setAiResponse(result.aiExplanation);
    } catch (err) {
      setAiResponse('⚠️ Failed to analyze workload. Please try again.');
      console.error('Workload analysis error:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <>
      <Head>
        <title>Cart - CloudCart AI</title>
        <meta name="description" content="View your AWS architecture costs and get AI-powered insights" />
      </Head>

      <AILoadingModal
        isOpen={showProductionModal}
        message="Making your workload production-ready. AI is analyzing your architecture and applying best practices for reliability, monitoring, and scalability..."
      />

      <div className="page-header">
        <h1 className="page-title">🛒 Your Cloud Cart</h1>
        <div className="page-actions">
          {!isEmpty && (
            <button className="btn btn-ai" onClick={scrollToAI}>
              🤖 AI
            </button>
          )}

          <div className={`production-toggle ${productionMode ? 'active' : ''}`}>
            <span style={{ color: productionMode ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
              {productionMode ? '🏭 Production Mode' : '🧪 Development Mode'}
            </span>
            <Tooltip term="productionMode" />
            <label className="switch">
              <input
                type="checkbox"
                checked={productionMode}
                onChange={handleProductionToggle}
                disabled={showProductionModal}
              />
              <span className="slider"></span>
            </label>
          </div>

          {!isEmpty && (
            <button className="btn btn-outline" onClick={clearCart}>
              🗑️ Clear Cart
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(248, 81, 73, 0.1)',
          border: '1px solid var(--accent-danger)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-lg)',
          color: 'var(--accent-danger)'
        }}>
          ⚠️ {error}
        </div>
      )}

      {isEmpty ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some AWS services to start calculating costs</p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
            <Link href="/" className="btn btn-primary">
              🛒 Browse Catalog
            </Link>
            <button className="btn btn-outline" onClick={loadDemoArchitecture}>
              🚀 Load Demo
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-container">
          <div>
            <div className="cart-items">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  costs={costs}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {costs && (
              <div className="chart-grid" style={{ marginTop: 'var(--space-xl)' }}>
                <CostChart
                  breakdown={costs.breakdown}
                  title="💰 Cost Breakdown by Category"
                />
                <ServiceBarChart
                  services={costs.perService}
                />
              </div>
            )}

            <div ref={aiPanelRef}>
              <AIInsightsPanel
                onAnalyzeHidden={handleAnalyzeHidden}
                onOptimize={handleOptimize}
                onSimulate={handleSimulate}
                onAnalyzeWorkload={handleAnalyzeWorkload}
                isLoading={isLoadingAI}
                aiResponse={aiResponse}
                activeAction={activeAction}
              />
            </div>
          </div>

          <div className="summary-panel">
            <h3 className="summary-title">💳 Cost Summary</h3>

            {isLoadingCosts ? (
              <div className="loading">
                <div className="loading-spinner"></div>
              </div>
            ) : costs ? (
              <>
                <div className="summary-row">
                  <span className="summary-label">Services</span>
                  <span className="summary-value">{cartItems.length}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Region</span>
                  <span className="summary-value">{region}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Mode</span>
                  <span className="summary-value">
                    {productionMode ? (
                      <span className="badge badge-warning">Production</span>
                    ) : (
                      <span className="badge badge-info">Development</span>
                    )}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--space-md) 0' }} />

                <div className="summary-row">
                  <span className="summary-label">Compute</span>
                  <span className="summary-value">${costs.breakdown.compute.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Storage</span>
                  <span className="summary-value">${costs.breakdown.storage.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Network</span>
                  <span className="summary-value">${costs.breakdown.network.toFixed(2)}</span>
                </div>
                {costs.breakdown.hidden > 0 && (
                  <div className="summary-row">
                    <span className="summary-label" style={{ color: 'var(--accent-warning)' }}>
                      ⚠️ Hidden
                    </span>
                    <span className="summary-value" style={{ color: 'var(--accent-warning)' }}>
                      ${costs.breakdown.hidden.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="summary-total">
                  <div className="summary-row">
                    <span className="summary-label">Hourly</span>
                    <span className="summary-value">${costs.total.hourly.toFixed(4)}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Daily</span>
                    <span className="summary-value">${costs.total.daily.toFixed(2)}</span>
                  </div>
                  <div className="summary-row" style={{ marginTop: 'var(--space-md)' }}>
                    <span className="summary-label">Monthly Total</span>
                    <span className="summary-value">${costs.total.monthly.toFixed(2)}</span>
                  </div>
                </div>

                {productionMode && (
                  <div style={{
                    marginTop: 'var(--space-lg)',
                    padding: 'var(--space-md)',
                    background: 'rgba(210, 153, 34, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    color: 'var(--accent-warning)'
                  }}>
                    🏭 Production mode adds ~30-50% overhead for backups, monitoring, logging, and redundancy.
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
