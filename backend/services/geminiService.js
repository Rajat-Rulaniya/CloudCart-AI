const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a senior AWS cost optimization architect reviewing a real production cloud setup. 
You provide practical, actionable advice based on real-world experience.
Always format your responses in clear, well-structured markdown.
Use emojis sparingly for emphasis (⚠️ for warnings, 💡 for tips, 🚀 for optimizations, 📊 for data).
Be specific with numbers and percentages when possible.`;

async function analyzeHiddenCosts(services, region, productionMode, estimatedCosts) {
  const model = genAI.getGenerativeModel({ model: process.env.MODEL || 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}

Analyze this AWS architecture for hidden costs that the user might not expect:

**Region:** ${region}
**Production Mode:** ${productionMode ? 'Yes' : 'No'}
**Services:**
${JSON.stringify(services, null, 2)}

**Current Cost Estimates:**
${JSON.stringify(estimatedCosts, null, 2)}

Identify 3-5 hidden costs that are commonly overlooked. For each:
1. Describe what the cost is
2. Explain why it happens
3. Give a rough monthly estimate

Format your response as markdown with clear sections. Use warning emojis (⚠️) for significant costs.
Focus on practical, real-world costs like:
- NAT Gateway charges
- Data transfer between services
- EBS snapshot storage
- CloudWatch logs and metrics
- Load balancer fees
- Cross-AZ traffic

End with a total estimated hidden cost.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function generateOptimizations(services, region, productionMode, currentCosts) {
  const model = genAI.getGenerativeModel({ model: process.env.MODEL || 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}

Optimize this AWS architecture for cost savings:

**Region:** ${region}
**Production Mode:** ${productionMode ? 'Yes' : 'No'}
**Current Monthly Cost:** $${currentCosts.total.monthly.toFixed(2)}
**Services:**
${JSON.stringify(services, null, 2)}

Provide exactly 3 optimization recommendations. For each:

### 🚀 [Optimization Title]

**Action:** What to do specifically
**Monthly Savings:** $X - $Y (percentage reduction)
**Risk Level:** Low/Medium/High
**Tradeoff:** What you give up

Be specific and practical. Consider:
- Reserved Instances vs On-Demand
- Spot Instances for non-critical workloads
- Right-sizing instances
- S3 storage class optimization
- RDS Reserved Instances
- Regional pricing differences

End with a summary table showing all recommendations.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function runSimulation(services, region, productionMode, currentCosts, userPrompt) {
  const model = genAI.getGenerativeModel({ model: process.env.MODEL || 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}

Simulate a scenario change for this AWS architecture:

**User's Question:** "${userPrompt}"

**Current Setup:**
- Region: ${region}
- Production Mode: ${productionMode ? 'Yes' : 'No'}
- Monthly Cost: $${currentCosts.total.monthly.toFixed(2)}

**Services:**
${JSON.stringify(services, null, 2)}

**Cost Breakdown:**
${JSON.stringify(currentCosts.breakdown, null, 2)}

Analyze the user's scenario and provide:

## 📊 What-If Analysis

### Scenario: [Restate the scenario]

### Current State
- Monthly Cost: $X
- Key metrics

### After Change
- New Monthly Cost: $Y
- Percentage Change: +/-X%

### Impact Analysis
Explain what changes and why the costs change.

### Recommendations
What should the user consider when making this change?

Be specific with numbers. If the user asks about traffic changes, calculate new data transfer costs. If they ask about region changes, show pricing differences.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function analyzeWorkload(services, region, productionMode, currentCosts, workloadDescription) {
  const model = genAI.getGenerativeModel({ model: process.env.MODEL || 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}

The user has described their workload. Analyze it and suggest improvements:

**Workload Description:** 
"${workloadDescription}"

**Current Architecture:**
- Region: ${region}
- Production Mode: ${productionMode ? 'Yes' : 'No'}  
- Monthly Cost: $${currentCosts.total.monthly.toFixed(2)}

**Current Services:**
${JSON.stringify(services, null, 2)}

Provide a comprehensive analysis:

## 🔍 Workload Analysis

### Understanding Your Workload
Summarize what you understand about their application.

### Architecture Assessment
Is their current setup appropriate for this workload? Why or why not?

### Recommendations

#### 1. [First Recommendation]
- What to change
- Why it helps this specific workload
- Estimated impact

#### 2. [Second Recommendation]
Continue...

### Optimized Architecture
Suggest the ideal setup for their workload with estimated monthly cost.

### Cost Comparison
| Current | Optimized | Savings |
|---------|-----------|---------|
| $X | $Y | $Z (%) |

Be practical and specific to their described use case.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

async function explainProductionMode(services, region, baseCost, productionCost) {
  const model = genAI.getGenerativeModel({ model: process.env.MODEL || 'gemini-2.5-flash' });

  const prompt = `${SYSTEM_PROMPT}

Explain why switching to Production Mode increases costs:

**Base Monthly Cost:** $${baseCost.toFixed(2)}
**Production Monthly Cost:** $${productionCost.toFixed(2)}
**Increase:** $${(productionCost - baseCost).toFixed(2)} (+${(((productionCost - baseCost) / baseCost) * 100).toFixed(1)}%)

**Services:**
${JSON.stringify(services, null, 2)}

Explain in clear terms what Production Mode adds:

## 🏭 Production Mode Explained

### Why Production Costs More

Production environments require additional components that development/testing doesn't:

#### 1. Redundancy & High Availability
Explain Multi-AZ, replicas, etc.

#### 2. Backup & Recovery
Automated backups, snapshots, etc.

#### 3. Monitoring & Observability  
CloudWatch, logging, alerting

#### 4. Security
WAF, security groups, etc.

### Cost Breakdown

| Component | Added Cost |
|-----------|------------|
| Redundancy | $X |
| Backups | $Y |
| Monitoring | $Z |
| **Total** | **$W** |

### Is It Worth It?
Brief explanation of why these costs are necessary for production.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = {
  analyzeHiddenCosts,
  generateOptimizations,
  runSimulation,
  analyzeWorkload,
  explainProductionMode
};
