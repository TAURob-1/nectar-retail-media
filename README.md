# 🛒 Nectar Retail Media Agent Builder

A one-page app for retail media buyers at Sainsbury's Nectar to create custom agents that generate dynamic reports, charts, and PowerPoint decks on the fly.

**Built for: Sainsbury's Nectar pitch — powered by TAU Signal**

---

## Architecture

```
┌─────────────────────────────────────┐
│  React/Vite UI (port 5173)          │
│  ┌──────────────┐  ┌─────────────┐  │
│  │ AgentBuilder │  │  Dashboard  │  │
│  │ - Prompt     │  │ - Metrics   │  │
│  │ - Presets    │  │ - Charts    │  │
│  │ - Channel    │  │ - Recs      │  │
│  └──────┬───────┘  └──────┬──────┘  │
└─────────┼─────────────────┼─────────┘
          │  /api/agent     │  /api/widget/nectar
          ▼                 ▼  /api/ppt/generate
┌─────────────────────────────────────┐
│  FastAPI Backend (port 8001)         │
│  ┌──────────┐ ┌─────────┐ ┌───────┐ │
│  │  Agent   │ │ Widgets │ │  PPT  │ │
│  │ (Claude  │ │ (Chart  │ │ Gen   │ │
│  │ Sonnet)  │ │  Gen)   │ │       │ │
│  └──────────┘ └─────────┘ └───────┘ │
│  Mock Nectar Data (25 SKUs, 3 ch)    │
└─────────────────────────────────────┘
```

## Quick Start

```bash
cd /home/r2/nectar-retail-media

# Ensure ANTHROPIC_API_KEY is set
export ANTHROPIC_API_KEY=your_key_here

# One-command startup
./start.sh
```

Then open: **http://localhost:5173**

## Features

### Agent Builder UI
- 🎯 **4 preset quick-actions**: Shelf Share Trends, Channel Attribution, Promo Performance, CLV
- ✍️ **Free-text prompt**: Any natural language question about Nectar data
- 📅 **Channel + time filters**
- ⚡ **Run Agent button** → instant structured response

### Dynamic Dashboard
- 📊 **Metrics Grid**: KPI cards with trend indicators (up/down/flat)
- 📈 **Chart Panel**: Click "Generate Chart" → Claude builds branded Chart.js visualisation
- 💡 **Recommendations**: 3 actionable agent-generated insights
- 📥 **Create Deck**: Downloads branded .pptx with all insights

### Data
- 25 real-world CPG SKUs (Pepsi, Walkers, Cadbury, etc.)
- 3 channels: In-Store, On-Site, Off-Site
- 12-week trend data, 5 promo campaigns, 4 customer segments
- Category ROAS rankings

## Presets

| Preset | Description |
|--------|-------------|
| 🏪 Shelf Share Trends | In-Store placement performance & category wins |
| 📊 Channel Attribution | Full ROAS breakdown across all 3 channels |
| 🎯 Promo Performance | Campaign uplifts, SKU winners & ROI |
| 💎 CLV by Segment | Nectar loyalty tiers & targeting opportunity |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health check |
| `/api/data/summary` | GET | Top-level data summary |
| `/api/data/raw` | GET | Full mock dataset |
| `/api/agent` | POST | Run retail media agent |
| `/api/widget/nectar` | POST | Generate branded chart |
| `/api/ppt/generate` | POST | Generate branded .pptx |
| `/api/widget` | POST | Raw widget generation (Signal) |

## Tech Stack
- **Frontend**: React 18, Vite, Chart.js
- **Backend**: FastAPI, Claude Sonnet 4, python-pptx
- **Data**: Mock Nectar JSON (Supabase-ready)
- **Proxy**: Express (production), Vite proxy (dev)

## Environment Variables

```bash
ANTHROPIC_API_KEY=sk-ant-...   # Required
PORT=3000                       # Express proxy (optional)
API_URL=http://localhost:8001   # FastAPI URL (optional)
```

---

*Built by R2 for TAU · Sainsbury's Nectar Retail Media Showcase*
