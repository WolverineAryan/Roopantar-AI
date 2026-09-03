from pathlib import Path
from typing import Dict, Any
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def export_to_pdf(format_id: str, content: Dict[str, Any], output_path: Path) -> Path:
    if not isinstance(content, dict):
        content = {}
        
    output_path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0F172A')
    )
    
    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=12,
        spaceAfter=6
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )
    
    meta_style = ParagraphStyle(
        'MetaStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#DC2626') if str(content.get('severity', '')).lower() in ['high', 'critical'] else colors.HexColor('#2563EB')
    )
    
    story = []
    
    title_text = str(content.get("title", content.get("infographic_title", content.get("video_title", "Roopantar-AI Report"))))
    story.append(Paragraph(title_text, title_style))
    story.append(Spacer(1, 4))
    
    # Header metadata
    if format_id == "advisory":
        adv_id = content.get("advisory_id", "ADV-2026-001")
        sev = content.get("severity", "MEDIUM")
        date = content.get("date_issued", "2026-09-02")
        story.append(Paragraph(f"ID: {adv_id} | DATE: {date} | SEVERITY: {str(sev).upper()}", meta_style))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#CBD5E1'), spaceAfter=12))
    
    if format_id == "advisory":
        # Advisory sections
        story.append(Paragraph("1. Executive Overview", h1_style))
        story.append(Paragraph(str(content.get("summary", "")), body_style))
        
        story.append(Paragraph("2. Threat / Incident Breakdown", h1_style))
        for item in content.get("threat_or_issue_breakdown", []):
            if isinstance(item, dict):
                story.append(Paragraph(f"<b>• {item.get('heading', 'Observation')}:</b> {item.get('details', '')}", body_style))
            else:
                story.append(Paragraph(f"• {str(item)}", body_style))
            
        story.append(Paragraph("3. Operational Impact", h1_style))
        story.append(Paragraph(str(content.get("impact_assessment", "")), body_style))
        
        story.append(Paragraph("4. Recommended Mitigations", h1_style))
        table_data = [["Priority", "Target Team", "Action Required"]]
        for action in content.get("recommended_actions", []):
            if isinstance(action, dict):
                table_data.append([
                    str(action.get("priority", "Immediate")),
                    str(action.get("target_team", "Ops")),
                    str(action.get("action", ""))
                ])
            else:
                table_data.append(["Immediate", "SecOps", str(action)])
            
        if len(table_data) > 1:
            t = Table(table_data, colWidths=[80, 100, 350])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F1F5F9')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ]))
            story.append(t)
            story.append(Spacer(1, 10))
            
    elif format_id == "executive_summary":
        story.append(Paragraph("1. Strategic Context", h1_style))
        story.append(Paragraph(str(content.get("strategic_context", "")), body_style))
        
        story.append(Paragraph("2. Bottom Line Up Front (BLUF)", h1_style))
        story.append(Paragraph(f"<b>{str(content.get('bottom_line_up_front', ''))}</b>", body_style))
        
        story.append(Paragraph("3. Key Findings", h1_style))
        for item in content.get("key_findings", []):
            if isinstance(item, dict):
                story.append(Paragraph(f"<b>• {item.get('area', 'Finding')}:</b> {item.get('observation', '')} (<i>Impact: {item.get('business_or_mission_impact', '')}</i>)", body_style))
            else:
                story.append(Paragraph(f"• Finding: {str(item)}", body_style))
            
        story.append(Paragraph("4. Decision Requirements", h1_style))
        for item in content.get("decision_and_action_requirements", []):
            if isinstance(item, dict):
                story.append(Paragraph(f"<b>• Decision:</b> {item.get('decision_needed', '')} (Owner: {item.get('stakeholder', '')} | Timeline: {item.get('timeline', '')})", body_style))
            else:
                story.append(Paragraph(f"• Decision: {str(item)}", body_style))

    else:
        for k, v in content.items():
            if isinstance(v, str):
                story.append(Paragraph(k.replace('_', ' ').title(), h1_style))
                story.append(Paragraph(v, body_style))
            elif isinstance(v, list):
                story.append(Paragraph(k.replace('_', ' ').title(), h1_style))
                for item in v:
                    story.append(Paragraph(f"• {str(item)}", body_style))
                    
    # Footer notice
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#E2E8F0'), spaceAfter=6))
    story.append(Paragraph("Roopantar-AI • Enterprise Intelligence Platform", ParagraphStyle('Foot', parent=styles['Normal'], fontSize=8, textColor=colors.HexColor('#94A3B8'))))
    
    doc.build(story)
    return output_path
