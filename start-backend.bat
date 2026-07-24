@echo off
cd /d "%~dp0backend"
call .venv\Scripts\activate.bat
echo Starting backend on http://localhost:8000 ...
uvicorn app.main:app --reload
pause
