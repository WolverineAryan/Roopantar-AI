import os
import json
import time
import asyncio
import logging
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.core.database import get_db
from app.models.job import Job, IntentContext, GeneratedOutput
from app.schemas.job_dto import (
    JobCreateRequest,
    JobResponseDTO,
    JobListSummaryDTO,
    RegenerateFormatRequest,
    GenerationParameters,
    IntentContextDTO,
    GeneratedOutputDTO
)
from app.ingestion.parser import parse_document
from app.ingestion.ocr import extract_text_from_image
from app.ingestion.audio_video import transcribe_audio_or_video
from app.llm.intent_engine import generate_intent_context
from app.generators.registry import get_format_by_id, get_registered_formats
from app.validators.schema_validator import generate_and_validate_format
from app.exporters.pptx_exporter import export_presentation_to_pptx
from app.exporters.docx_exporter import export_advisory_or_summary_to_docx
from app.exporters.pdf_exporter import export_to_pdf

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/jobs", tags=["Jobs"])

async def export_format_file(job_id: str, format_type: str, content: dict) -> tuple[Optional[str], Optional[str]]:
    """Generates real downloadable export files based on format type."""
    exports_dir = settings.exports_dir / job_id
    exports_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        if format_type == "presentation":
            file_path = exports_dir / f"{job_id}_presentation.pptx"
            export_presentation_to_pptx(content, file_path)
            return str(file_path), "pptx"
            
        elif format_type in ["advisory", "executive_summary"]:
            file_path_docx = exports_dir / f"{job_id}_{format_type}.docx"
            export_advisory_or_summary_to_docx(format_type, content, file_path_docx)
            # Also generate PDF
            file_path_pdf = exports_dir / f"{job_id}_{format_type}.pdf"
            export_to_pdf(format_type, content, file_path_pdf)
            return str(file_path_docx), "docx"
            
        elif format_type == "video_package":
            file_path_docx = exports_dir / f"{job_id}_video_package.docx"
            export_advisory_or_summary_to_docx(format_type, content, file_path_docx)
            return str(file_path_docx), "docx"
            
        elif format_type == "infographic":
            file_path_pdf = exports_dir / f"{job_id}_infographic.pdf"
            export_to_pdf(format_type, content, file_path_pdf)
            return str(file_path_pdf), "pdf"
            
        elif format_type in ["linkedin", "twitter"]:
            file_path_txt = exports_dir / f"{job_id}_{format_type}.txt"
            with open(file_path_txt, "w", encoding="utf-8") as f:
                if format_type == "linkedin":
                    f.write(content.get("full_formatted_post", str(content)))
                else:
                    tweets = [t.get("content", "") for t in content.get("tweets", [])]
                    f.write("\n\n---\n\n".join(tweets))
            return str(file_path_txt), "txt"
            
        return None, None
    except Exception as e:
        logger.error(f"Error exporting file for {format_type}: {e}")
        return None, None

@router.post("", response_model=JobResponseDTO)
async def create_job(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    selected_formats: Optional[str] = Form(None),
    parameters: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    start_time = time.time()
    
    # 1. Parse Ingested Content
    source_filename = None
    source_file_type = "text"
    extracted_text = ""
    
    if file and file.filename:
        source_filename = file.filename
        ext = Path(source_filename).suffix.lower()
        uploads_dir = settings.uploads_dir
        saved_file_path = uploads_dir / f"{int(time.time())}_{source_filename}"
        
        # Save file to disk
        contents = await file.read()
        with open(saved_file_path, "wb") as f:
            f.write(contents)
            
        if ext in [".txt", ".md", ".pdf", ".docx", ".doc"]:
            extracted_text, source_file_type = parse_document(saved_file_path, source_filename)
        elif ext in [".png", ".jpg", ".jpeg", ".bmp", ".webp"]:
            source_file_type = "image"
            extracted_text = extract_text_from_image(saved_file_path)
        elif ext in [".mp4", ".mov", ".avi", ".mkv", ".mp3", ".wav", ".m4a", ".ogg", ".webm"]:
            source_file_type = "video"
            extracted_text = transcribe_audio_or_video(saved_file_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file format: {ext}")
            
    elif raw_text and raw_text.strip():
        extracted_text = raw_text.strip()
        source_file_type = "text"
    else:
        raise HTTPException(status_code=400, detail="Either a file upload or raw text input is required.")
        
    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text could be extracted from the provided input.")

    # 2. Parse Formats and Parameters
    formats_list = ["advisory", "executive_summary", "linkedin", "twitter", "presentation", "video_package", "infographic"]
    if selected_formats:
        try:
            formats_list = json.loads(selected_formats)
        except Exception:
            formats_list = [f.strip() for f in selected_formats.split(",") if f.strip()]
            
    params_dict = {}
    if parameters:
        try:
            params_dict = json.loads(parameters)
        except Exception:
            pass
    gen_params = GenerationParameters(**params_dict)

    # 3. Create Job in DB
    job = Job(
        source_filename=source_filename,
        source_file_type=source_file_type,
        source_raw_text=extracted_text,
        selected_formats=formats_list,
        parameters=gen_params.model_dump(),
        status="analyzing"
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # 4. Single-Pass Intent Context Analysis (ICO)
    try:
        ico_dto = await generate_intent_context(extracted_text, gen_params)
        
        intent_db = IntentContext(
            job_id=job.id,
            topic=ico_dto.topic,
            domain=ico_dto.domain,
            summary=ico_dto.summary,
            key_entities=ico_dto.key_entities,
            key_facts=ico_dto.key_facts,
            tone_signals=ico_dto.tone_signals,
            risk_flags=ico_dto.risk_flags,
            recommended_actions=ico_dto.recommended_actions,
            raw_json=ico_dto.model_dump()
        )
        db.add(intent_db)
        job.status = "generating"
        await db.commit()
    except Exception as e:
        logger.error(f"Intent analysis failed: {e}")
        job.status = "failed"
        job.error_message = f"Intent analysis error: {str(e)}"
        await db.commit()
        raise HTTPException(status_code=500, detail=job.error_message)

    # 5. High-Speed Parallel Fan-Out Format Generation (3 workers pool)
    semaphore = asyncio.Semaphore(3)

    async def process_format(format_id: str):
        async with semaphore:
            fmt_def = get_format_by_id(format_id)
            if not fmt_def:
                logger.warning(f"Unknown format requested: {format_id}")
                return None
                
            f_start = time.time()
            output_data = await generate_and_validate_format(fmt_def, ico_dto, gen_params)
            f_time = round(time.time() - f_start, 2)
            
            # Export files
            file_path, file_type = await export_format_file(job.id, format_id, output_data)
            
            gen_output = GeneratedOutput(
                job_id=job.id,
                format_type=format_id,
                status="completed",
                content_json=output_data,
                export_file_path=file_path,
                export_file_type=file_type,
                generation_time=f_time
            )
            return gen_output

    tasks = [process_format(fid) for fid in formats_list]
    results = await asyncio.gather(*tasks)
    
    for r in results:
        if r:
            db.add(r)
            
    job.status = "completed"
    job.duration_seconds = round(time.time() - start_time, 2)
    await db.commit()

    # Refresh full job with relations
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.intent_context), selectinload(Job.outputs))
        .where(Job.id == job.id)
    )
    full_job = result.scalar_one()

    return JobResponseDTO(
        id=full_job.id,
        created_at=full_job.created_at,
        updated_at=full_job.updated_at,
        status=full_job.status,
        source_filename=full_job.source_filename,
        source_file_type=full_job.source_file_type,
        source_raw_text=full_job.source_raw_text,
        selected_formats=full_job.selected_formats,
        parameters=full_job.parameters,
        error_message=full_job.error_message,
        duration_seconds=full_job.duration_seconds,
        intent_context=IntentContextDTO(**full_job.intent_context.raw_json) if full_job.intent_context else None,
        outputs=[
            GeneratedOutputDTO(
                id=o.id,
                format_type=o.format_type,
                status=o.status,
                content_json=o.content_json,
                export_file_path=o.export_file_path,
                export_file_type=o.export_file_type,
                error_message=o.error_message,
                generation_time=o.generation_time
            )
            for o in full_job.outputs
        ]
    )

@router.get("/{job_id}", response_model=JobResponseDTO)
async def get_job_by_id(job_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.intent_context), selectinload(Job.outputs))
        .where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobResponseDTO(
        id=job.id,
        created_at=job.created_at,
        updated_at=job.updated_at,
        status=job.status,
        source_filename=job.source_filename,
        source_file_type=job.source_file_type,
        source_raw_text=job.source_raw_text,
        selected_formats=job.selected_formats,
        parameters=job.parameters,
        error_message=job.error_message,
        duration_seconds=job.duration_seconds,
        intent_context=IntentContextDTO(**job.intent_context.raw_json) if job.intent_context else None,
        outputs=[
            GeneratedOutputDTO(
                id=o.id,
                format_type=o.format_type,
                status=o.status,
                content_json=o.content_json,
                export_file_path=o.export_file_path,
                export_file_type=o.export_file_type,
                error_message=o.error_message,
                generation_time=o.generation_time
            )
            for o in job.outputs
        ]
    )

@router.post("/{job_id}/formats/{format_type}", response_model=GeneratedOutputDTO)
async def regenerate_format(
    job_id: str,
    format_type: str,
    body: Optional[RegenerateFormatRequest] = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.intent_context), selectinload(Job.outputs))
        .where(Job.id == job_id)
    )
    job = result.scalar_one_or_none()
    if not job or not job.intent_context:
        raise HTTPException(status_code=404, detail="Job or cached Intent Context not found")

    fmt_def = get_format_by_id(format_type)
    if not fmt_def:
        raise HTTPException(status_code=400, detail=f"Unsupported format: {format_type}")

    # Use updated parameters if provided, else job parameters
    params = body.parameters if (body and body.parameters) else GenerationParameters(**job.parameters)
    custom_inst = body.custom_instructions if body else None
    
    ico_dto = IntentContextDTO(**job.intent_context.raw_json)
    
    f_start = time.time()
    new_content = await generate_and_validate_format(
        fmt_def, 
        ico_dto, 
        params, 
        custom_instructions=custom_inst
    )
    f_time = round(time.time() - f_start, 2)
    
    file_path, file_type = await export_format_file(job.id, format_type, new_content)
    
    # Find existing output or create new
    existing_output = next((o for o in job.outputs if o.format_type == format_type), None)
    if existing_output:
        existing_output.content_json = new_content
        existing_output.export_file_path = file_path
        existing_output.export_file_type = file_type
        existing_output.generation_time = f_time
        existing_output.status = "completed"
        output_obj = existing_output
    else:
        output_obj = GeneratedOutput(
            job_id=job.id,
            format_type=format_type,
            status="completed",
            content_json=new_content,
            export_file_path=file_path,
            export_file_type=file_type,
            generation_time=f_time
        )
        db.add(output_obj)
        
    await db.commit()
    await db.refresh(output_obj)
    
    return GeneratedOutputDTO(
        id=output_obj.id,
        format_type=output_obj.format_type,
        status=output_obj.status,
        content_json=output_obj.content_json,
        export_file_path=output_obj.export_file_path,
        export_file_type=output_obj.export_file_type,
        error_message=output_obj.error_message,
        generation_time=output_obj.generation_time
    )

@router.get("/{job_id}/export/{format_type}")
async def download_export(
    job_id: str,
    format_type: str,
    file_ext: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(GeneratedOutput).where(
            GeneratedOutput.job_id == job_id,
            GeneratedOutput.format_type == format_type
        )
    )
    output = result.scalar_one_or_none()
    if not output:
        raise HTTPException(status_code=404, detail="Output format not found for this job")

    exports_dir = settings.exports_dir / job_id
    
    # If user explicitly requested a specific extension
    if file_ext == "pdf":
        target_file = exports_dir / f"{job_id}_{format_type}.pdf"
        if not target_file.exists():
            export_to_pdf(format_type, output.content_json, target_file)
        return FileResponse(
            str(target_file),
            media_type="application/pdf",
            filename=f"Roopantar_{format_type}_{job_id[:8]}.pdf"
        )
        
    elif file_ext == "docx" or output.export_file_type == "docx":
        target_file = exports_dir / f"{job_id}_{format_type}.docx"
        if not target_file.exists():
            export_advisory_or_summary_to_docx(format_type, output.content_json, target_file)
        return FileResponse(
            str(target_file),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"Roopantar_{format_type}_{job_id[:8]}.docx"
        )
        
    elif output.export_file_type == "pptx" or format_type == "presentation":
        target_file = exports_dir / f"{job_id}_presentation.pptx"
        if not target_file.exists():
            export_presentation_to_pptx(output.content_json, target_file)
        return FileResponse(
            str(target_file),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=f"Roopantar_Presentation_{job_id[:8]}.pptx"
        )
        
    elif output.export_file_type == "txt":
        target_file = exports_dir / f"{job_id}_{format_type}.txt"
        return FileResponse(
            str(target_file),
            media_type="text/plain",
            filename=f"Roopantar_{format_type}_{job_id[:8]}.txt"
        )
        
    # Default fallback to JSON spec
    target_file = exports_dir / f"{job_id}_{format_type}.json"
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(output.content_json, f, indent=2)
    return FileResponse(
        str(target_file),
        media_type="application/json",
        filename=f"Roopantar_{format_type}_{job_id[:8]}.json"
    )

@router.get("", response_model=List[JobListSummaryDTO])
async def list_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Job)
        .options(selectinload(Job.intent_context))
        .order_by(Job.created_at.desc())
        .limit(20)
    )
    jobs = result.scalars().all()
    
    return [
        JobListSummaryDTO(
            id=j.id,
            created_at=j.created_at,
            status=j.status,
            source_filename=j.source_filename,
            source_file_type=j.source_file_type,
            selected_formats=j.selected_formats,
            topic=j.intent_context.topic if j.intent_context else None,
            duration_seconds=j.duration_seconds
        )
        for j in jobs
    ]
