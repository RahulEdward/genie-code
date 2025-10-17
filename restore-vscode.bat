@echo off
echo ========================================
echo   Restore Original VS Code
echo ========================================
echo.

REM Set paths
set VSCODE_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code

REM Check if backup exists
if not exist "%VSCODE_PATH%\resources\app\product.json.backup" (
    echo [ERROR] Backup not found
    echo.
    echo No backup to restore. VS Code might already be in original state.
    echo.
    pause
    exit /b 1
)

echo [OK] Backup found
echo.

REM Restore backup
echo Restoring original VS Code...
copy /Y "%VSCODE_PATH%\resources\app\product.json.backup" "%VSCODE_PATH%\resources\app\product.json" >nul
if %errorlevel%==0 (
    echo [OK] Original product.json restored
) else (
    echo [ERROR] Failed to restore
    echo Try running as Administrator
    pause
    exit /b 1
)

echo.
echo ========================================
echo   VS Code Restored Successfully!
echo ========================================
echo.
echo Original VS Code branding has been restored.
echo Genie themes will still be available.
echo.
pause
