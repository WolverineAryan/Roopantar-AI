import os
from pathlib import Path
from typing import Dict, List, Optional, Any
import yaml
from pydantic import BaseModel
from app.schemas.job_dto import IntentContextDTO, GenerationParameters

class FormatDefinition(BaseModel):
    id: str
    name: str
    description: str
    category: str
    export_formats: List[str]
    icon: str
    color: str
    system_prompt: str
    prompt_template: str
    output_schema: str

_GENERATORS_CACHE: Dict[str, FormatDefinition] = {}

def load_generators() -> Dict[str, FormatDefinition]:
    global _GENERATORS_CACHE
    if _GENERATORS_CACHE:
        return _GENERATORS_CACHE
        
    generators_dir = Path(__file__).resolve().parent
    loaded = {}
    
    for yaml_file in generators_dir.glob("*.yaml"):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if data and "id" in data:
                    fmt = FormatDefinition(**data)
                    loaded[fmt.id] = fmt
        except Exception as e:
            print(f"Failed to load generator {yaml_file.name}: {e}")
            
    _GENERATORS_CACHE = loaded
    return _GENERATORS_CACHE

def get_registered_formats() -> List[FormatDefinition]:
    return list(load_generators().values())

def get_format_by_id(format_id: str) -> Optional[FormatDefinition]:
    return load_generators().get(format_id)

def build_format_prompt(
    format_def: FormatDefinition, 
    ico: IntentContextDTO, 
    params: GenerationParameters,
    custom_instructions: Optional[str] = None
) -> str:
    entities_str = ", ".join(ico.key_entities) if ico.key_entities else "None explicitly listed"
    facts_str = "\n- " + "\n- ".join(ico.key_facts) if ico.key_facts else "Standard source context"
    risks_str = ", ".join(ico.risk_flags) if ico.risk_flags else "Standard operational level"
    actions_str = "\n- " + "\n- ".join(ico.recommended_actions) if ico.recommended_actions else "General guidance"
    
    prompt = format_def.prompt_template.format(
        topic=ico.topic,
        domain=ico.domain,
        summary=ico.summary,
        entities=entities_str,
        facts=facts_str,
        risk_flags=risks_str,
        actions=actions_str,
        tone=params.tone,
        audience=params.audience,
        detail_level=params.detail_level,
        objective=params.objective,
        language=params.language
    )
    
    if custom_instructions:
        prompt += f"\n\nADDITIONAL OPERATOR INSTRUCTIONS:\n{custom_instructions}"
        
    return prompt
