import sys
import time
import json
import asyncio
from pathlib import Path
from typing import Dict, Any, List

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Ensure UTF-8 output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db

async def run_api_tests():
    print("\n" + "=" * 80)
    print("  FASTAPI ROUTE & INTEGRATION ENDPOINT TEST SUITE")
    print("=" * 80)
    
    await init_db()
    passed = 0
    total = 0
    test_results = []
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        
        # 1. Root Status Endpoint
        total += 1
        t0 = time.time()
        resp = await client.get("/")
        is_ok = resp.status_code == 200 and resp.json().get("status") == "online"
        dt = round((time.time() - t0) * 1000, 2)
        if is_ok: passed += 1
        prefix = "[PASS]" if is_ok else "[FAIL]"
        print(f"{prefix} GET / -> HTTP {resp.status_code} ({dt}ms) -> {resp.json().get('app')}")
        test_results.append({"endpoint": "GET /", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt})

        # 2. Health Endpoint
        total += 1
        t0 = time.time()
        resp = await client.get("/api/health")
        is_ok = resp.status_code == 200 and "status" in resp.json()
        dt = round((time.time() - t0) * 1000, 2)
        if is_ok: passed += 1
        prefix = "[PASS]" if is_ok else "[FAIL]"
        print(f"{prefix} GET /api/health -> HTTP {resp.status_code} ({dt}ms) -> Status: {resp.json().get('status')}")
        test_results.append({"endpoint": "GET /api/health", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt})

        # 3. Formats Registry Endpoint
        total += 1
        t0 = time.time()
        resp = await client.get("/api/formats")
        data = resp.json()
        is_ok = resp.status_code == 200 and isinstance(data, list) and len(data) == 7
        dt = round((time.time() - t0) * 1000, 2)
        if is_ok: passed += 1
        prefix = "[PASS]" if is_ok else "[FAIL]"
        print(f"{prefix} GET /api/formats -> HTTP {resp.status_code} ({dt}ms) -> Returned {len(data)}/7 Formats")
        test_results.append({"endpoint": "GET /api/formats", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt, "count": len(data)})

        # 4. Job Creation & Multi-Format Generation Endpoint
        total += 1
        t0 = time.time()
        form_data = {
            "raw_text": (None, "GLOBAL CYBER DEFENSE INITIATIVE | Critical Vulnerability CVE-2026-4419 detected. Emergency hotfix HF-2026-9A mandated for all edge gateways within 12 hours."),
            "selected_formats": (None, json.dumps(["presentation", "advisory", "linkedin"])),
            "parameters": (None, json.dumps({"tone": "Formal", "audience": "Leadership"}))
        }
        resp = await client.post("/api/jobs", files=form_data)
        job_data = resp.json()
        is_ok = resp.status_code == 200 and "id" in job_data and len(job_data.get("outputs", [])) == 3
        dt = round((time.time() - t0) * 1000, 2)
        if is_ok: passed += 1
        created_job_id = job_data.get("id") if is_ok else None
        prefix = "[PASS]" if is_ok else "[FAIL]"
        print(f"{prefix} POST /api/jobs -> HTTP {resp.status_code} ({dt}ms) -> Job ID: {created_job_id}, Outputs: {len(job_data.get('outputs', []))}")
        test_results.append({"endpoint": "POST /api/jobs", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt, "job_id": created_job_id})

        # 5. Get Job by ID Endpoint
        if created_job_id:
            total += 1
            t0 = time.time()
            resp = await client.get(f"/api/jobs/{created_job_id}")
            fetched_job = resp.json()
            is_ok = resp.status_code == 200 and fetched_job.get("id") == created_job_id
            dt = round((time.time() - t0) * 1000, 2)
            if is_ok: passed += 1
            prefix = "[PASS]" if is_ok else "[FAIL]"
            print(f"{prefix} GET /api/jobs/{created_job_id} -> HTTP {resp.status_code} ({dt}ms)")
            test_results.append({"endpoint": f"GET /api/jobs/{created_job_id}", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt})

            # 6. Single Format Regeneration Endpoint
            total += 1
            t0 = time.time()
            regen_payload = {
                "parameters": {"tone": "Urgent", "audience": "Executive Leadership"},
                "custom_instructions": "Highlight the 12-hour mitigation compliance window in the headline."
            }
            resp = await client.post(f"/api/jobs/{created_job_id}/formats/presentation", json=regen_payload)
            regen_out = resp.json()
            is_ok = resp.status_code == 200 and regen_out.get("format_type") == "presentation"
            dt = round((time.time() - t0) * 1000, 2)
            if is_ok: passed += 1
            prefix = "[PASS]" if is_ok else "[FAIL]"
            print(f"{prefix} POST /api/jobs/{created_job_id}/formats/presentation -> HTTP {resp.status_code} ({dt}ms) -> Regenerated successfully")
            test_results.append({"endpoint": f"POST /api/jobs/{created_job_id}/formats/presentation", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt})

            # 7. File Export Download Endpoint (.pptx)
            total += 1
            t0 = time.time()
            resp = await client.get(f"/api/jobs/{created_job_id}/export/presentation?file_ext=pptx")
            is_ok = resp.status_code == 200 and len(resp.content) > 1000
            dt = round((time.time() - t0) * 1000, 2)
            if is_ok: passed += 1
            prefix = "[PASS]" if is_ok else "[FAIL]"
            print(f"{prefix} GET /api/jobs/{created_job_id}/export/presentation -> HTTP {resp.status_code} ({dt}ms) -> Downloaded {len(resp.content)} bytes (.pptx)")
            test_results.append({"endpoint": f"GET /api/jobs/{created_job_id}/export/presentation", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt, "bytes": len(resp.content)})

        # 8. List Jobs Endpoint
        total += 1
        t0 = time.time()
        resp = await client.get("/api/jobs")
        jobs_list = resp.json()
        is_ok = resp.status_code == 200 and isinstance(jobs_list, list) and len(jobs_list) > 0
        dt = round((time.time() - t0) * 1000, 2)
        if is_ok: passed += 1
        prefix = "[PASS]" if is_ok else "[FAIL]"
        print(f"{prefix} GET /api/jobs -> HTTP {resp.status_code} ({dt}ms) -> Found {len(jobs_list)} Jobs")
        test_results.append({"endpoint": "GET /api/jobs", "status_code": resp.status_code, "passed": is_ok, "latency_ms": dt, "count": len(jobs_list)})

    print("=" * 80)
    print(f"  API ROUTE SUMMARY: {passed}/{total} Passed ({round((passed/total)*100, 1)}%)")
    print("=" * 80)
    
    return {
        "summary": {
            "total_endpoints_tested": total,
            "passed": passed,
            "failed": total - passed,
            "pass_rate_pct": round((passed/total)*100, 1)
        },
        "endpoints": test_results
    }

if __name__ == "__main__":
    asyncio.run(run_api_tests())
