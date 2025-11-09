@echo off
echo.
echo ===========================================
echo   Starting EMI Marketplace for Demo
echo ===========================================
echo.

echo [1/3] Starting Backend Server on Port 5001...
echo.
start "Backend Server" cmd /k "cd /d C:\code\1fi\2nd\backend && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend Server on Port 3000...
echo.
start "Frontend Server" cmd /k "cd /d C:\code\1fi\2nd\frontend && npm start"

echo [3/3] Demo URLs:
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5001/api
echo.
echo ===========================================
echo   Demo servers are starting up...
echo   Frontend will open automatically in browser
echo ===========================================
echo.
pause