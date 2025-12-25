@echo off
echo Buscando proceso en puerto 3001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    echo Proceso encontrado: %%a
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Error al terminar el proceso %%a
    ) else (
        echo Proceso %%a terminado exitosamente
    )
)
echo.
echo Puerto 3001 liberado. Puedes ejecutar "npm run dev" ahora.
pause

