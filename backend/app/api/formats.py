from fastapi import APIRouter
from typing import List
from app.generators.registry import get_registered_formats
from app.schemas.job_dto import FormatRegistryItemDTO

router = APIRouter(prefix="/formats", tags=["Formats"])

@router.get("", response_model=List[FormatRegistryItemDTO])
async def list_available_formats():
    formats = get_registered_formats()
    return [
        FormatRegistryItemDTO(
            id=f.id,
            name=f.name,
            description=f.description,
            category=f.category,
            export_formats=f.export_formats,
            icon=f.icon,
            color=f.color
        )
        for f in formats
    ]
