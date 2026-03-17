"""
PowerPoint Generator for Signal
Creates TAU-branded presentations from data/prompts
"""
import os
import io
import json
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List
import anthropic

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    PPTX_AVAILABLE = True
except ImportError:
    PPTX_AVAILABLE = False

router = APIRouter(prefix="/api", tags=["ppt"])

# TAU Branding
TAU_NAVY = RGBColor(0x00, 0x33, 0x66) if PPTX_AVAILABLE else None
TAU_BLUE = RGBColor(0x33, 0x85, 0xD6) if PPTX_AVAILABLE else None
TAU_LIGHT = RGBColor(0x66, 0xA3, 0xE0) if PPTX_AVAILABLE else None

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY")

class SlideContent(BaseModel):
    title: str
    bullets: List[str] = []
    notes: Optional[str] = None

class PPTRequest(BaseModel):
    title: str
    subtitle: Optional[str] = None
    company: Optional[str] = None
    prompt: Optional[str] = None
    slides: Optional[List[SlideContent]] = None
    context_data: Optional[dict] = None
    include_signal_data: bool = False

def generate_slides_from_prompt(prompt: str, company: str = None, context_data: Optional[dict] = None) -> List[dict]:
    """Use Claude to generate slide content"""
    if not ANTHROPIC_KEY:
        return []
    
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    
    system = """Generate presentation slides as JSON. Output ONLY valid JSON array.
    
Format:
[
  {"title": "Slide Title", "bullets": ["Point 1", "Point 2", "Point 3"], "notes": "Speaker notes"},
  ...
]

Rules:
- 4-6 slides max
- 3-5 bullets per slide
- Keep bullets concise (under 15 words)
- Professional business tone
"""
    
    user_prompt = prompt
    if company:
        user_prompt = f"For {company}: {prompt}"
    if context_data:
        user_prompt += f"\n\nUse this structured context data directly where relevant: {json.dumps(context_data)}"
    
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=2000,
            system=system,
            messages=[{"role": "user", "content": user_prompt}]
        )
        
        text = response.content[0].text
        # Extract JSON from response
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        
        return json.loads(text)
    except Exception as e:
        print(f"Claude error: {e}")
        return []

def create_ppt(request: PPTRequest) -> io.BytesIO:
    """Create a PowerPoint presentation"""
    if not PPTX_AVAILABLE:
        raise HTTPException(status_code=500, detail="python-pptx not installed")
    
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Title slide
    title_slide_layout = prs.slide_layouts[6]  # Blank
    slide = prs.slides.add_slide(title_slide_layout)
    
    # Add title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(2.5), Inches(12.333), Inches(1.5))
    title_frame = title_box.text_frame
    title_para = title_frame.paragraphs[0]
    title_para.text = request.title
    title_para.font.size = Pt(44)
    title_para.font.bold = True
    title_para.font.color.rgb = TAU_NAVY
    title_para.alignment = PP_ALIGN.CENTER
    
    # Add subtitle
    if request.subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.5), Inches(4), Inches(12.333), Inches(1))
        sub_frame = sub_box.text_frame
        sub_para = sub_frame.paragraphs[0]
        sub_para.text = request.subtitle
        sub_para.font.size = Pt(24)
        sub_para.font.color.rgb = TAU_BLUE
        sub_para.alignment = PP_ALIGN.CENTER
    
    # Add TAU branding
    brand_box = slide.shapes.add_textbox(Inches(0.5), Inches(6.5), Inches(12.333), Inches(0.5))
    brand_frame = brand_box.text_frame
    brand_para = brand_frame.paragraphs[0]
    brand_para.text = "TAU — The Independent Marketing Intelligence Architect"
    brand_para.font.size = Pt(14)
    brand_para.font.color.rgb = TAU_LIGHT
    brand_para.alignment = PP_ALIGN.CENTER
    
    # Generate slides from prompt if provided
    slides_content = request.slides or []
    if request.prompt and not slides_content:
        generated = generate_slides_from_prompt(request.prompt, request.company, request.context_data)
        slides_content = [SlideContent(**s) for s in generated]
    
    # Add content slides
    for slide_data in slides_content:
        content_layout = prs.slide_layouts[6]  # Blank
        content_slide = prs.slides.add_slide(content_layout)
        
        # Title
        title_box = content_slide.shapes.add_textbox(Inches(0.5), Inches(0.5), Inches(12.333), Inches(1))
        tf = title_box.text_frame
        p = tf.paragraphs[0]
        p.text = slide_data.title
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.color.rgb = TAU_NAVY
        
        # Bullets
        if slide_data.bullets:
            bullet_box = content_slide.shapes.add_textbox(Inches(0.75), Inches(1.75), Inches(11.5), Inches(5))
            tf = bullet_box.text_frame
            tf.word_wrap = True
            
            for i, bullet in enumerate(slide_data.bullets):
                if i == 0:
                    p = tf.paragraphs[0]
                else:
                    p = tf.add_paragraph()
                p.text = f"• {bullet}"
                p.font.size = Pt(20)
                p.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
                p.space_after = Pt(12)
        
        # Notes
        if slide_data.notes:
            notes_slide = content_slide.notes_slide
            notes_slide.notes_text_frame.text = slide_data.notes
    
    # Save to buffer
    buffer = io.BytesIO()
    prs.save(buffer)
    buffer.seek(0)
    return buffer

@router.post("/ppt/generate")
async def generate_ppt(request: PPTRequest):
    """Generate a PowerPoint presentation"""
    try:
        buffer = create_ppt(request)
        
        filename = f"{request.title.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.pptx"
        
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ppt/preview")
async def preview_ppt(request: PPTRequest):
    """Preview slide content without generating file"""
    slides_content = request.slides or []
    
    if request.prompt and not slides_content:
        generated = generate_slides_from_prompt(request.prompt, request.company, request.context_data)
        slides_content = generated
    
    return {
        "title": request.title,
        "subtitle": request.subtitle,
        "slides": slides_content,
        "slide_count": len(slides_content) + 1  # +1 for title slide
    }
