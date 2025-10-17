# How to Run Genie Editor (VS Code Fork)

## Prerequisites

Before running Genie, ensure you have:
- ✅ Node.js 18.x or later
- ✅ Python 3.11 or later
- ✅ Git
- ✅ npm (comes with Node.js)
- ✅ Windows Build Tools (for Windows)

## Quick Start

### Option 1: Run Pre-built VS Code with Genie Extension

If you just want to use the Genie AI extension:

```bash
# Install the extension in your existing VS Code
cd genie-ai-extension
npm install
npm run compile

# Package the extension
npm install -g @vscode/vsce
vsce package

# Install in VS Code
code --install-extension genie-ai-1.0.0.vsix
```

### Option 2: Build and Run Genie Editor from Source

#### Step 1: Install Dependencies

```bash
cd vscode
npm install
```

**Note**: This may take 10-15 minutes as it downloads all VS Code dependencies.

#### Step 2: Build the Editor

```bash
# Build once
npm run compile

# Or watch for changes (development mode)
npm run watch
```

#### Step 3: Run Genie Editor

**Windows:**
```bash
.\scripts\code.bat
```

**macOS/Linux:**
```bash
./scripts/code.sh
```

## Troubleshooting

### Error: "Cannot find module 'gulp-sort'"

**Solution:**
```bash
cd vscode
npm install
npm install gulp-sort --save-dev
```

### Error: "Python not found"

**Solution:**
1. Install Python 3.11+
2. Add Python to PATH
3. Run: `npm config set python "C:\Python311\python.exe"`

### Error: "MSBuild not found" (Windows)

**Solution:**
```bash
npm install --global windows-build-tools
```

### Error: "node-gyp rebuild failed"

**Solution:**
```bash
npm install --global node-gyp
npm config set msvs_version 2019
```

## Development Workflow

### 1. Make Changes to Extension

```bash
cd genie-ai-extension
# Edit files in src/
npm run compile
```

### 2. Test in Development Mode

```bash
# In VS Code, press F5 to launch Extension Development Host
# Or run:
code --extensionDevelopmentPath=./genie-ai-extension
```

### 3. Build for Production

```bash
cd vscode
npm run compile
npm run gulp vscode-win32-x64  # Windows
npm run gulp vscode-darwin-x64  # macOS
npm run gulp vscode-linux-x64   # Linux
```

## Running Just the Extension

If you don't need to build the entire editor:

### Step 1: Install Extension Dependencies

```bash
cd genie-ai-extension
npm install
```

### Step 2: Compile TypeScript

```bash
npm run compile
```

### Step 3: Test in VS Code

Press `F5` in VS Code to launch Extension Development Host

Or manually:
```bash
code --extensionDevelopmentPath=D:\folder\genie-ai-extension
```

## Quick Commands Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Compile once | `npm run compile` |
| Watch mode | `npm run watch` |
| Run editor (Windows) | `.\scripts\code.bat` |
| Run editor (Mac/Linux) | `./scripts/code.sh` |
| Package extension | `vsce package` |
| Install extension | `code --install-extension genie-ai-1.0.0.vsix` |

## Configuration

### Set Anthropic API Key

After launching Genie:
1. Open Settings: `Ctrl+,`
2. Search for "Genie AI"
3. Enter your Anthropic API key in `genie.apiKey`

Or via settings.json:
```json
{
  "genie.apiKey": "your-api-key-here",
  "genie.model": "claude-3-5-sonnet-20241022",
  "genie.maxTokens": 4096,
  "genie.temperature": 0.7
}
```

## Using Genie Features

### Open AI Chat
- Press `Ctrl+Shift+L`
- Or click "✨ Genie AI" in status bar
- Or Command Palette → "Genie: Open AI Chat"

### Open Agent Builder
- Press `Ctrl+Shift+B`
- Or Command Palette → "Genie: Open Agent Builder"

### Generate Code
- Press `Ctrl+Shift+G`
- Or Command Palette → "Genie: Generate Code"

## Performance Tips

### Speed Up Build Time

1. **Use SSD**: Build on SSD drive
2. **Increase Memory**: 
   ```bash
   set NODE_OPTIONS=--max-old-space-size=8192
   ```
3. **Disable Antivirus**: Temporarily for build folder
4. **Close Other Apps**: Free up RAM

### Reduce Watch Mode Resource Usage

Edit `vscode/.vscode/settings.json`:
```json
{
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/out/**": true,
    "**/dist/**": true
  }
}
```

## Common Issues

### Issue: Build is very slow

**Solution:**
- Close other applications
- Use `npm run compile` instead of `npm run watch`
- Build on SSD drive

### Issue: Extension not loading

**Solution:**
```bash
# Rebuild extension
cd genie-ai-extension
rm -rf node_modules out
npm install
npm run compile
```

### Issue: Changes not reflecting

**Solution:**
- Restart Extension Development Host
- Or reload window: `Ctrl+R`

## Project Structure

```
genie-code/
├── vscode/                      # VS Code source (gitignored)
│   ├── extensions/
│   │   └── genie-ai/           # Extension in VS Code tree
│   ├── scripts/
│   │   ├── code.bat            # Run on Windows
│   │   └── code.sh             # Run on Mac/Linux
│   └── package.json
│
├── genie-ai-extension/         # Standalone extension
│   ├── src/
│   │   ├── extension.ts        # Main entry
│   │   ├── chatPanel.ts        # Chat UI
│   │   ├── agentBuilder.ts     # Agent Builder
│   │   └── anthropicClient.ts  # API client
│   ├── package.json
│   └── tsconfig.json
│
└── docs/                       # Documentation
```

## Next Steps

1. **Install Dependencies**
   ```bash
   cd vscode
   npm install
   ```

2. **Compile Extension**
   ```bash
   cd ../genie-ai-extension
   npm install
   npm run compile
   ```

3. **Run Genie**
   ```bash
   cd ../vscode
   .\scripts\code.bat
   ```

4. **Configure API Key**
   - Settings → Genie AI → API Key

5. **Start Coding**
   - Press `Ctrl+Shift+L` to open chat
   - Press `Ctrl+Shift+B` to open agent builder

## Resources

- [VS Code Build Instructions](https://github.com/microsoft/vscode/wiki/How-to-Contribute)
- [Extension Development](https://code.visualstudio.com/api)
- [Anthropic API Docs](https://docs.anthropic.com/)

## Support

If you encounter issues:
1. Check this guide
2. Review error messages
3. Check GitHub Issues
4. Ask in Discussions

---

**Happy Coding with Genie! ✨🚀**
