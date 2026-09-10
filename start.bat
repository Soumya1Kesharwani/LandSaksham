@echo off
echo ======================================================================
echo National Land ^& Infrastructure Intelligence System (NLIIS) - SIH 2026
echo ======================================================================

set "PATH=C:\Program Files\nodejs;%PATH%"
set "PYTHON_EXE=C:\Users\Lenovo\AppData\Local\Python\pythoncore-3.14-64\python.exe"

if not exist "%PYTHON_EXE%" (
    where python >nul 2>&1
    if %errorlevel% equ 0 (
        set "PYTHON_EXE=python"
    ) else (
        echo [ERROR] Python executable not found.
        pause
        exit /b 1
    )
)

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "NLIIS Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && "%PYTHON_EXE%" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://127.0.0.1:5173 ...
start "NLIIS Frontend (Vite)" cmd /k "cd /d "%~dp0frontend" && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo ======================================================================
echo Both servers are launching!
echo Backend API Docs: http://127.0.0.1:8000/docs
echo Frontend Portal:  http://127.0.0.1:5173
echo ======================================================================
