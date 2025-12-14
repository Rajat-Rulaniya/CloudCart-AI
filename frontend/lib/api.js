const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function calculateCost(region, productionMode, services) {
  const response = await fetch(`${API_URL}/calculate-cost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, productionMode, services })
  });

  if (!response.ok) {
    throw new Error('Failed to calculate costs');
  }

  return response.json();
}

export async function analyzeHiddenCosts(region, productionMode, services) {
  const response = await fetch(`${API_URL}/analyze-hidden-costs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, productionMode, services })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze hidden costs');
  }

  return response.json();
}

export async function getOptimizations(region, productionMode, services) {
  const response = await fetch(`${API_URL}/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, productionMode, services })
  });

  if (!response.ok) {
    throw new Error('Failed to get optimizations');
  }

  return response.json();
}

export async function runSimulation(region, productionMode, services, prompt) {
  const response = await fetch(`${API_URL}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, productionMode, services, prompt })
  });

  if (!response.ok) {
    throw new Error('Failed to run simulation');
  }

  return response.json();
}

export async function analyzeWorkload(region, productionMode, services, workloadDescription) {
  const response = await fetch(`${API_URL}/analyze-workload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, productionMode, services, workloadDescription })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze workload');
  }

  return response.json();
}

export async function explainProductionMode(region, services) {
  const response = await fetch(`${API_URL}/explain-production`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ region, services })
  });

  if (!response.ok) {
    throw new Error('Failed to explain production mode');
  }

  return response.json();
}
