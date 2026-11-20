@echo off
echo ==========================================================
echo        WanderWise - Virtual Travel Agent Copilot
echo               VOYAGEHACK 4.0 - Team INVICTUS
echo ==========================================================
echo.
echo Starting WanderWise Full-Stack Application...
echo.
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
