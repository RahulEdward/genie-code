# Building Genie from Source

## Prerequisites

### All Platforms
- Node.js 18.x or later
- npm (comes with Node.js)
- Git
- Python 3.11+

### Windows
- Visual Studio 2022 with C++ tools
- Windows 10 SDK

### macOS
- Xcode Command Line Tools
- macOS 10.15 or later

### Linux
- build-essential
- libx11-dev, libxkbfile-dev, libsecret-1-dev
- libgtk-3-dev

## Build Steps

### 1. Clone and Setup
```bash
# Run the setup script
./scripts/setup-fork.sh  # macOS/Linux
.\scripts\setup-fork.bat  # Windows

cd vscode
```

### 2. Development Build
```bash
# Start watch mode (compiles on file changes)
npm run watch

# In a separate terminal, launch Genie
./scripts/code.sh  # macOS/Linux
.\scripts\code.bat  # Windows
```

### 3. Production Build

#### Windows
```bash
npm run gulp vscode-win32-x64
```

#### macOS
```bash
npm run gulp vscode-darwin-x64
# or for Apple Silicon
npm run gulp vscode-darwin-arm64
```

#### Linux
```bash
npm run gulp vscode-linux-x64
```

## Common Issues

### Node Version
Ensure you're using Node 18.x. Use nvm to manage versions:
```bash
nvm install 18
nvm use 18
```

### Python Version
VS Code build requires Python 3.11+:
```bash
python --version  # Should be 3.11 or higher
```

### Build Errors
If you encounter build errors:
```bash
# Clean and reinstall
npm run clean
rm -rf node_modules
npm install
```

## Development Tips

### Fast Iteration
- Use `npm run watch` for automatic recompilation
- Keep the watch process running while developing
- Launch with `./scripts/code.sh` to test changes

### Debugging
- Press F5 in VS Code to launch debug instance
- Use Chrome DevTools for renderer process
- Check logs in Help > Toggle Developer Tools

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run integration-test
```
