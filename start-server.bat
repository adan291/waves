@echo off
echo ========================================
echo   Whispers of the Wave - Local Server
echo ========================================
echo.
echo Starting server on port 8000...
echo.
echo IMPORTANTE: Usa este servidor para evitar errores de CORS
echo.
echo Abre tu navegador en: http://localhost:8000
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.
python -m http.server 8000
