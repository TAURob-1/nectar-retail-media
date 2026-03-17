"""
Generative Widget System for Signal
Claude generates interactive charts/visualizations on-the-fly
"""
import os
import json
import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api", tags=["widgets"])

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")

WIDGET_SYSTEM_PROMPT = """You are a data visualization expert. When asked to visualize data, create interactive HTML widgets.

Output ONLY the widget code in this exact format - no explanation before or after:

```widget
<div style="width:100%; padding:20px;">
  <canvas id="chart"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    // Your Chart.js code here
  </script>
</div>
```

Available libraries (load from CDN):
- Chart.js: https://cdn.jsdelivr.net/npm/chart.js
- D3.js: https://cdn.jsdelivr.net/npm/d3@7
- Plotly: https://cdn.plot.ly/plotly-latest.min.js

Rules:
1. Use clean, modern styling
2. Make charts responsive (width: 100%)
3. Use professional color palettes
4. Include tooltips and legends
5. Keep code self-contained
6. Generate realistic demo data if none provided
"""

class WidgetRequest(BaseModel):
    prompt: str
    company: Optional[str] = None
    data: Optional[dict] = None

class WidgetResponse(BaseModel):
    widget_html: str
    title: str

def extract_widget(text: str) -> str:
    """Extract widget code from Claude's response"""
    if "```widget" in text:
        start = text.find("```widget") + 9
        end = text.find("```", start)
        return text[start:end].strip()
    elif "```html" in text:
        start = text.find("```html") + 7
        end = text.find("```", start)
        return text[start:end].strip()
    elif "<div" in text:
        # Raw HTML
        start = text.find("<div")
        end = text.rfind("</div>") + 6
        return text[start:end]
    return text

@router.post("/widget", response_model=WidgetResponse)
async def generate_widget(request: WidgetRequest):
    """Generate an interactive widget from a prompt"""
    
    if not ANTHROPIC_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")
    
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    
    # Build prompt with context
    prompt = request.prompt
    if request.company:
        prompt = f"For company '{request.company}': {prompt}"
    if request.data:
        prompt += f"\n\nUse this data: {json.dumps(request.data)}"
    
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=WIDGET_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw_response = response.content[0].text
        widget_html = extract_widget(raw_response)
        
        # Generate title from prompt
        title = request.prompt[:50].replace('"', '').replace("'", "")
        if len(request.prompt) > 50:
            title += "..."
        
        return WidgetResponse(
            widget_html=widget_html,
            title=title
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/widget/demo")
async def demo_widget():
    """Return a demo chart widget"""
    return {
        "widget_html": """
<div style="width:100%; max-width:800px; margin:0 auto; padding:20px;">
  <canvas id="demoChart"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    new Chart(document.getElementById('demoChart'), {
      type: 'bar',
      data: {
        labels: ['CarShield', 'Endurance', 'CARCHEX', 'Protect My Car'],
        datasets: [{
          label: 'Market Share %',
          data: [35, 28, 22, 15],
          backgroundColor: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Vehicle Warranty Market Share' }
        }
      }
    });
  </script>
</div>
""",
        "title": "Demo Chart"
    }
