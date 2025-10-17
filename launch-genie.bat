@echo off
echo ========================================
echo Launching Genie AI Extension
echo ========================================
echo.

echo Opening VS Code with Genie Extension...
echo.

cd genie-ai-extension
start code .

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. VS Code will open with the extension folder
echo 2. Press F5 to launch Extension Development Host
echo 3. A new VS Code window will open with Genie loaded
echo 4. Try these shortcuts:
echo    - Ctrl+Shift+L : Open AI Chat
echo    - Ctrl+Shift+B : Open Agent Builder
echo    - Ctrl+Shift+G : Generate Code
echo.
echo 5. Configure your API key:
echo    - Settings (Ctrl+,)
echo    - Search "Genie AI"
echo    - Enter your Anthropic API key
echo.

pause
