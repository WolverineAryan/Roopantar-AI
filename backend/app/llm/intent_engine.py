import logging
from typing import Dict, Any
from app.llm.client import call_llm_json
from app.schemas.job_dto import IntentContextDTO, GenerationParameters

logger = logging.getLogger(__name__)

ICO_SYSTEM_PROMPT = """
You are the Intent & Context Analyzer for Roopantar-AI, an enterprise automated content transformation platform.
Your job is to perform a SINGLE-PASS deep semantic analysis of the provided source document.
You extract the complete core understanding so that downstream deliverable generators (Advisories, Presentations, Social Media, Video scripts) never hallucinate and share a single factual source of truth.

Extract:
1. topic: A concise, highly descriptive title/topic.
2. domain: Category (e.g., Cybersecurity, National Defense, Smart Automation, Public Policy, Healthcare, Technology, Intelligence).
3. summary: A 3-5 sentence crystal-clear executive summary capturing the core premise, findings, and urgency.
4. key_entities: An array of organizations, threat actors, technologies, systems, or people mentioned.
5. key_facts: An array of 4-8 concrete factual bullet points (statistics, dates, root causes, technical specifics).
6. tone_signals: An array of tone keywords derived from the text (e.g., Urgent, Formal, Cautionary, Strategic).
7. risk_flags: An array of risk or severity indicators (e.g., "Critical Vulnerability", "Public Safety Impact", "Regulatory Deadline").
8. recommended_actions: An array of 3-6 explicit or implied actionable recommendations.

Output ONLY valid JSON matching this schema.
"""

ICO_SCHEMA = """
{
  "topic": "string",
  "domain": "string",
  "summary": "string",
  "key_entities": ["string"],
  "key_facts": ["string"],
  "tone_signals": ["string"],
  "risk_flags": ["string"],
  "recommended_actions": ["string"]
}
"""

async def generate_intent_context(source_text: str, parameters: GenerationParameters) -> IntentContextDTO:
    user_prompt = f"""
SOURCE CONTENT TO ANALYZE:
---
{source_text[:12000]}
---

OPERATOR PARAMETERS:
- Target Tone: {parameters.tone}
- Target Audience: {parameters.audience}
- Communication Objective: {parameters.objective}

Perform full context and intent extraction now.
"""
    data = await call_llm_json(
        prompt=user_prompt,
        system_prompt=ICO_SYSTEM_PROMPT,
        schema_description=ICO_SCHEMA
    )
    
    return IntentContextDTO(
        topic=data.get("topic", "Extracted Context Briefing"),
        domain=data.get("domain", "General"),
        summary=data.get("summary", ""),
        key_entities=data.get("key_entities", []),
        key_facts=data.get("key_facts", []),
        tone_signals=data.get("tone_signals", []),
        risk_flags=data.get("risk_flags", []),
        recommended_actions=data.get("recommended_actions", [])
    )
