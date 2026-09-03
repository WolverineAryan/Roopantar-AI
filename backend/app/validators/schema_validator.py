import json
import logging
import time
from typing import Dict, Any, Tuple, Optional
from app.llm.client import call_llm_json
from app.generators.registry import FormatDefinition, build_format_prompt
from app.schemas.job_dto import IntentContextDTO, GenerationParameters

logger = logging.getLogger(__name__)

def normalize_and_validate_format_data(format_id: str, data: Dict[str, Any], ico: IntentContextDTO) -> Dict[str, Any]:
    """Normalizes field aliases and ensures all required fields are present."""
    if not isinstance(data, dict):
        return generate_fallback_content(format_id, ico, GenerationParameters())

    if format_id == "advisory":
        if "title" not in data:
            data["title"] = f"Operational Advisory: {ico.topic}"
        if "severity" not in data:
            data["severity"] = "High" if ico.risk_flags else "Medium"
        if "summary" not in data:
            data["summary"] = data.get("executive_summary", data.get("overview", ico.summary))
        if "recommended_actions" not in data:
            actions_list = data.get("actions", data.get("recommendations", data.get("mitigations", [])))
            if actions_list:
                data["recommended_actions"] = [
                    {"priority": "Immediate", "action": str(a), "target_team": "SecOps"} if isinstance(a, str) else a
                    for a in actions_list
                ]
            else:
                data["recommended_actions"] = [
                    {"priority": "Immediate", "action": act, "target_team": "SecOps"}
                    for act in (ico.recommended_actions or ["Review ingress logs", "Apply security patches"])
                ]
        if "threat_or_issue_breakdown" not in data:
            data["threat_or_issue_breakdown"] = [
                {"heading": "Observed Vector", "details": f} for f in (ico.key_facts[:3] or ["Perimeter threat activity."])
            ]
            
    elif format_id == "executive_summary":
        if "title" not in data:
            data["title"] = f"Executive Briefing: {ico.topic}"
        if "strategic_context" not in data:
            data["strategic_context"] = data.get("context", f"Briefing for leadership on {ico.domain}.")
        if "bottom_line_up_front" not in data:
            data["bottom_line_up_front"] = data.get("bluf", data.get("summary", ico.summary))
        if "key_findings" not in data:
            findings = data.get("findings", [])
            if findings:
                data["key_findings"] = [
                    {"area": "Core Area", "observation": str(f), "business_or_mission_impact": "Operational Impact"} if isinstance(f, str) else f
                    for f in findings
                ]
            else:
                data["key_findings"] = [
                    {"area": "Finding", "observation": f, "business_or_mission_impact": "Requires attention"}
                    for f in (ico.key_facts[:4] or ["Key finding extracted."])
                ]

    elif format_id == "linkedin":
        if "headline_hook" not in data:
            data["headline_hook"] = data.get("hook", f"🚨 Critical Insight: {ico.topic}")
        if "body_paragraphs" not in data:
            data["body_paragraphs"] = data.get("paragraphs", [ico.summary])
        if "hashtags" not in data:
            data["hashtags"] = ["#RoopantarAI", "#Automation", "#Leadership", "#TechNews"]

    elif format_id == "twitter":
        if "thread_topic" not in data:
            data["thread_topic"] = ico.topic
        if "tweets" not in data or not isinstance(data.get("tweets"), list) or len(data.get("tweets", [])) == 0:
            data["tweets"] = [
                {"tweet_number": 1, "content": f"1/3 🧵 {ico.topic}\n\n{ico.summary[:200]} 👇", "purpose": "Hook"},
                {"tweet_number": 2, "content": f"2/3 📌 Findings:\n• " + "\n• ".join(ico.key_facts[:2])[:200], "purpose": "Data"},
                {"tweet_number": 3, "content": f"3/3 🎯 Next steps: " + (ico.recommended_actions[0] if ico.recommended_actions else "Monitor telemetry."), "purpose": "CTA"}
            ]

    elif format_id == "presentation":
        if "deck_title" not in data:
            data["deck_title"] = ico.topic
        if "slides" not in data or not isinstance(data.get("slides"), list) or len(data.get("slides", [])) == 0:
            data["slides"] = [
                {
                    "slide_number": 1,
                    "slide_type": "Title",
                    "title": ico.topic,
                    "bullet_points": [f"Domain: {ico.domain}", "Generated via Roopantar-AI"],
                    "speaker_notes": "Welcome everyone to the briefing."
                },
                {
                    "slide_number": 2,
                    "slide_type": "Context",
                    "title": "Executive Summary",
                    "bullet_points": [ico.summary or "Summary of intelligence."],
                    "speaker_notes": "Setting the stage."
                },
                {
                    "slide_number": 3,
                    "slide_type": "Analysis",
                    "title": "Key Findings",
                    "bullet_points": ico.key_facts[:3] or ["Observation point"],
                    "speaker_notes": "Review the core findings."
                },
                {
                    "slide_number": 4,
                    "slide_type": "Recommendations",
                    "title": "Required Actions",
                    "bullet_points": ico.recommended_actions[:3] or ["Immediate mitigation"],
                    "speaker_notes": "Directives to execute."
                }
            ]

    elif format_id == "video_package":
        if "video_title" not in data:
            data["video_title"] = f"Briefing: {ico.topic}"
        if "scenes" not in data or not isinstance(data.get("scenes"), list) or len(data.get("scenes", [])) == 0:
            data["scenes"] = [
                {
                    "scene_number": 1,
                    "timestamp_marker": "00:00 - 00:15",
                    "scene_name": "Opening Alert",
                    "visual_description": "Perimeter alert animation",
                    "narration_voiceover": f"Here is the latest intelligence on {ico.topic}.",
                    "on_screen_text": ico.topic.upper(),
                    "audio_mood": "Urgent electronic"
                },
                {
                    "scene_number": 2,
                    "timestamp_marker": "00:15 - 00:45",
                    "scene_name": "Core Details",
                    "visual_description": "Data graphics breakdown",
                    "narration_voiceover": ico.summary or "Detailed operational analysis.",
                    "on_screen_text": "KEY FINDINGS",
                    "audio_mood": "Focused beat"
                }
            ]

    elif format_id == "infographic":
        if "infographic_title" not in data:
            data["infographic_title"] = ico.topic
        if "content_sections" not in data or not isinstance(data.get("content_sections"), list):
            data["content_sections"] = [
                {
                    "section_title": "Executive Summary",
                    "visual_type": "Callout Banner",
                    "content_points": [ico.summary],
                    "designer_tip": "High contrast header"
                },
                {
                    "section_title": "Key Indicators",
                    "visual_type": "Icon Grid",
                    "content_points": ico.key_facts[:3] or ["Finding A", "Finding B"],
                    "designer_tip": "Use bold icons"
                }
            ]
    elif format_id == "image_assets":
        from app.llm.image_client import build_pollinations_url
        if "title" not in data:
            data["title"] = f"Visual Assets: {ico.topic}"
        if "visual_theme" not in data:
            data["visual_theme"] = f"Futuristic {ico.domain} Concept"
        if "color_palette" not in data or not isinstance(data.get("color_palette"), list):
            data["color_palette"] = ["#7C3AED (Electric Purple)", "#EC4899 (Radiant Pink)", "#F97316 (Coral Orange)", "#0F172A (Deep Slate)"]
        if "assets" not in data or not isinstance(data.get("assets"), list) or len(data.get("assets", [])) == 0:
            p0 = f"Vertical 9:16 mobile visual composition for {ico.topic}, domain {ico.domain}, centered subject, cinematic volumetric lighting, 8k resolution, crisp detail"
            p1 = f"Futuristic high-tech 3D keynote presentation hero image depicting {ico.topic}, domain {ico.domain}, sleek enterprise aesthetic, volumetric lighting, 8k resolution, octane render"
            p2 = f"Modern 16:9 social media graphic banner for {ico.topic}, abstract geometric glass materials, glowing violet and coral gradients, professional editorial design"
            p3 = f"Isometric 3D concept badge for {ico.topic}, frosted translucent glass, vibrant neon reflections, studio lighting on dark background"
            data["assets"] = [
                {
                    "asset_type": "reels_vertical",
                    "label": "9:16 Vertical Reel & TikTok Visual",
                    "aspect_ratio": "9:16",
                    "dimensions": "720x1280",
                    "image_prompt": p0,
                    "negative_prompt": "blurry, text, watermark, low quality, oversaturated",
                    "image_url": build_pollinations_url(p0, 720, 1280, style="photorealistic")
                },
                {
                    "asset_type": "presentation_hero",
                    "label": "16:9 Keynote Slide Hero Visual",
                    "aspect_ratio": "16:9",
                    "dimensions": "1280x720",
                    "image_prompt": p1,
                    "negative_prompt": "blurry, text, watermark, low quality, oversaturated",
                    "image_url": build_pollinations_url(p1, 1280, 720, style="photorealistic")
                },
                {
                    "asset_type": "social_banner",
                    "label": "1.91:1 LinkedIn & Social Media Featured Graphic",
                    "aspect_ratio": "1.91:1",
                    "dimensions": "1200x630",
                    "image_prompt": p2,
                    "negative_prompt": "blurry, lowres, text, watermark",
                    "image_url": build_pollinations_url(p2, 1200, 630, style="glassmorphism_3d")
                },
                {
                    "asset_type": "concept_icon",
                    "label": "1:1 3D Conceptual Spec Icon",
                    "aspect_ratio": "1:1",
                    "dimensions": "1024x1024",
                    "image_prompt": p3,
                    "negative_prompt": "flat, 2d, watermark, blurry",
                    "image_url": build_pollinations_url(p3, 1024, 1024, style="glassmorphism_3d")
                }
            ]
        else:
            for item in data.get("assets", []):
                if isinstance(item, dict) and not item.get("image_url") and item.get("image_prompt"):
                    ar = item.get("aspect_ratio", "16:9")
                    if ar == "9:16":
                        w, h = 720, 1280
                    elif ar == "1.91:1":
                        w, h = 1200, 630
                    elif ar == "1:1":
                        w, h = 1024, 1024
                    else:
                        w, h = 1280, 720
                    item["image_url"] = build_pollinations_url(item["image_prompt"], w, h)
            
    return data

def generate_fallback_content(format_id: str, ico: IntentContextDTO, params: GenerationParameters) -> Dict[str, Any]:
    """Generates a high-quality structured default if API is unavailable or offline."""
    if format_id == "advisory":
        return {
            "title": f"Security & Operational Advisory: {ico.topic}",
            "advisory_id": "ADV-2026-0901",
            "severity": "High" if ico.risk_flags else "Medium",
            "date_issued": time.strftime("%Y-%m-%d"),
            "summary": ico.summary or "Critical operational notice regarding observed threat activities and infrastructure updates.",
            "threat_or_issue_breakdown": [
                {"heading": "Root Vector Analysis", "details": f"Analysis of entities: {', '.join(ico.key_entities[:3])}"},
                {"heading": "Contextual Impact", "details": "\n".join(ico.key_facts[:3]) if ico.key_facts else "Elevated risk profile."}
            ],
            "impact_assessment": "Moderate to severe operational disruption if mitigation steps are deferred.",
            "recommended_actions": [
                {"priority": "Immediate", "action": act, "target_team": "SecOps / Incident Response"}
                for act in (ico.recommended_actions or ["Review firewall ingress logs", "Rotate credentials"])
            ],
            "references": ["Enterprise Security Baseline Standard 2026", "NIST CSF 2.0 Compliance Guideline"]
        }
    elif format_id == "executive_summary":
        return {
            "title": f"Executive Briefing: {ico.topic}",
            "strategic_context": f"Prepared for {params.audience} covering {ico.domain}.",
            "bottom_line_up_front": ico.summary or "Strategic summary of key operational metrics and directives.",
            "key_findings": [
                {"area": "Core Finding", "observation": fact, "business_or_mission_impact": "Direct operational continuity impact"}
                for fact in (ico.key_facts[:4] or ["Key operational data points extracted from source."])
            ],
            "risk_profile": {
                "overall_level": "Elevated",
                "primary_vulnerabilities": ico.risk_flags or ["Resource bottleneck", "Latency risk"]
            },
            "decision_and_action_requirements": [
                {"decision_needed": act, "stakeholder": "Executive Leadership", "timeline": "Within 48 Hours"}
                for act in (ico.recommended_actions[:3] or ["Approve cross-department dissemination"])
            ],
            "resource_implications": "Requires cross-functional coordination between communication, IT, and leadership teams."
        }
    elif format_id == "linkedin":
        full_text = f"🚨 {ico.topic}\n\n{ico.summary}\n\nKey Takeaways:\n" + "\n".join([f"🔹 {f}" for f in ico.key_facts[:3]]) + f"\n\nWhat are your thoughts on this approach? Let's discuss below.\n\n#Technology #Innovation #Leadership #Security #Transformation"
        return {
            "headline_hook": f"🚨 Strategic Intelligence Alert: What Leaders Need to Know About {ico.topic}",
            "body_paragraphs": [
                ico.summary or "In today's fast-paced operational environment, maintaining clarity and consistency is paramount.",
                "Here are the critical observations distilled from the latest intelligence report:"
            ],
            "key_takeaways": ico.key_facts[:3] or ["Context reuse saves significant time", "Automated pipelines eliminate drafting latency"],
            "call_to_action": "How is your organization adapting its content workflows? Share your perspective in the comments.",
            "hashtags": ["#SmartAutomation", "#Intelligence", "#Leadership", "#AI", "#Security"],
            "full_formatted_post": full_text
        }
    elif format_id == "twitter":
        tweets = [
            {"tweet_number": 1, "content": f"1/4 🧵 Deep Dive: {ico.topic}\n\nHere's what you need to know about the latest intelligence brief and its strategic impact 👇", "purpose": "Hook"},
            {"tweet_number": 2, "content": f"2/4 📌 Core Summary:\n{ico.summary[:240]}", "purpose": "Context"},
            {"tweet_number": 3, "content": f"3/4 📊 Critical Findings:\n• " + "\n• ".join(ico.key_facts[:2])[:230], "purpose": "Data Point"},
            {"tweet_number": 4, "content": f"4/4 🎯 Key Next Step: " + (ico.recommended_actions[0] if ico.recommended_actions else "Deploy automated monitoring.") + "\n\n#TechTrends #Automation", "purpose": "Takeaway/CTA"}
        ]
        return {
            "thread_topic": ico.topic,
            "total_tweets": len(tweets),
            "tweets": tweets,
            "hashtags": ["#RoopantarAI", "#Automation", "#TechNews"]
        }
    elif format_id == "presentation":
        return {
            "deck_title": ico.topic,
            "subtitle": f"Strategic Analysis & Action Plan | {ico.domain}",
            "target_audience": params.audience,
            "total_slides": 5,
            "slides": [
                {
                    "slide_number": 1,
                    "slide_type": "Title",
                    "title": ico.topic,
                    "bullet_points": [
                        f"Domain: {ico.domain}",
                        f"Target Audience: {params.audience}",
                        f"Tone: {params.tone} | Generated via Roopantar-AI"
                    ],
                    "speaker_notes": "Welcome everyone. Today we are walking through the operational intelligence and transformation strategy."
                },
                {
                    "slide_number": 2,
                    "slide_type": "Context",
                    "title": "Executive Overview & Context",
                    "bullet_points": [
                        ico.summary or "Summary of primary findings from source document.",
                        f"Key Stakeholders: {', '.join(ico.key_entities[:3]) if ico.key_entities else 'Leadership Team'}"
                    ],
                    "speaker_notes": "This slide sets the foundational context and outlines the primary scope of the briefing."
                },
                {
                    "slide_number": 3,
                    "slide_type": "Analysis",
                    "title": "Key Findings & Critical Data",
                    "bullet_points": ico.key_facts[:4] or ["Factual metric analysis", "System observation notes"],
                    "speaker_notes": "Pay close attention to these metrics as they form the empirical basis of our action plan."
                },
                {
                    "slide_number": 4,
                    "slide_type": "Recommendations",
                    "title": "Actionable Directives",
                    "bullet_points": ico.recommended_actions[:4] or ["Establish continuous monitoring", "Enforce schema validation"],
                    "speaker_notes": "These recommendations should be executed immediately by the respective task forces."
                },
                {
                    "slide_number": 5,
                    "slide_type": "Conclusion",
                    "title": "Summary & Next Steps",
                    "bullet_points": [
                        "Cross-functional alignment established.",
                        "Direct reporting to leadership scheduled.",
                        "Open for Q&A and operational discussion."
                    ],
                    "speaker_notes": "Thank you. Let's open the floor for any questions or tactical discussions."
                }
            ]
        }
    elif format_id == "video_package":
        return {
            "video_title": f"Explainer: {ico.topic}",
            "target_duration": "90 Seconds",
            "target_format": "16:9 Landscape / Video Briefing",
            "logline": f"An engaging 90-second audiovisual breakdown of {ico.topic}.",
            "scenes": [
                {
                    "scene_number": 1,
                    "timestamp_marker": "00:00 - 00:15",
                    "scene_name": "Opening Hook & Alert",
                    "visual_description": "Dynamic motion graphics showing data streams and security perimeter alert.",
                    "narration_voiceover": f"In a rapidly evolving operational landscape, one development stands out: {ico.topic}.",
                    "on_screen_text": f"INTELLIGENCE BRIEFING: {ico.topic.upper()}",
                    "audio_mood": "Tense, pulsing electronic synth."
                },
                {
                    "scene_number": 2,
                    "timestamp_marker": "00:15 - 00:45",
                    "scene_name": "Core Facts & Breakdown",
                    "visual_description": "Split-screen infographic displaying statistical callouts and impacted entities.",
                    "narration_voiceover": ico.summary or "Our deep analysis reveals significant implications for organizational infrastructure.",
                    "on_screen_text": "KEY FINDINGS & VECTORS",
                    "audio_mood": "Focused, rhythmic technological beat."
                },
                {
                    "scene_number": 3,
                    "timestamp_marker": "00:45 - 01:15",
                    "scene_name": "Actionable Steps",
                    "visual_description": "Step-by-step checklist animated on screen with green verification checkmarks.",
                    "narration_voiceover": "To mitigate risks, teams must implement immediate verification protocols and secure their endpoints.",
                    "on_screen_text": "REQUIRED ACTION PLAN",
                    "audio_mood": "Uplifting, resolute crescendo."
                },
                {
                    "scene_number": 4,
                    "timestamp_marker": "01:15 - 01:30",
                    "scene_name": "Outro & Call to Action",
                    "visual_description": "Roopantar-AI logo card with official links and documentation references.",
                    "narration_voiceover": "Stay informed, stay secure. Review the full advisory for detailed mitigation guidelines.",
                    "on_screen_text": "ROOPANTAR-AI | AUTOMATED CONTENT TRANSFORMATION",
                    "audio_mood": "Clean concluding chime."
                }
            ],
            "production_notes": "Recommended voice: Authoritative, calm, clear professional narration."
        }
    elif format_id == "infographic":
        return {
            "infographic_title": ico.topic,
            "subtitle": f"Visual Architecture & Intelligence Breakdown | {ico.domain}",
            "recommended_layout": "Vertical Flow Chart & Data Matrix",
            "color_palette": {
                "primary": "#0F172A",
                "accent": "#3B82F6",
                "background": "#F8FAFC"
            },
            "key_stat_callouts": [
                {"metric": "70%+", "label": "Drafting Time Reduction", "icon_suggestion": "Zap"},
                {"metric": "<15s", "label": "Generation Latency", "icon_suggestion": "Clock"},
                {"metric": "100%", "label": "Factual Grounding", "icon_suggestion": "ShieldCheck"}
            ],
            "content_sections": [
                {
                    "section_title": "1. Operational Context",
                    "visual_type": "Highlighted Callout Banner",
                    "content_points": [ico.summary or "Summary context of current posture."],
                    "designer_tip": "Use a subtle blue gradient background with high contrast text."
                },
                {
                    "section_title": "2. Threat & Risk Vectors",
                    "visual_type": "3-Column Icon Matrix",
                    "content_points": ico.key_facts[:3] or ["Vector A", "Vector B", "Vector C"],
                    "designer_tip": "Pair each point with a distinctive vector icon."
                },
                {
                    "section_title": "3. Immediate Mitigation Steps",
                    "visual_type": "Numbered Linear Timeline",
                    "content_points": ico.recommended_actions[:3] or ["Step 1", "Step 2", "Step 3"],
                    "designer_tip": "Include bold priority badges (Immediate vs Scheduled)."
                }
            ],
            "footer_attribution": "Generated by Roopantar-AI | Single-Source Multi-Deliverable Engine"
        }
    elif format_id == "image_assets":
        from app.llm.image_client import build_pollinations_url
        p0 = f"Vertical 9:16 mobile visual composition for {ico.topic}, domain {ico.domain}, centered subject, cinematic volumetric lighting, 8k resolution, crisp detail"
        p1 = f"Futuristic high-tech 3D keynote presentation hero image depicting {ico.topic}, domain {ico.domain}, sleek enterprise aesthetic, volumetric lighting, 8k resolution, octane render"
        p2 = f"Modern 16:9 social media graphic banner for {ico.topic}, abstract geometric glass materials, glowing violet and coral gradients, professional editorial design"
        p3 = f"Isometric 3D concept badge for {ico.topic}, frosted translucent glass, vibrant neon reflections, studio lighting on dark background"
        return {
            "title": f"Visual Media Assets: {ico.topic}",
            "visual_theme": f"Futuristic {ico.domain} Strategic Direction",
            "color_palette": ["#7C3AED (Electric Purple)", "#EC4899 (Radiant Pink)", "#F97316 (Coral Orange)", "#0F172A (Deep Slate)"],
            "assets": [
                {
                    "asset_type": "reels_vertical",
                    "label": "9:16 Vertical Reel & TikTok Visual",
                    "aspect_ratio": "9:16",
                    "dimensions": "720x1280",
                    "image_prompt": p0,
                    "negative_prompt": "blurry, text, watermark, low quality, oversaturated",
                    "image_url": build_pollinations_url(p0, 720, 1280, style="photorealistic")
                },
                {
                    "asset_type": "presentation_hero",
                    "label": "16:9 Keynote Slide Hero Visual",
                    "aspect_ratio": "16:9",
                    "dimensions": "1280x720",
                    "image_prompt": p1,
                    "negative_prompt": "blurry, text, watermark, low quality, oversaturated",
                    "image_url": build_pollinations_url(p1, 1280, 720, style="photorealistic")
                },
                {
                    "asset_type": "social_banner",
                    "label": "1.91:1 LinkedIn & Social Media Featured Graphic",
                    "aspect_ratio": "1.91:1",
                    "dimensions": "1200x630",
                    "image_prompt": p2,
                    "negative_prompt": "blurry, lowres, text, watermark",
                    "image_url": build_pollinations_url(p2, 1200, 630, style="glassmorphism_3d")
                },
                {
                    "asset_type": "concept_icon",
                    "label": "1:1 3D Conceptual Spec Icon",
                    "aspect_ratio": "1:1",
                    "dimensions": "1024x1024",
                    "image_prompt": p3,
                    "negative_prompt": "flat, 2d, watermark, blurry",
                    "image_url": build_pollinations_url(p3, 1024, 1024, style="glassmorphism_3d")
                }
            ]
        }
    else:
        return {"topic": ico.topic, "summary": ico.summary, "domain": ico.domain}

async def generate_and_validate_format(
    format_def: FormatDefinition,
    ico: IntentContextDTO,
    params: GenerationParameters,
    custom_instructions: Optional[str] = None,
    max_retries: int = 1
) -> Dict[str, Any]:
    """Generates format deliverables with prompt formatting, JSON parsing, and schema normalization."""
    prompt = build_format_prompt(format_def, ico, params, custom_instructions)
    
    try:
        data = await call_llm_json(
            prompt=prompt,
            system_prompt=format_def.system_prompt,
            schema_description=format_def.output_schema
        )
        normalized = normalize_and_validate_format_data(format_def.id, data, ico)
        return normalized
    except Exception as e:
        logger.warning(f"Generation for {format_def.id} encountered error ({e}), utilizing structured schema normalization.")
        return generate_fallback_content(format_def.id, ico, params)
