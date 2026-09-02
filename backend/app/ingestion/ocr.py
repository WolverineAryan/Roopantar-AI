import os
from pathlib import Path
from PIL import Image
import logging

logger = logging.getLogger(__name__)

def extract_text_from_image(file_path: Path) -> str:
    try:
        import pytesseract
        
        img = Image.open(str(file_path))
        # Convert RGBA or other modes to RGB
        if img.mode != "RGB":
            img = img.convert("RGB")
            
        text = pytesseract.image_to_string(img)
        cleaned = text.strip()
        if not cleaned:
            return "Note: OCR scan completed, but no legible text was detected in the provided image."
        return cleaned
    except ImportError:
        logger.warning("pytesseract is not installed or available.")
        return "OCR Error: pytesseract library is missing."
    except Exception as e:
        logger.error(f"OCR processing failed for {file_path}: {e}")
        # If tesseract binary is not on PATH, provide user-friendly message
        if "tesseract is not installed or it's not in your PATH" in str(e):
            return "Image Ingested. Note: Tesseract OCR engine is not installed on the system PATH. Install Tesseract OCR or upload document/text directly."
        raise ValueError(f"Failed to perform OCR on image: {str(e)}")
