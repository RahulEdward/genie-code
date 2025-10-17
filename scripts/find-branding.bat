@echo off
REM Script to find all VS Code branding references (Windows)

echo Searching for VS Code branding references...
echo.

echo === Searching for 'Visual Studio Code' ===
findstr /S /I /C:"Visual Studio Code" *.ts *.js *.json *.html 2>nul | findstr /V /C:"node_modules" | more

echo.
echo === Checking package.json ===
findstr /N "\"name\":" package.json

echo.
echo === Checking product.json ===
findstr /N "applicationName" product.json

echo.
echo Review these files and update branding accordingly
