import urllib.parse
import random
import logging
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

STYLE_PRESETS: Dict[str, str] = {
    "photorealistic": "masterpiece, photorealistic, 8k resolution, cinematic lighting, shot on Hasselblad 50mm lens, sharp focus, high dynamic range, hyper-detailed textures",
    "glassmorphism_3d": "3D isometric glassmorphism, translucent glowing frosted glass, vibrant neon reflections, octane render, clean studio gradient background, raytraced reflections",
    "minimalist_editorial": "clean minimalist tech editorial design, high-end corporate SaaS aesthetic, elegant negative space, subtle pastel ambient glow, studio lighting",
    "cyber_glow": "dark cyberpunk aesthetic, obsidian dark background, glowing purple pink and coral neon laser accents, futuristic sleek tech, volumetric glow, 8k render"
}

def build_pollinations_url(
    prompt: str, 
    width: int = 1280, 
    height: int = 720, 
    seed: Optional[int] = None,
    style: str = "photorealistic",
    model: str = "flux-realism"
) -> str:
    """Builds a high-quality rendering URL for Pollinations Flux.1 Realism with prompt boosters."""
    style_modifier = STYLE_PRESETS.get(style, STYLE_PRESETS["photorealistic"])
    full_prompt = f"{prompt.strip()}, {style_modifier}".replace("\n", " ").strip()
    encoded = urllib.parse.quote_plus(full_prompt)
    
    if seed is None:
        seed = random.randint(1000, 999999)
        
    return f"https://image.pollinations.ai/prompt/{encoded}?width={width}&height={height}&nologo=true&seed={seed}&model={model}&enhance=true"

async def fetch_image_bytes(image_url: str, timeout: float = 35.0) -> bytes:
    """Downloads image bytes from the rendering engine."""
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
        resp = await client.get(image_url)
        resp.raise_for_status()
        return resp.content
