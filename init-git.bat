@echo off
echo ========================================
echo   Git Initialization for Game Off 2025
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/6] Initializing Git repository...
git init
if errorlevel 1 (
    echo ERROR: Failed to initialize Git
    pause
    exit /b 1
)

echo.
echo [2/6] Adding all files...
git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo [3/6] Creating initial commit...
git commit -m "Initial commit - Whispers of the Wave for Game Off 2025"
if errorlevel 1 (
    echo ERROR: Failed to create commit
    pause
    exit /b 1
)

echo.
echo [4/6] Renaming branch to main...
git branch -M main
if errorlevel 1 (
    echo WARNING: Failed to rename branch (might already be main)
)

echo.
echo ========================================
echo   Git initialized successfully!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Create a GitHub repository:
echo    - Go to: https://github.com/new
echo    - Name: whispers-of-the-wave
echo    - Make it PUBLIC
echo    - Do NOT initialize with README
echo.
echo 2. Copy your repository URL (should look like):
echo    https://github.com/YOUR_USERNAME/whispers-of-the-wave.git
echo.
echo 3. Run these commands:
echo    git remote add origin YOUR_REPO_URL
echo    git push -u origin main
echo.
echo ========================================
pause
