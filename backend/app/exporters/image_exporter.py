import asyncio
import zipfile
import json
from pathlib import Path
from typing import Dict, Any, List
import logging
from app.llm.image_client import fetch_image_bytes

logger = logging.getLogger(__name__)

async def export_image_assets_to_zip(content: Dict[str, Any], output_zip_path: Path) -> Path:
    """Downloads all generated image assets and archives them into a .zip file with metadata."""
    if not isinstance(content, dict):
        content = {}

    output_zip_path.parent.mkdir(parents=True, exist_ok=True)
    assets: List[Dict[str, Any]] = content.get("assets", [])
    
    temp_dir = output_zip_path.parent / "temp_images"
    temp_dir.mkdir(parents=True, exist_ok=True)
    saved_files = []

    for i, asset in enumerate(assets):
        asset_type = asset.get("asset_type", f"asset_{i+1}")
        image_url = asset.get("image_url", "")
        file_path = temp_dir / f"{asset_type}.png"
        
        if image_url:
            try:
                img_bytes = await fetch_image_bytes(image_url)
                with open(file_path, "wb") as f:
                    f.write(img_bytes)
                saved_files.append((file_path, f"{asset_type}.png"))
            except Exception as e:
                logger.warning(f"Could not download image {asset_type} for zip export: {e}")

    # Write prompts metadata
    meta_path = temp_dir / "visual_prompts_spec.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)
    saved_files.append((meta_path, "visual_prompts_spec.json"))

    # Create ZIP archive
    with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file_path, arcname in saved_files:
            if file_path.exists():
                zipf.write(file_path, arcname)

    return output_zip_path
