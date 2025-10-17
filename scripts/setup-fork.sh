#!/bin/bash
# Setup script for forking VS Code to Genie

set -e

echo "🧞 Setting up Genie Editor fork..."

# Check if vscode directory exists
if [ -d "vscode" ]; then
    echo "❌ vscode directory already exists. Please remove it first."
    exit 1
fi

# Clone VS Code
echo "📥 Cloning VS Code repository..."
git clone https://github.com/microsoft/vscode.git vscode
cd vscode

# Add Genie remote (update with your repository URL)
echo "🔗 Adding Genie remote..."
# git remote add genie https://github.com/YOUR_ORG/genie-editor.git

# Create development branch
echo "🌿 Creating genie-dev branch..."
git checkout -b genie-dev

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the remote URL in this script with your Genie repository"
echo "2. Run 'cd vscode' to enter the project directory"
echo "3. Follow PHASE1_CHECKLIST.md to complete rebranding"
echo "4. Run 'yarn watch' to start development build"
