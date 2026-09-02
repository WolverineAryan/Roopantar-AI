import json
import re
import logging
import asyncio
from typing import Dict, Any, Optional, List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

# Cache for resolved working Groq model
_RESOLVED_GROQ_MODEL: Optional[str] = None
_KNOWN_ACTIVE_MODELS: List[str] = []

def extract_json_from_response(raw_text: str) -> Dict[str, Any]:
    """Extracts and parses JSON object from LLM response text."""
    text = raw_text.strip()
    
    # Strip markdown code blocks if present
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'(\{[\s\S]*\}|\[[\s\S]*\])', text)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        raise ValueError(f"Could not parse valid JSON from LLM response: {text[:200]}...")

async def get_active_groq_models(client) -> List[str]:
    """Fetches and caches list of available text models from user's Groq account."""
    global _KNOWN_ACTIVE_MODELS
    if _KNOWN_ACTIVE_MODELS:
        return _KNOWN_ACTIVE_MODELS
    try:
        model_list = await client.models.list()
        text_models = [m.id for m in model_list.data if "whisper" not in m.id.lower()]
        _KNOWN_ACTIVE_MODELS = text_models
        logger.info(f"Discovered active models on Groq: {text_models}")
        return text_models
    except Exception as e:
        logger.warning(f"Could not query Groq models list: {e}")
        return ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3-32b", "groq/compound-mini"]

async def call_groq(prompt: str, system_prompt: str, json_mode: bool = True) -> str:
    global _RESOLVED_GROQ_MODEL
    from groq import AsyncGroq
    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]
    
    # 1. If we already know a working model, try it first
    if _RESOLVED_GROQ_MODEL:
        candidates = [_RESOLVED_GROQ_MODEL]
    else:
        # Query active models dynamically
        active_list = await get_active_groq_models(client)
        preferred = [
            "openai/gpt-oss-120b",
            "openai/gpt-oss-20b",
            "qwen/qwen3-32b",
            "qwen/qwen3.8-27b",
            "qwen/qwen3.6-27b",
            "groq/compound-mini"
        ]
        candidates = [m for m in preferred if m in active_list] + [m for m in active_list if m not in preferred]
        if not candidates:
            candidates = preferred
            
    last_error = None
    for model_name in candidates:
        try:
            params: Dict[str, Any] = {
                "model": model_name,
                "messages": messages,
                "temperature": 0.2,
                "max_tokens": 3072,
            }
            # For qwen or gpt-oss, plain prompt with JSON instruction is faster and never triggers json_validate_failed
            response = await client.chat.completions.create(**params)
            _RESOLVED_GROQ_MODEL = model_name
            return response.choices[0].message.content
        except Exception as e:
            err_str = str(e)
            logger.warning(f"Groq model '{model_name}' attempt failed: {err_str}")
            last_error = e
            if _RESOLVED_GROQ_MODEL == model_name:
                _RESOLVED_GROQ_MODEL = None # Reset cache and try other candidates
            continue
            
    raise last_error or RuntimeError("Failed to query active Groq model.")

async def call_openai(prompt: str, system_prompt: str, json_mode: bool = True) -> str:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]
    
    params: Dict[str, Any] = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 4096,
    }
    if json_mode:
        params["response_format"] = {"type": "json_object"}
        
    response = await client.chat.completions.create(**params)
    return response.choices[0].message.content

async def call_gemini(prompt: str, system_prompt: str) -> str:
    import google.generativeai as genai
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=system_prompt
    )
    response = await model.generate_content_async(prompt)
    return response.text

async def call_ollama(prompt: str, system_prompt: str, json_mode: bool = True) -> str:
    url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/chat"
    payload = {
        "model": "llama3.1:8b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "stream": False,
        "format": "json" if json_mode else None
    }
    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["message"]["content"]

def generate_mock_ico(prompt: str) -> Dict[str, Any]:
    """Fallback generator for dry-run testing before API key is provided."""
    return {
        "topic": "Strategic Operational Analysis & Directives",
        "domain": "Enterprise & Strategic Operations",
        "summary": "Source material provides comprehensive data points, operational specifications, and directives. Outlines key findings, stakeholder roles, and time-sensitive milestones.",
        "key_entities": [
            "Executive Steering Committee",
            "Operations Task Force",
            "Infrastructure Security Group",
            "Communications & Strategy Unit"
        ],
        "key_facts": [
            "Critical specifications and metrics extracted from source material.",
            "Single-pass context extraction reduces compute and drafting latency by >90%.",
            "Multi-format distribution reaches leadership, technical teams, and consumers.",
            "Strict adherence to schema specifications and quality baselines."
        ],
        "tone_signals": ["Authoritative", "Strategic", "Action-Oriented", "Clear"],
        "risk_flags": ["Operational Deadline", "Stakeholder Alignment Required"],
        "recommended_actions": [
            "Authorize immediate dissemination across all approved channels.",
            "Deploy schema-validated presentations and briefings to leadership.",
            "Execute tactical timeline milestones according to schedule."
        ]
    }

async def call_llm_text(prompt: str, system_prompt: str = "You are Roopantar-AI, an expert content transformation engine.") -> str:
    """Dispatches request to configured LLM provider and returns raw text."""
    if settings.GROQ_API_KEY and settings.LLM_PROVIDER == "groq":
        return await call_groq(prompt, system_prompt, json_mode=False)
    elif settings.OPENAI_API_KEY and settings.LLM_PROVIDER == "openai":
        return await call_openai(prompt, system_prompt, json_mode=False)
    elif settings.GEMINI_API_KEY and settings.LLM_PROVIDER == "gemini":
        return await call_gemini(prompt, system_prompt)
    elif settings.LLM_PROVIDER == "ollama":
        return await call_ollama(prompt, system_prompt, json_mode=False)
    else:
        if settings.GROQ_API_KEY:
            return await call_groq(prompt, system_prompt, json_mode=False)
        return "Note: Set your free GROQ_API_KEY in backend/.env for live LLM generation."

async def call_llm_json(prompt: str, system_prompt: str, schema_description: Optional[str] = None) -> Dict[str, Any]:
    """Dispatches request to configured LLM and returns parsed JSON object."""
    full_system = f"{system_prompt}\n\nCRITICAL: Respond ONLY with a valid JSON object matching the schema. Do not output markdown backticks or conversational text."
    if schema_description:
        full_system += f"\n\nJSON SCHEMA:\n{schema_description}"
        
    try:
        if settings.GROQ_API_KEY:
            raw = await call_groq(prompt, full_system, json_mode=True)
            return extract_json_from_response(raw)
        elif settings.OPENAI_API_KEY:
            raw = await call_openai(prompt, full_system, json_mode=True)
            return extract_json_from_response(raw)
        elif settings.GEMINI_API_KEY:
            raw = await call_gemini(prompt, full_system)
            return extract_json_from_response(raw)
        elif settings.LLM_PROVIDER == "ollama":
            raw = await call_ollama(prompt, full_system, json_mode=True)
            return extract_json_from_response(raw)
        else:
            logger.warning("No LLM API keys configured. Generating mock response for preview/testing.")
            if "Intent Context" in system_prompt or "ICO" in system_prompt:
                return generate_mock_ico(prompt)
            return {
                "status": "success",
                "message": "Demo mode: Add your free Groq API key to backend/.env for live AI generation.",
                "preview": prompt[:150]
            }
    except Exception as e:
        logger.error(f"Error calling LLM: {e}")
        if "Intent Context" in system_prompt or "ICO" in system_prompt:
            logger.info("Falling back to structured ICO representation")
            return generate_mock_ico(prompt)
        raise
