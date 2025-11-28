@echo off
echo ========================================
echo   Creating Game Off 2025 Submission ZIP
echo ========================================
echo.

REM Create temporary directory
if exist "submission-temp" rmdir /s /q submission-temp
mkdir submission-temp

echo [1/5] Copying essential files...
copy index.html submission-temp\
copy manifest.json submission-temp\
copy sw.js submission-temp\
copy LICENSE submission-temp\
copy README.md submission-temp\
copy favicon.svg submission-temp\

echo [2/5] Copying CSS...
xcopy /E /I css submission-temp\css

echo [3/5] Copying JavaScript...
xcopy /E /I js submission-temp\js
REM Remove the local config (users will need their own)
if exist "submission-temp\js\config.local.js" del submission-temp\js\config.local.js

echo [4/5] Copying assets...
xcopy /E /I assets submission-temp\assets

echo [5/5] Creating ZIP...
powershell Compress-Archive -Path submission-temp\* -DestinationPath whispers-of-the-wave-gameoff2025.zip -Force

echo.
echo Cleaning up...
rmdir /s /q submission-temp

echo.
echo ========================================
echo   ZIP created successfully!
echo ========================================
echo.
echo File: whispers-of-the-wave-gameoff2025.zip
echo.
echo Next steps:
echo 1. Go to: https://itch.io/game/new
echo 2. Upload this ZIP file
echo 3. Set as "HTML" project
echo 4. Set index.html as the main file
echo.
pause
