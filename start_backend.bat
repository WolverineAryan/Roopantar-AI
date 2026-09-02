@echo off
echo ========================================================
echo Starting Roopantar-AI Backend (FastAPI + Uvicorn)...
echo ========================================================
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Starting server on http://localhost:8000 ...
uvicorn app.main:app --reload --port 8000
pause
