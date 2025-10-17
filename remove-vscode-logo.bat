@echo off
echo ========================================
echo   Remove VS Code Logo and Branding
echo ========================================
echo.

set VSCODE_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app

REM Check if VS Code exists
if not exist "%VSCODE_PATH%" (
    echo [ERROR] VS Code not found
    pause
    exit /b 1
)

echo [1/4] Disabling welcome page...
REM Apply updated product.json with welcome page disabled
copy /Y "%~dp0vscode\product.json" "%VSCODE_PATH%\product.json" >nul
echo [OK] Welcome page disabled

echo.
echo [2/4] Hiding VS Code watermark...
REM Add CSS to hide watermark
echo /* Genie Custom CSS - Hide VS Code Branding */ >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo .monaco-workbench .part.editor ^> .content .editor-group-container ^> .editor-group-watermark { >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo     background-image: none !important; >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo     opacity: 0 !important; >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo } >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo [OK] Watermark hidden

echo.
echo [3/4] Removing Copilot (if installed)...
code --uninstall-extension GitHub.copilot 2>nul
code --uninstall-extension GitHub.copilot-chat 2>nul
echo [OK] Copilot removed

echo.
echo [4/4] Applying Genie branding...
copy /Y "%~dp0vscode\extensions\theme-defaults\themes\*.json" "%VSCODE_PATH%\extensions\theme-defaults\themes\" >nul
echo [OK] Genie themes applied

echo.
echo ========================================
echo   VS Code Branding Removed!
echo ========================================
echo.
echo Changes applied:
echo - Welcome page disabled
echo - VS Code watermark hidden
echo - Copilot removed
echo - Genie themes active
echo.
echo Restart VS Code to see changes.
echo.
pause
