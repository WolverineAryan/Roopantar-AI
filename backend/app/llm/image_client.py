import urllib.parse
import random
import logging
from typing import Dict, Any, List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

def build_pollinations_url(prompt: str, width: int = 1280, height: int = 720, seed: int = None) -> str:
    """Builds a direct rendering URL for Pollinations Flux AI Image Generator."""
    clean_prompt = prompt.replace("\n", " ").strip()
    encoded = urllib.parse.quote_plus(clean_prompt)
    if seed is None:
        seed = random.randint(1000, 999999)
    return f"https://image.pollinations.ai/prompt/{encoded}?width={width}&height={height}&nologo=true&seed={seed}&model=flux"

async def fetch_image_bytes(image_url: str, timeout: float = 30.0) -> bytes:
    """Downloads image bytes from the rendering engine."""
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        resp = await client.get(image_url)
        resp.raise_for_status()
        return resp.content
