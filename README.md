# ☁️ CloudCart AI

> **An AI-powered cloud cost planner that exposes hidden AWS costs and provides intelligent optimization suggestions before deployment.**

![CloudCart AI](https://img.shields.io/badge/Hackathon-AI%20Agents%20Assemble-blueviolet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![Express](https://img.shields.io/badge/Express-4.18-green?style=flat-square)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-blue?style=flat-square)

## 🎯 Problem Statement

**Traditional cloud cost calculators fail because they:**
- Only show surface-level pricing
- Ignore hidden costs like data transfer, NAT Gateway, and cross-region traffic
- Don't account for production infrastructure overhead
- Provide no optimization guidance
- Require expertise to interpret

**CloudCart AI solves this by:**
- Simulating real-world production usage
- Exposing hidden costs with AI analysis
- Providing actionable optimization suggestions
- Offering "What-If" scenario planning
- Making cloud costs understandable in 30 seconds

## ✨ Features

### 🛒 E-Commerce Style Interface
Configure AWS services like products:
- **EC2** - Instance types, pricing (On-Demand/Spot), OS, hours/day
- **S3** - Storage classes, size, request volume
- **RDS** - Engine (Postgres/MySQL), instance types, Multi-AZ
- **Data Transfer** - Ingress/Egress estimation

### 💰 Real-Time Cost Calculation
- Hourly, daily, monthly cost breakdown
- Category breakdown: Compute, Storage, Network, Hidden
- Visual charts (Doughnut & Bar)

### 🏭 Production Mode Toggle
One-click to see real production costs:
- Backups & disaster recovery
- Monitoring & alerting overhead
- Logging infrastructure
- Redundancy requirements

**Costs increase 30-50%** - just like real AWS!

### 🤖 AI Architecture Advisor (Gemini-Powered)

| Feature | Description |
|---------|-------------|
| 🔍 Hidden Cost Detection | Finds NAT Gateway, data transfer, cross-region costs |
| 🚀 Optimization Engine | 3 actionable suggestions with savings & tradeoffs |
| 🔮 What-If Simulation | "What if traffic doubles?" "What if I use spot?" |
| 💡 Workload Analysis | Describe your app, get architecture recommendations |

### 🎪 Demo Mode
One-click demo architecture for judges:
- Pre-configured production-ready setup
- Instant cost visualization
- Ready for AI analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd AgentAssemble

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

Backend `.env` is pre-configured. For production, update:
```env
GEMINI_API_KEY=your_api_key
MODEL=gemini-2.5-flash
PORT=3001
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Demo Flow

1. **Open the app** → See the Service Catalog
2. **Click "Load Demo Architecture"** → Pre-fills a realistic production setup
3. **Go to Cart** → See cost breakdown with charts
4. **Toggle Production Mode** → Watch costs increase with AI explanation
5. **Click "Detect Hidden Costs"** → AI reveals hidden expenses
6. **Click "Optimize Architecture"** → Get 3 actionable savings recommendations
7. **Try What-If** → Ask "What if traffic doubles?" 

## 🏗️ Architecture

![CloudCart AI Architecture](architecture.png)

## 🧠 AI Reasoning

The AI is prompted as a **senior AWS cost optimization architect** with expertise in:

- Real-world production infrastructure
- Hidden cost patterns (data transfer, NAT, cross-AZ)
- Optimization strategies (Reserved, Spot, right-sizing)
- Tradeoff analysis (cost vs. reliability vs. performance)

Responses are formatted in **Markdown** for clear, actionable insights.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, Chart.js |
| Backend | Express.js, Node.js |
| AI | Google Gemini 2.5 Flash |
| Styling | Vanilla CSS (Dark Theme) |
| Deployment | Vercel (Frontend), AWS (Backend) |

## 📁 Project Structure

```
AgentAssemble/
├── backend/
│   ├── server.js              # Express entry point
│   ├── services/
│   │   ├── pricingEngine.js   # Cost calculation logic
│   │   └── geminiService.js   # AI integration
│   └── data/
│       └── pricing.json       # AWS pricing data
├── frontend/
│   ├── pages/
│   │   ├── index.js           # Service Catalog
│   │   └── cart.js            # Cart + Cost + AI
│   ├── components/
│   │   ├── ServiceCard.jsx    # Service configuration
│   │   ├── CostChart.jsx      # Visualizations
│   │   └── AIInsightsPanel.jsx
│   └── context/
│       └── CartContext.jsx    # Global state
└── README.md
```


**Built with 💜 by Rajat Rulaniya**
