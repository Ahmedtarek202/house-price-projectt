@echo off
cd /d "%~dp0frontend"
echo Starting frontend on http://localhost:5173 ...
start "" cmd /c "timeout /t 4 >nul & start http://localhost:5173"
call npm run dev
pause
