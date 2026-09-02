from pathlib import Path
from typing import Dict, Any
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def export_presentation_to_pptx(content: Dict[str, Any], output_path: Path) -> Path:
    prs = Presentation()
    
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    slides_data = content.get("slides", [])
    deck_title = content.get("deck_title", "Roopantar-AI Presentation Deck")
    subtitle = content.get("subtitle", "Automated Content Transformation Briefing")
    
    # Colors
    primary_color = RGBColor(15, 23, 42)      # Slate 900
    accent_color = RGBColor(37, 99, 235)      # Blue 600
    text_color = RGBColor(51, 65, 85)         # Slate 700
    white_color = RGBColor(255, 255, 255)
    
    blank_slide_layout = prs.slide_layouts[6]
    
    for i, slide_data in enumerate(slides_data):
        slide = prs.slides.add_slide(blank_slide_layout)
        
        slide_title = slide_data.get("title", f"Slide {i+1}")
        bullet_points = slide_data.get("bullet_points", [])
        speaker_notes = slide_data.get("speaker_notes", "")
        slide_type = slide_data.get("slide_type", "Content")
        
        # Add Speaker Notes
        if speaker_notes:
            notes_slide = slide.notes_slide
            text_frame = notes_slide.notes_text_frame
            text_frame.text = speaker_notes
            
        if i == 0 or slide_type == "Title":
            # Title Slide Layout - Dark Blue background banner
            bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
            bg_shape.fill.solid()
            bg_shape.fill.fore_color.rgb = primary_color
            bg_shape.line.fill.background()
            
            # Accent bar
            bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.2), Inches(2.2), Inches(0.15), Inches(3.0))
            bar.fill.solid()
            bar.fill.fore_color.rgb = accent_color
            bar.line.fill.background()
            
            # Title & Subtitle Box
            txBox = slide.shapes.add_textbox(Inches(1.6), Inches(2.0), Inches(10.5), Inches(3.5))
            tf = txBox.text_frame
            tf.word_wrap = True
            
            p = tf.paragraphs[0]
            p.text = slide_title
            p.font.size = Pt(40)
            p.font.bold = True
            p.font.color.rgb = white_color
            
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.size = Pt(22)
            p2.font.color.rgb = RGBColor(148, 163, 184) # Slate 400
            p2.space_before = Pt(14)
            
            if bullet_points:
                p3 = tf.add_paragraph()
                p3.text = " • ".join(bullet_points)
                p3.font.size = Pt(15)
                p3.font.color.rgb = RGBColor(203, 213, 225)
                p3.space_before = Pt(20)
                
        else:
            # Content Slide Layout
            # Top Banner Shape
            top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(1.4))
            top_bar.fill.solid()
            top_bar.fill.fore_color.rgb = primary_color
            top_bar.line.fill.background()
            
            # Title Text
            title_box = slide.shapes.add_textbox(Inches(1.0), Inches(0.35), Inches(11.333), Inches(0.8))
            tf_title = title_box.text_frame
            tf_title.word_wrap = True
            p_title = tf_title.paragraphs[0]
            p_title.text = slide_title
            p_title.font.size = Pt(28)
            p_title.font.bold = True
            p_title.font.color.rgb = white_color
            
            # Main Content Box
            content_box = slide.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(10.8), Inches(4.5))
            tf_content = content_box.text_frame
            tf_content.word_wrap = True
            
            for j, bp in enumerate(bullet_points):
                p = tf_content.paragraphs[0] if j == 0 else tf_content.add_paragraph()
                p.text = f"•  {bp}"
                p.font.size = Pt(20)
                p.font.color.rgb = text_color
                p.space_after = Pt(16)
                p.line_spacing = 1.2
                
            # Footer tag
            footer_box = slide.shapes.add_textbox(Inches(1.0), Inches(6.8), Inches(11.333), Inches(0.4))
            tf_footer = footer_box.text_frame
            p_footer = tf_footer.paragraphs[0]
            p_footer.text = f"Roopantar-AI | SIH26154 | Slide {i+1} of {len(slides_data)}"
            p_footer.font.size = Pt(10)
            p_footer.font.color.rgb = RGBColor(148, 163, 184)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(output_path))
    return output_path
