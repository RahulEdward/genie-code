#!/bin/bash
# Script to find all VS Code branding references

echo "🔍 Searching for VS Code branding references..."
echo ""

echo "=== Searching for 'Visual Studio Code' ==="
grep -r "Visual Studio Code" --include="*.ts" --include="*.js" --include="*.json" --include="*.html" . | head -20

echo ""
echo "=== Searching for 'vscode' in file names ==="
find . -name "*vscode*" -type f | grep -v node_modules | grep -v .git | head -20

echo ""
echo "=== Searching for product name in package.json ==="
grep -n "\"name\":" package.json

echo ""
echo "=== Searching for application name in product.json ==="
grep -n "applicationName" product.json

echo ""
echo "💡 Review these files and update branding accordingly"
