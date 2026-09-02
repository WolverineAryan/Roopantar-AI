from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
async def health_check():
    has_groq = bool(settings.GROQ_API_KEY)
    has_openai = bool(settings.OPENAI_API_KEY)
    has_gemini = bool(settings.GEMINI_API_KEY)
    
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "configured_provider": settings.LLM_PROVIDER,
        "api_keys_present": {
            "groq": has_groq,
            "openai": has_openai,
            "gemini": has_gemini
        },
        "mode": "Live AI Powered" if (has_groq or has_openai or has_gemini) else "Demo / Offline Mode (Add GROQ_API_KEY for Live Models)"
    }
