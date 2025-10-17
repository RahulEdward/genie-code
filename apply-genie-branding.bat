@echo off
echo ========================================
echo   Genie Branding Applicator
echo ========================================
echo.

REM Set paths
set VSCODE_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code
set GENIE_PATH=%~dp0vscode

REM Check if VS Code is installed
if not exist "%VSCODE_PATH%\Code.exe" (
    echo [ERROR] VS Code not found at: %VSCODE_PATH%
    echo.
    echo Please install VS Code from: https://code.visualstudio.com/
    echo.
    pause
    exit /b 1
)

echo [OK] VS Code found
echo.

REM Check if Genie files exist
if not exist "%GENIE_PATH%\product.json" (
    echo [ERROR] Genie files not found at: %GENIE_PATH%
    echo.
    echo Please make sure you're running this from the genie-editor folder
    echo.
    pause
    exit /b 1
)

echo [OK] Genie files found
echo.

REM Create backup
echo Creating backup of original files...
if not exist "%VSCODE_PATH%\resources\app\product.json.backup" (
    copy "%VSCODE_PATH%\resources\app\product.json" "%VSCODE_PATH%\resources\app\product.json.backup" >nul
    echo [OK] Backup created
) else (
    echo [INFO] Backup already exists
)
echo.

REM Copy product.json
echo Applying Genie branding...
copy /Y "%GENIE_PATH%\product.json" "%VSCODE_PATH%\resources\app\product.json" >nul
if %errorlevel%==0 (
    echo [OK] product.json applied
) else (
    echo [ERROR] Failed to copy product.json
    echo Try running as Administrator
    pause
    exit /b 1
)

REM Copy themes
echo Applying Genie themes...
xcopy /Y "%GENIE_PATH%\extensions\theme-defaults\themes\*.json" "%VSCODE_PATH%\resources\app\extensions\theme-defaults\themes\" >nul
if %errorlevel%==0 (
    echo [OK] Themes applied
) else (
    echo [ERROR] Failed to copy themes
)

REM Remove Copilot integration
echo.
echo Removing Copilot integration...
if exist "%GENIE_PATH%\.github\copilot-instructions.md" del "%GENIE_PATH%\.github\copilot-instructions.md" 2>nul
if exist "%GENIE_PATH%\.github\workflows\copilot-setup-steps.yml" del "%GENIE_PATH%\.github\workflows\copilot-setup-steps.yml" 2>nul
if exist "%GENIE_PATH%\.github\ISSUE_TEMPLATE\copilot_bug_report.md" del "%GENIE_PATH%\.github\ISSUE_TEMPLATE\copilot_bug_report.md" 2>nul
if exist "%GENIE_PATH%\extensions\typescript-language-features\src\languageFeatures\util\copilot.ts" del "%GENIE_PATH%\extensions\typescript-language-features\src\languageFeatures\util\copilot.ts" 2>nul
echo [OK] Copilot integration removed

echo.
echo ========================================
echo   Genie Branding Applied Successfully!
echo ========================================
echo.
echo What to expect:
echo - Title bar will show "Genie"
echo - 4 new Genie themes available
echo - Purple and orange color accents
echo.
echo Press Ctrl+K Ctrl+T to change theme
echo.
echo To restore original VS Code:
echo Run: restore-vscode.bat
echo.
pause

REM Launch VS Code
echo Launching Genie...
start "" "%VSCODE_PATH%\Code.exe"
