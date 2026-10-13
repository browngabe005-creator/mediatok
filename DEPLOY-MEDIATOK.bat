@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo   MediaTok - deploy Worker and website
echo ==========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not on PATH.
  echo Install Node.js LTS, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules\wrangler" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 goto failed
)
echo Applying pending migrations to the EXISTING remote D1 database...
call npx wrangler d1 migrations apply mediatok --remote
if errorlevel 1 goto failed
echo.
echo Deploying MediaTok to Cloudflare...
call npx wrangler deploy
if errorlevel 1 goto failed
echo.
echo Deploy command completed. Open https://mediatok.org and hard refresh with Ctrl+F5.
echo Existing D1 data was not reset or recreated by this script.
echo This script applies pending migrations and does not reset the existing D1 database.
pause
exit /b 0
:failed
echo.
echo Deployment failed. Read the error above. No database reset was attempted.
pause
exit /b 1
