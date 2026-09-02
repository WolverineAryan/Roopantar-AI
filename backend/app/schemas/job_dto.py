from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class GenerationParameters(BaseModel):
    tone: str = Field(default="Formal", description="e.g. Formal, Urgent, Technical, Casual, Analytical")
    audience: str = Field(default="Leadership & Stakeholders", description="e.g. Public, Leadership, Technical, Media")
    language: str = Field(default="English", description="Target language (English, Hindi, etc.)")
    detail_level: str = Field(default="Standard", description="Brief, Standard, Comprehensive")
    objective: str = Field(default="Inform & Advise", description="Inform, Alert, Persuade, Educate")
    style_preference: Optional[str] = Field(default="Professional & Clear", description="Formatting or voice style")

class JobCreateRequest(BaseModel):
    raw_text: Optional[str] = None
    selected_formats: List[str] = Field(
        default_factory=lambda: [
            "advisory",
            "executive_summary",
            "linkedin",
            "twitter",
            "presentation",
            "video_package",
            "infographic"
        ]
    )
    parameters: GenerationParameters = Field(default_factory=GenerationParameters)

class RegenerateFormatRequest(BaseModel):
    parameters: Optional[GenerationParameters] = None
    custom_instructions: Optional[str] = None

class IntentContextDTO(BaseModel):
    topic: str
    domain: str
    summary: str
    key_entities: List[str] = []
    key_facts: List[str] = []
    tone_signals: List[str] = []
    risk_flags: List[str] = []
    recommended_actions: List[str] = []

class GeneratedOutputDTO(BaseModel):
    id: str
    format_type: str
    status: str
    content_json: Dict[str, Any] = {}
    export_file_path: Optional[str] = None
    export_file_type: Optional[str] = None
    error_message: Optional[str] = None
    generation_time: Optional[float] = None

class JobResponseDTO(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime
    status: str
    source_filename: Optional[str] = None
    source_file_type: Optional[str] = None
    source_raw_text: str
    selected_formats: List[str]
    parameters: Dict[str, Any]
    error_message: Optional[str] = None
    duration_seconds: Optional[float] = None
    intent_context: Optional[IntentContextDTO] = None
    outputs: List[GeneratedOutputDTO] = []

class JobListSummaryDTO(BaseModel):
    id: str
    created_at: datetime
    status: str
    source_filename: Optional[str] = None
    source_file_type: Optional[str] = None
    selected_formats: List[str]
    topic: Optional[str] = None
    duration_seconds: Optional[float] = None

class FormatRegistryItemDTO(BaseModel):
    id: str
    name: str
    description: str
    category: str
    export_formats: List[str]
    icon: str
    color: str
