@echo off
REM Setup script for forking VS Code to Genie (Windows)

echo Setting up Genie Editor fork...

REM Check if vscode directory exists
if exist "vscode" (
    echo vscode directory already exists. Please remove it first.
    exit /b 1
)

REM Clone VS Code
echo Cloning VS Code repository...
git clone https://github.com/microsoft/vscode.git vscode
cd vscode

REM Add Genie remote (update with your repository URL)
echo Adding Genie remote...
REM git remote add genie https://github.com/YOUR_ORG/genie-editor.git

REM Create development branch
echo Creating genie-dev branch...
git checkout -b genie-dev

REM Install dependencies
echo Installing dependencies...
call yarn install

echo Setup complete!
echo.
echo Next steps:
echo 1. Update the remote URL in this script with your Genie repository
echo 2. Run 'cd vscode' to enter the project directory
echo 3. Follow PHASE1_CHECKLIST.md to complete rebranding
echo 4. Run 'yarn watch' to start development build
