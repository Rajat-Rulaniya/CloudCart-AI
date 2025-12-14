require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pricingEngine = require('./services/pricingEngine');
const geminiService = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/calculate-cost', (req, res) => {
  try {
    const { region, productionMode, services } = req.body;

    if (!region || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: 'Region and services array required' });
    }

    const costs = pricingEngine.calculateAllCosts(services, region, productionMode);
    res.json(costs);
  } catch (error) {
    console.error('Calculate cost error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze-hidden-costs', async (req, res) => {
  try {
    const { region, productionMode, services } = req.body;

    if (!region || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: 'Region and services array required' });
    }

    const costs = pricingEngine.calculateAllCosts(services, region, productionMode);
    const hiddenEstimates = pricingEngine.estimateHiddenCosts(services, region);

    const aiExplanation = await geminiService.analyzeHiddenCosts(
      services,
      region,
      productionMode,
      { ...costs, ...hiddenEstimates }
    );

    res.json({
      ...hiddenEstimates,
      aiExplanation
    });
  } catch (error) {
    console.error('Analyze hidden costs error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/optimize', async (req, res) => {
  try {
    const { region, productionMode, services } = req.body;

    if (!region || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: 'Region and services array required' });
    }

    const costs = pricingEngine.calculateAllCosts(services, region, productionMode);
    const aiExplanation = await geminiService.generateOptimizations(
      services,
      region,
      productionMode,
      costs
    );

    res.json({
      currentCost: costs.total.monthly,
      aiExplanation
    });
  } catch (error) {
    console.error('Optimize error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/simulate', async (req, res) => {
  try {
    const { region, productionMode, services, prompt } = req.body;

    if (!region || !services || !Array.isArray(services) || !prompt) {
      return res.status(400).json({ error: 'Region, services array, and prompt required' });
    }

    const costs = pricingEngine.calculateAllCosts(services, region, productionMode);
    const aiExplanation = await geminiService.runSimulation(
      services,
      region,
      productionMode,
      costs,
      prompt
    );

    res.json({
      originalCost: costs.total.monthly,
      aiExplanation
    });
  } catch (error) {
    console.error('Simulate error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze-workload', async (req, res) => {
  try {
    const { region, productionMode, services, workloadDescription } = req.body;

    if (!region || !services || !Array.isArray(services) || !workloadDescription) {
      return res.status(400).json({ error: 'Region, services array, and workload description required' });
    }

    const costs = pricingEngine.calculateAllCosts(services, region, productionMode);
    const aiExplanation = await geminiService.analyzeWorkload(
      services,
      region,
      productionMode,
      costs,
      workloadDescription
    );

    res.json({
      currentCost: costs.total.monthly,
      aiExplanation
    });
  } catch (error) {
    console.error('Analyze workload error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/explain-production', async (req, res) => {
  try {
    const { region, services } = req.body;

    if (!region || !services || !Array.isArray(services)) {
      return res.status(400).json({ error: 'Region and services array required' });
    }

    const baseCosts = pricingEngine.calculateAllCosts(services, region, false);
    const productionCosts = pricingEngine.calculateAllCosts(services, region, true);

    const aiExplanation = await geminiService.explainProductionMode(
      services,
      region,
      baseCosts.total.monthly,
      productionCosts.total.monthly
    );

    res.json({
      baseCost: baseCosts.total.monthly,
      productionCost: productionCosts.total.monthly,
      increase: productionCosts.total.monthly - baseCosts.total.monthly,
      aiExplanation
    });
  } catch (error) {
    console.error('Explain production error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CloudCart AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
