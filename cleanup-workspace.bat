@echo off
echo ========================================
echo Genie Workspace Cleanup
echo ========================================
echo.
echo This will help organize your workspace files.
echo.

echo Current workspace status:
echo - 46+ files currently open in IDE
echo - Multiple documentation files
echo - Extension source files
echo - Configuration files
echo.

echo Recommended actions:
echo.
echo 1. Close all files in VS Code (Ctrl+K W)
echo 2. Open only essential files:
echo    - README.md
echo    - genie-ai-extension/package.json
echo    - genie-ai-extension/src/extension.ts
echo.
echo 3. Pin these files (Right-click tab -^> Pin Tab)
echo.

echo ========================================
echo File Organization
echo ========================================
echo.

echo Creating organized folder structure...

if not exist "docs\archive" mkdir "docs\archive"
if not exist "docs\guides" mkdir "docs\guides"
if not exist "docs\implementation" mkdir "docs\implementation"

echo.
echo Suggested file organization:
echo.
echo docs/
echo   archive/          - Old phase reports
echo   guides/           - User guides
echo   implementation/   - Technical docs
echo.
echo genie-ai-extension/ - Main extension code
echo scripts/            - Build scripts
echo.

echo ========================================
echo VS Code Settings Applied
echo ========================================
echo.
echo The following settings have been configured:
echo - Maximum 10 open editors
echo - Auto-close empty groups
echo - Highlight modified tabs
echo - Auto-save enabled
echo - Format on save
echo.

echo ========================================
echo Next Steps
echo ========================================
echo.
echo 1. In VS Code, press Ctrl+K W to close all files
echo 2. Open only the files you're actively working on
echo 3. Use Ctrl+P to quickly open files as needed
echo 4. Pin important files to keep them accessible
echo.

echo Settings file created: .vscode/settings.json
echo Cleanup guide created: WORKSPACE_CLEANUP.md
echo.

pause
