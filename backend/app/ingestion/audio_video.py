import os
from pathlib import Path
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def transcribe_audio_or_video(file_path: Path) -> str:
    try:
        if settings.GROQ_API_KEY:
            from groq import Groq
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            with open(file_path, "rb") as file_handle:
                transcription = client.audio.transcriptions.create(
                    file=(file_path.name, file_handle.read()),
                    model=settings.WHISPER_MODEL,
                    response_format="text",
                    temperature=0.0
                )
            
            text_result = str(transcription).strip()
            if not text_result:
                raise ValueError("Whisper transcription returned empty audio transcript.")
            return text_result

        # Fallback if OpenAI key is present
        elif settings.OPENAI_API_KEY:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            
            with open(file_path, "rb") as file_handle:
                transcription = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=file_handle
                )
            return transcription.text.strip()
            
        else:
            return (
                "Audio/Video Ingested. Notice: Transcription requires a free GROQ_API_KEY configured in backend/.env. "
                "Once your free key is set, Whisper-large-v3 will automatically transcribe full speech tracks."
            )
            
    except Exception as e:
        logger.error(f"Audio/Video transcription failed: {e}")
        raise ValueError(f"Transcription error: {str(e)}")
