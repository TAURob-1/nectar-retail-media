"""
Nectar Retail Media Agent Builder — FastAPI Backend
Powered by Claude Sonnet + TAU Signal components
"""
import os
import json
import logging
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic

# Import reused Signal components
from widgets import router as widget_router
from ppt import router as ppt_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nectar Retail Media Agent Builder", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Signal routers
app.include_router(widget_router)
app.include_router(ppt_router)

# Load mock Nectar data
DATA_PATH = Path(__file__).parent.parent / "data" / "mock_nectar.json"
with open(DATA_PATH) as f:
    NECTAR_DATA = json.load(f)

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")

# Sainsbury's brand palette for agent context
NECTAR_PALETTE = {
    "orange": "#F06C00",
    "purple": "#663399",
    "green": "#00843D",
    "white": "#FFFFFF",
    "dark": "#1A1A1A",
    "light_orange": "#FFE0C0",
    "light_purple": "#E8D5F5"
}

# ─── Agent Schema ───────────────────────────────────────────────────────────

class AgentRequest(BaseModel):
    prompt: Optional[str] = ""
    channel: Optional[str] = "all"  # In-Store | On-Site | Off-Site | all
    time_range: Optional[str] = "Q1 2026"
    preset: Optional[str] = None  # shelf-share | channel-attribution | promo-performance | clv

class MetricCard(BaseModel):
    label: str
    value: str
    delta: Optional[str] = None
    trend: Optional[str] = None  # up | down | flat

class ChartSuggestion(BaseModel):
    type: str          # bar | line | pie | doughnut | scatter
    title: str
    description: str
    data_key: str      # key into mock data to use for chart generation

class AgentResponse(BaseModel):
    title: str
    summary: str
    metrics: List[dict]
    suggestedCharts: List[dict]
    recommendations: List[str]
    data_context: Optional[dict] = None


# ─── System Prompt ───────────────────────────────────────────────────────────

def build_system_prompt(channel: str, time_range: str) -> str:
    channel_filter = NECTAR_DATA["channel_performance"].get(channel, NECTAR_DATA["channel_performance"])
    return f"""You are the Nectar Retail Media Intelligence Agent for Sainsbury's.

You have access to Nectar loyalty data and retail media performance data for {time_range}.
Channel filter: {channel if channel != 'all' else 'All Channels (In-Store, On-Site, Off-Site)'}

LIVE DATA CONTEXT:
{json.dumps({
    "channel_performance": channel_filter if channel != "all" else NECTAR_DATA["channel_performance"],
    "top_categories": NECTAR_DATA["top_categories_by_roas"],
    "promo_campaigns": NECTAR_DATA["promo_campaigns"],
    "customer_segments": NECTAR_DATA["customer_segments"],
    "weekly_trends": NECTAR_DATA["weekly_trends"]
}, indent=2)}

Your job is to analyse the data and respond in this EXACT JSON format (no markdown, raw JSON only):

{{
  "title": "Short descriptive title (max 8 words)",
  "summary": "2-3 sentence executive summary with key insight",
  "metrics": [
    {{"label": "Metric Name", "value": "formatted value", "delta": "+12%", "trend": "up"}},
    ... (3-6 metrics most relevant to the query)
  ],
  "suggestedCharts": [
    {{
      "type": "bar|line|pie|doughnut",
      "title": "Chart title",
      "description": "What this chart shows and why it matters",
      "prompt": "Detailed chart generation prompt including specific data values to visualise",
      "data_key": "channel_performance|weekly_trends|categories|promos"
    }},
    ... (2-3 chart suggestions)
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ]
}}

Be specific. Use real numbers from the data. Recommendations must be actionable for a retail media buyer.
"""


# ─── Preset Prompts ──────────────────────────────────────────────────────────

PRESETS = {
    "shelf-share": "Analyse shelf share performance across all In-Store placements. Show which categories are winning premium eye-level positions and their impact on conversion rates.",
    "channel-attribution": "Show full channel attribution across In-Store, On-Site and Off-Site. Break down ROAS, impressions, and conversions by channel. Highlight the most efficient channel mix.",
    "promo-performance": "Analyse all promotional campaigns in the period. Show which promos drove the highest sales uplift and which SKUs benefited most. Compare promo vs non-promo baseline.",
    "clv": "Analyse customer lifetime value by Nectar loyalty segment. Show basket size, frequency, and Nectar points accumulation. Identify which segments offer the best retail media targeting opportunity."
}


# ─── Routes ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "nectar-retail-media-agent"}

@app.get("/api/data/summary")
def data_summary():
    """Return top-level data summary for frontend initialisation"""
    cp = NECTAR_DATA["channel_performance"]
    total_revenue = sum(cp[c]["revenue"] for c in cp)
    total_impressions = sum(cp[c]["impressions"] for c in cp)
    return {
        "total_revenue": total_revenue,
        "total_impressions": total_impressions,
        "channels": list(cp.keys()),
        "reporting_period": NECTAR_DATA["reporting_period"],
        "top_category": NECTAR_DATA["top_categories_by_roas"][0],
        "best_roas_channel": max(cp.keys(), key=lambda c: cp[c]["roas"]),
        "skus_count": len(NECTAR_DATA["skus"])
    }

@app.get("/api/data/raw")
def raw_data():
    """Return full mock dataset for chart generation"""
    return NECTAR_DATA

@app.post("/api/agent", response_model=AgentResponse)
async def run_agent(request: AgentRequest):
    """Run the retail media intelligence agent"""
    if not ANTHROPIC_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    # Use preset if provided
    user_prompt = request.prompt
    if request.preset and request.preset in PRESETS:
        user_prompt = PRESETS[request.preset]
        if request.prompt:
            user_prompt = f"{user_prompt}\n\nAdditional context: {request.prompt}"

    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=build_system_prompt(request.channel, request.time_range),
            messages=[{"role": "user", "content": user_prompt}]
        )

        raw = response.content[0].text.strip()

        # Strip markdown if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        data = json.loads(raw)
        return AgentResponse(**data)

    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error: {e}\nRaw: {raw}")
        raise HTTPException(status_code=500, detail=f"Agent returned invalid JSON: {str(e)}")
    except Exception as e:
        logger.error(f"Agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/widget/nectar")
async def generate_nectar_widget(request: dict):
    """Generate a Nectar-branded chart widget"""
    prompt = request.get("prompt", "")
    data_key = request.get("data_key", "channel_performance")
    chart_type = request.get("type", "bar")

    # Inject Nectar palette and data into the prompt
    data_context = NECTAR_DATA.get(
        {"channel_performance": "channel_performance",
         "weekly_trends": "weekly_trends",
         "categories": "top_categories_by_roas",
         "promos": "promo_campaigns"}.get(data_key, "channel_performance"), {}
    )

    enhanced_prompt = f"""Create a {chart_type} chart for Nectar / Sainsbury's retail media.

{prompt}

Use this EXACT data (do not generate random data):
{json.dumps(data_context, indent=2)}

Colour palette (use these Sainsbury's/Nectar brand colours):
- Primary bars/lines: #F06C00 (Nectar Orange)
- Secondary: #663399 (Nectar Purple)  
- Accent: #00843D (Sainsbury's Green)
- Background: #FFFFFF
- Grid/text: #666666

Style requirements:
- Clean, professional, pitch-ready
- Responsive width: 100%
- Include Nectar data labels on hover
- Smooth animations
- Legend at bottom
"""

    if not ANTHROPIC_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

    widget_system = """You are a data visualization expert creating retail media charts for Sainsbury's Nectar pitch deck.

Output ONLY widget code in this exact format:

```widget
<div style="width:100%; padding:20px; font-family: 'Segoe UI', Arial, sans-serif;">
  <canvas id="chart_UNIQUE_ID"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script>
    // Chart.js code here using the provided data
  </script>
</div>
```

Replace UNIQUE_ID with a random string to avoid canvas ID conflicts. Use the exact data provided - do not make up numbers."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=widget_system,
            messages=[{"role": "user", "content": enhanced_prompt}]
        )

        raw = response.content[0].text
        from widgets import extract_widget
        widget_html = extract_widget(raw)
        title = prompt.split(".")[0][:60] if prompt else "Nectar Retail Media Chart"

        return {"widget_html": widget_html, "title": title}

    except Exception as e:
        logger.error(f"Widget error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
