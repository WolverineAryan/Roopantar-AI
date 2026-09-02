import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String(50), default="queued")  # queued, analyzing, generating, completed, failed
    
    source_filename = Column(String(255), nullable=True)
    source_file_type = Column(String(50), default="text")  # text, pdf, docx, image, video
    source_raw_text = Column(Text, nullable=False)
    
    selected_formats = Column(JSON, default=list)  # list of format names e.g. ["advisory", "linkedin"]
    parameters = Column(JSON, default=dict)        # {tone, audience, language, detail_level, objective}
    
    error_message = Column(Text, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    
    intent_context = relationship("IntentContext", back_populates="job", uselist=False, cascade="all, delete-orphan")
    outputs = relationship("GeneratedOutput", back_populates="job", cascade="all, delete-orphan")

class IntentContext(Base):
    __tablename__ = "intent_contexts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    topic = Column(String(255), default="")
    domain = Column(String(100), default="General")
    summary = Column(Text, default="")
    
    key_entities = Column(JSON, default=list)
    key_facts = Column(JSON, default=list)
    tone_signals = Column(JSON, default=list)
    risk_flags = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)
    
    raw_json = Column(JSON, default=dict)
    
    job = relationship("Job", back_populates="intent_context")

class GeneratedOutput(Base):
    __tablename__ = "generated_outputs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    format_type = Column(String(50), nullable=False)
    
    status = Column(String(50), default="pending")  # pending, generating, completed, failed
    content_json = Column(JSON, default=dict)
    
    export_file_path = Column(String(500), nullable=True)
    export_file_type = Column(String(20), nullable=True)  # pptx, docx, pdf, txt, json
    
    error_message = Column(Text, nullable=True)
    generation_time = Column(Float, nullable=True)
    
    job = relationship("Job", back_populates="outputs")
