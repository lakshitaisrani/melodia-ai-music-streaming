@echo off
title Melodia Application Services Launcher
echo ===================================================
echo   MELODIA - Listen. Discover. Create.
echo ===================================================
echo.
echo Starting application services...
echo.

:: Apply NVM Node.js path workaround
:: Apply NVM Node.js path workaround (Removed)

:: Start Express Server
echo [1/2] Launching Backend Server...
start "Melodia Server Logs" cmd /k "cd server && npm run dev"

:: Start Vite Client
echo [2/2] Launching Frontend Client...
start "Melodia Client Logs" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo   All services have been dispatched!
echo   * Client: http://localhost:5173
echo   * Server: http://localhost:5000
echo ===================================================
echo.
pause
