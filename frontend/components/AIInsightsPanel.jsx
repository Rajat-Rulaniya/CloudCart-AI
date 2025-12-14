import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function AIInsightsPanel({
  onAnalyzeHidden,
  onOptimize,
  onSimulate,
  onAnalyzeWorkload,
  isLoading,
  aiResponse,
  activeAction
}) {
  const [simulationPrompt, setSimulationPrompt] = useState('');
  const [workloadDescription, setWorkloadDescription] = useState('');
  const [showWorkloadInput, setShowWorkloadInput] = useState(false);

  const handleSimulate = () => {
    if (simulationPrompt.trim()) {
      onSimulate(simulationPrompt);
      setSimulationPrompt('');
    }
  };

  const handleWorkloadAnalysis = () => {
    if (workloadDescription.trim()) {
      onAnalyzeWorkload(workloadDescription);
      setWorkloadDescription('');
      setShowWorkloadInput(false);
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <span style={{ fontSize: '24px' }}>🤖</span>
        <h3 className="ai-panel-title">AI Architecture Advisor</h3>
        <span className="badge badge-info">Powered by Gemini</span>
      </div>

      <div className="ai-panel-body">
        <div className="ai-buttons">
          <button
            className={`btn ${activeAction === 'hidden' ? 'btn-warning' : 'btn-outline'}`}
            onClick={onAnalyzeHidden}
            disabled={isLoading}
          >
            🔍 Detect Hidden Costs
          </button>

          <button
            className={`btn ${activeAction === 'optimize' ? 'btn-success' : 'btn-outline'}`}
            onClick={onOptimize}
            disabled={isLoading}
          >
            🚀 Optimize Architecture
          </button>

          <button
            className={`btn ${showWorkloadInput ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowWorkloadInput(!showWorkloadInput)}
            disabled={isLoading}
          >
            💡 Analyze Workload
          </button>
        </div>

        <div className="prompt-input" style={{ marginBottom: 'var(--space-lg)' }}>
          <input
            type="text"
            placeholder="What if... (e.g., 'traffic doubles' or 'I switch to spot instances')"
            value={simulationPrompt}
            onChange={(e) => setSimulationPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSimulate()}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={isLoading || !simulationPrompt.trim()}
          >
            🔮 Simulate
          </button>
        </div>

        {showWorkloadInput && (
          <div style={{
            background: 'var(--bg-secondary)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-lg)'
          }}>
            <label className="form-label">Describe your application workload:</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="E.g., 'E-commerce platform with 10,000 daily users, product catalog of 50,000 items, high traffic during sales events, needs real-time inventory updates...'"
              value={workloadDescription}
              onChange={(e) => setWorkloadDescription(e.target.value)}
              disabled={isLoading}
              style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            />
            <button
              className="btn btn-primary"
              onClick={handleWorkloadAnalysis}
              disabled={isLoading || !workloadDescription.trim()}
            >
              🔬 Analyze & Improve
            </button>
          </div>
        )}

        {isLoading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>AI is analyzing your architecture...</span>
          </div>
        )}

        {!isLoading && aiResponse && (
          <div className="animate-in">
            <MarkdownRenderer content={aiResponse} />
          </div>
        )}

        {!isLoading && !aiResponse && (
          <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
            <p>Click a button above to get AI-powered insights about your cloud architecture.</p>
          </div>
        )}
      </div>
    </div>
  );
}
