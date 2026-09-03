import os
import sys
import time
import json
import asyncio
from pathlib import Path
from typing import Dict, Any, List

# Ensure backend directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from app.core.database import init_db, AsyncSessionLocal, engine, Base
from app.generators.registry import get_registered_formats, get_format_by_id
from app.schemas.job_dto import IntentContextDTO, GenerationParameters
from app.validators.schema_validator import normalize_and_validate_format_data, generate_fallback_content
from app.exporters.pptx_exporter import export_presentation_to_pptx
from app.exporters.docx_exporter import export_advisory_or_summary_to_docx
from app.exporters.pdf_exporter import export_to_pdf
from app.ingestion.parser import parse_document
from app.ingestion.audio_video import transcribe_audio_or_video
from app.llm.client import generate_mock_ico

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

class AutomationTestRunner:
    def __init__(self):
        self.results: List[Dict[str, Any]] = []
        self.start_time = time.time()
        self.passed_count = 0
        self.failed_count = 0

    def record_test(self, suite: str, test_name: str, passed: bool, duration_ms: float, details: str = "", metadata: Dict[str, Any] = None):
        if passed:
            self.passed_count += 1
            status_str = "PASSED"
            prefix = "[PASS]"
        else:
            self.failed_count += 1
            status_str = "FAILED"
            prefix = "[FAIL]"
            
        entry = {
            "suite": suite,
            "test_name": test_name,
            "status": status_str,
            "passed": passed,
            "duration_ms": round(duration_ms, 2),
            "details": details,
            "metadata": metadata or {}
        }
        self.results.append(entry)
        print(f"{prefix} [{suite}] {test_name} - {status_str} ({round(duration_ms, 2)}ms) {details}")

    async def run_all(self):
        print("=" * 80)
        print("  ROOPANTAR-AI AUTOMATED COMPREHENSIVE TEST SUITE")
        print("=" * 80)

        await self.test_suite_database()
        await self.test_suite_generator_registry()
        await self.test_suite_intent_context_object()
        await self.test_suite_schema_validators()
        await self.test_suite_document_ingestion()
        await self.test_suite_exporters()
        await self.test_suite_end_to_end_job_flow()
        
        total_duration = round(time.time() - self.start_time, 2)
        total_tests = self.passed_count + self.failed_count
        pass_rate = round((self.passed_count / total_tests) * 100, 1) if total_tests > 0 else 0

        print("=" * 80)
        print(f"  TEST SUMMARY: {self.passed_count}/{total_tests} Passed ({pass_rate}%) | Duration: {total_duration}s")
        print("=" * 80)

        report = {
            "summary": {
                "total_tests": total_tests,
                "passed": self.passed_count,
                "failed": self.failed_count,
                "pass_rate_pct": pass_rate,
                "total_duration_seconds": total_duration,
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
            },
            "test_results": self.results
        }
        
        # Save JSON test report
        report_path = backend_dir / "automation_test_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            
        return report

    async def test_suite_database(self):
        suite = "Database & Async Engine"
        t0 = time.time()
        try:
            await init_db()
            async with AsyncSessionLocal() as session:
                self.record_test(suite, "Database Initialization & Async Session Connect", True, (time.time() - t0) * 1000, "SQLite aiosqlite connection verified.")
        except Exception as e:
            self.record_test(suite, "Database Initialization & Async Session Connect", False, (time.time() - t0) * 1000, str(e))

    async def test_suite_generator_registry(self):
        suite = "Generator Registry"
        expected_formats = [
            "advisory", "executive_summary", "linkedin", 
            "twitter", "presentation", "video_package", "infographic", "image_assets"
        ]
        
        t0 = time.time()
        generators = get_registered_formats()
        self.record_test(
            suite, 
            "Load All Generator Templates", 
            len(generators) == 8, 
            (time.time() - t0) * 1000,
            f"Loaded {len(generators)}/8 format templates from YAML.",
            {"loaded_ids": [g.id for g in generators]}
        )

        for fmt_id in expected_formats:
            t_sub = time.time()
            gen = get_format_by_id(fmt_id)
            if gen and gen.system_prompt and gen.prompt_template:
                self.record_test(
                    suite,
                    f"Validate Format Config [{fmt_id}]",
                    True,
                    (time.time() - t_sub) * 1000,
                    f"Name: '{gen.name}', Category: '{gen.category}', Exports: {gen.export_formats}"
                )
            else:
                self.record_test(
                    suite,
                    f"Validate Format Config [{fmt_id}]",
                    False,
                    (time.time() - t_sub) * 1000,
                    f"Missing schema or prompt template for {fmt_id}"
                )

    async def test_suite_intent_context_object(self):
        suite = "Intent Engine & ICO"
        t0 = time.time()
        sample_prompt = "Critical vulnerability CVE-2026-4419 detected across edge gateways. Immediate firmware hotfix HF-2026-9A mandated within 12 hours."
        
        ico_raw = generate_mock_ico(sample_prompt)
        try:
            ico = IntentContextDTO(**ico_raw)
            valid_ico = bool(ico.topic and ico.summary and len(ico.key_entities) > 0 and len(ico.key_facts) > 0)
            self.record_test(
                suite,
                "Intent Context Object (ICO) Pydantic Schema Validation",
                valid_ico,
                (time.time() - t0) * 1000,
                f"Extracted Topic: '{ico.topic}', Entities: {len(ico.key_entities)}, Facts: {len(ico.key_facts)}"
            )
        except Exception as e:
            self.record_test(suite, "Intent Context Object (ICO) Pydantic Schema Validation", False, (time.time() - t0) * 1000, str(e))

    async def test_suite_schema_validators(self):
        suite = "Schema Validators & Alias Normalizers"
        
        ico = IntentContextDTO(
            topic="Cyber Edge Infiltration Defense",
            domain="Enterprise Security",
            summary="A critical vulnerability CVE-2026-4419 was observed affecting gateway firmware.",
            key_entities=["Executive Steering Committee", "SecOps Unit", "Edge Infrastructure"],
            key_facts=["CVE-2026-4419 exploit active", "Affects EdgeOS v4.1 - v4.3", "Zero unauthorized root exfiltration confirmed"],
            risk_flags=["Critical Firmware Exploit", "12-Hour Compliance Window"],
            recommended_actions=["Apply emergency hotfix HF-2026-9A", "Isolate port 8443"],
            tone_signals=["Urgent", "Authoritative", "Action-Oriented"]
        )
        params = GenerationParameters(tone="Formal", audience="Leadership & Stakeholders", language="English", detail_level="Standard")

        formats = ["advisory", "executive_summary", "linkedin", "twitter", "presentation", "video_package", "infographic", "image_assets"]
        for fmt in formats:
            t0 = time.time()
            fallback = generate_fallback_content(fmt, ico, params)
            validated = normalize_and_validate_format_data(fmt, fallback, ico)
            is_valid = isinstance(validated, dict) and len(validated) > 0
            
            self.record_test(
                suite,
                f"Schema Validation & Normalization [{fmt}]",
                is_valid,
                (time.time() - t0) * 1000,
                f"Keys Verified: {list(validated.keys())[:3]}..."
            )

    async def test_suite_document_ingestion(self):
        suite = "Multi-Modal Ingestion Pipeline"
        
        # Test 1: Plain Text / Document Parser
        t0 = time.time()
        test_file = backend_dir / "tests" / "fixtures" / "sample_brief.txt"
        test_file.parent.mkdir(parents=True, exist_ok=True)
        test_file.write_text("Executive Threat Intelligence Briefing.\nIncident: CTI-2026-8841.\nTarget: Gateway firmware.", encoding="utf-8")
        
        extracted_text, file_type = parse_document(test_file, "sample_brief.txt")
        self.record_test(
            suite,
            "Plain Text / Markdown Ingestion",
            "Executive Threat Intelligence" in extracted_text and file_type == "text",
            (time.time() - t0) * 1000,
            f"Extracted {len(extracted_text)} chars, Type: {file_type}"
        )

        # Test 2: Audio/Video Fallback & Streaming Ingestion
        t1 = time.time()
        media_test_file = backend_dir / "tests" / "fixtures" / "sample_recording.mp4"
        media_test_file.write_bytes(b"RIFF\x00\x00\x00\x00WAVEfmt \x10\x00\x00\x00" + b"\x00" * 500)
        
        media_transcript = transcribe_audio_or_video(media_test_file)
        self.record_test(
            suite,
            "Audio/Video Media Ingestion & Whisper Fallback",
            bool(media_transcript and len(media_transcript) > 20),
            (time.time() - t1) * 1000,
            f"Generated transcript: {media_transcript[:60]}..."
        )

    async def test_suite_exporters(self):
        suite = "Native Document Exporters"
        temp_dir = backend_dir / "tests" / "export_output"
        temp_dir.mkdir(parents=True, exist_ok=True)

        # 1. PowerPoint .PPTX Exporter
        t0 = time.time()
        pptx_path = temp_dir / "test_presentation.pptx"
        sample_ppt = {
            "deck_title": "Enterprise Security Strategy",
            "subtitle": "Executive Threat Briefing",
            "target_audience": "Leadership",
            "slides": [
                {
                    "slide_number": 1,
                    "slide_type": "Title",
                    "title": "Enterprise Security Strategy",
                    "bullet_points": ["Comprehensive threat assessment", "Mitigation timeline overview"],
                    "speaker_notes": "Welcome team, today we review our operational stance."
                },
                {
                    "slide_number": 2,
                    "slide_type": "Context",
                    "title": "Perimeter Telemetry Analysis",
                    "bullet_points": [
                        "Identified probe sequences on external port 8443 with elevated packet entropy.",
                        "Enforced mandatory network isolation to prevent lateral reconnaissance."
                    ],
                    "speaker_notes": "Our SecOps telemetry identified anomalous connection probes early."
                }
            ]
        }
        res_pptx = export_presentation_to_pptx(sample_ppt, pptx_path)
        pptx_valid = pptx_path.exists() and pptx_path.stat().st_size > 1000
        self.record_test(
            suite,
            "PowerPoint (.PPTX) 16:9 Deck Generator",
            pptx_valid,
            (time.time() - t0) * 1000,
            f"File: {pptx_path.name} ({pptx_path.stat().st_size if pptx_path.exists() else 0} bytes)"
        )

        # 2. Word .DOCX Exporter
        t1 = time.time()
        docx_path = temp_dir / "test_advisory.docx"
        sample_adv = {
            "title": "Security Incident Directive",
            "advisory_id": "ADV-2026-TEST",
            "severity": "Critical",
            "date_issued": "2026-09-03",
            "summary": "Mandatory mitigation notice for perimeter gateways.",
            "threat_or_issue_breakdown": [{"heading": "Exploit Vector", "details": "Buffer condition on port 8443."}],
            "recommended_actions": [{"priority": "Immediate", "target_team": "SecOps", "action": "Apply Hotfix HF-2026-9A"}],
            "references": ["Enterprise Security Baseline 2026"]
        }
        res_docx = export_advisory_or_summary_to_docx("advisory", sample_adv, docx_path)
        docx_valid = docx_path.exists() and docx_path.stat().st_size > 1000
        self.record_test(
            suite,
            "Word (.DOCX) Advisory Document Generator",
            docx_valid,
            (time.time() - t1) * 1000,
            f"File: {docx_path.name} ({docx_path.stat().st_size if docx_path.exists() else 0} bytes)"
        )

        # 3. PDF Exporter
        t2 = time.time()
        pdf_path = temp_dir / "test_summary.pdf"
        sample_exec = {
            "title": "Executive Strategic Summary",
            "strategic_context": "Enterprise Security Strategy",
            "bottom_line_up_front": "Critical perimeter defenses require emergency hotfix compliance within 12 hours.",
            "key_findings": [{"area": "Perimeter", "observation": "Telemetry active", "business_or_mission_impact": "Zero breach"}],
            "decision_and_action_requirements": [{"decision_needed": "Authorize hotfix deployment", "stakeholder": "CISO", "timeline": "12h"}]
        }
        res_pdf = export_to_pdf("executive_summary", sample_exec, pdf_path)
        pdf_valid = pdf_path.exists() and pdf_path.stat().st_size > 1000
        self.record_test(
            suite,
            "PDF Document Generator (ReportLab)",
            pdf_valid,
            (time.time() - t2) * 1000,
            f"File: {pdf_path.name} ({pdf_path.stat().st_size if pdf_path.exists() else 0} bytes)"
        )

    async def test_suite_end_to_end_job_flow(self):
        suite = "End-to-End Fan-Out Transformation Engine"
        from app.models.job import Job, GeneratedOutput, IntentContext
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        
        t0 = time.time()
        test_job_id = f"test-job-{int(time.time())}"
        ico_data = {
            "topic": "Automated Testing Verification",
            "domain": "Quality Assurance",
            "summary": "End-to-end automated pipeline test verifying database persistence, ICO binding, and 7 parallel outputs.",
            "key_entities": ["QA Test Suite", "Roopantar-AI Core"],
            "key_facts": ["100% schema validation verified", "Parallel execution active"],
            "risk_flags": ["None"],
            "recommended_actions": ["Deploy release to production"],
            "tone_signals": ["Precise", "Authoritative"]
        }
        
        async with AsyncSessionLocal() as session:
            job = Job(
                id=test_job_id,
                status="completed",
                source_filename="test_brief.txt",
                source_file_type="text",
                source_raw_text="Test source text for automated verification.",
                selected_formats=["advisory", "executive_summary", "linkedin", "twitter", "presentation", "video_package", "infographic", "image_assets"],
                parameters={"tone": "Formal", "audience": "Leadership"},
                duration_seconds=1.25
            )
            session.add(job)
            
            intent_ctx = IntentContext(
                job_id=test_job_id,
                topic=ico_data["topic"],
                domain=ico_data["domain"],
                summary=ico_data["summary"],
                key_entities=ico_data["key_entities"],
                key_facts=ico_data["key_facts"],
                risk_flags=ico_data["risk_flags"],
                recommended_actions=ico_data["recommended_actions"],
                tone_signals=ico_data["tone_signals"],
                raw_json=ico_data
            )
            session.add(intent_ctx)
            await session.commit()
            
            # Add 8 outputs
            for fmt in job.selected_formats:
                ico_dto = IntentContextDTO(**ico_data)
                params_dto = GenerationParameters(tone="Formal", audience="Leadership")
                content = generate_fallback_content(fmt, ico_dto, params_dto)
                
                output = GeneratedOutput(
                    job_id=test_job_id,
                    format_type=fmt,
                    content_json=content,
                    status="completed",
                    generation_time=0.15
                )
                session.add(output)
            await session.commit()

            # Query back with relationships and verify
            stmt = select(Job).options(selectinload(Job.outputs), selectinload(Job.intent_context)).where(Job.id == test_job_id)
            res = await session.execute(stmt)
            loaded_job = res.scalar_one_or_none()
            
            is_e2e_valid = loaded_job is not None and len(loaded_job.outputs) == 8 and loaded_job.intent_context is not None
            self.record_test(
                suite,
                "E2E Database Job Persistence & 8-Format Linking",
                is_e2e_valid,
                (time.time() - t0) * 1000,
                f"Job ID: {test_job_id}, Outputs Linked: {len(loaded_job.outputs) if loaded_job else 0}/8, ICO Topic: '{loaded_job.intent_context.topic if loaded_job and loaded_job.intent_context else ''}'"
            )

if __name__ == "__main__":
    runner = AutomationTestRunner()
    asyncio.run(runner.run_all())
