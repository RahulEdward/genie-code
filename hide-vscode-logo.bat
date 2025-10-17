@echo off
echo ========================================
echo   Hide VS Code Watermark Logo
echo ========================================
echo.

set CSS_FILE=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\workbench\workbench.desktop.main.css

if not exist "%CSS_FILE%" (
    echo [ERROR] CSS file not found
    echo Path: %CSS_FILE%
    pause
    exit /b 1
)

echo [OK] CSS file found
echo.

echo Adding CSS to hide VS Code watermark...
echo. >> "%CSS_FILE%"
echo /* === GENIE CUSTOM CSS - Hide VS Code Branding === */ >> "%CSS_FILE%"
echo. >> "%CSS_FILE%"
echo /* Hide the big VS Code watermark logo */ >> "%CSS_FILE%"
echo .monaco-workbench .part.editor ^> .content .editor-group-container ^> .editor-group-watermark { >> "%CSS_FILE%"
echo     background-image: none !important; >> "%CSS_FILE%"
echo     display: none !important; >> "%CSS_FILE%"
echo     opacity: 0 !important; >> "%CSS_FILE%"
echo     visibility: hidden !important; >> "%CSS_FILE%"
echo } >> "%CSS_FILE%"
echo. >> "%CSS_FILE%"
echo /* Hide welcome page background logo */ >> "%CSS_FILE%"
echo .welcome-page .editor-group-watermark { >> "%CSS_FILE%"
echo     display: none !important; >> "%CSS_FILE%"
echo } >> "%CSS_FILE%"
echo. >> "%CSS_FILE%"
echo /* Hide any VS Code logo references */ >> "%CSS_FILE%"
echo .codicon-vscode { >> "%CSS_FILE%"
echo     display: none !important; >> "%CSS_FILE%"
echo } >> "%CSS_FILE%"
echo. >> "%CSS_FILE%"
echo /* Add Genie branding */ >> "%CSS_FILE%"
echo .monaco-workbench .part.editor ^> .content .editor-group-container::before { >> "%CSS_FILE%"
echo     content: '🧞 Genie' !important; >> "%CSS_FILE%"
echo     position: absolute; >> "%CSS_FILE%"
echo     top: 50%%; >> "%CSS_FILE%"
echo     left: 50%%; >> "%CSS_FILE%"
echo     transform: translate(-50%%, -50%%); >> "%CSS_FILE%"
echo     font-size: 120px; >> "%CSS_FILE%"
echo     color: #7B2CBF; >> "%CSS_FILE%"
echo     opacity: 0.05; >> "%CSS_FILE%"
echo     pointer-events: none; >> "%CSS_FILE%"
echo     z-index: 0; >> "%CSS_FILE%"
echo } >> "%CSS_FILE%"
echo. >> "%CSS_FILE%"

echo [OK] CSS added successfully!
echo.
echo ========================================
echo   VS Code Logo Hidden!
echo ========================================
echo.
echo Please RESTART VS Code to see changes.
echo.
echo What changed:
echo - VS Code watermark hidden
echo - Genie watermark added (subtle)
echo.
pause
