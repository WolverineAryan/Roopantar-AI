@echo off
echo ========================================================
echo Starting Roopantar-AI Next.js Frontend...
echo ========================================================
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
echo Starting Next.js development server on http://localhost:3000 ...
npm run dev
pause
