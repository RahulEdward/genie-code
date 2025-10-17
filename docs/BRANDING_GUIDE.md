# Genie Branding Guide

## Visual Identity

### Logo
- Primary logo: Genie lamp icon
- Recommended style: Modern, minimalist
- File formats needed: SVG, PNG (multiple sizes), ICO, ICNS

### Color Palette
```
Primary: #7B2CBF (Purple - represents magic/AI)
Secondary: #FF6B35 (Orange - represents energy)
Accent: #00D9FF (Cyan - represents technology)
Background: #1E1E1E (Dark gray)
Text: #E0E0E0 (Light gray)
```

### Typography
- Primary font: Same as VS Code (Segoe UI on Windows, San Francisco on macOS)
- Code font: Cascadia Code or Fira Code recommended

## Key Files to Replace

### Icons (create these assets)
1. Application icons:
   - 16x16, 32x32, 48x48, 128x128, 256x256 PNG
   - Windows: code.ico
   - macOS: code.icns
   - Linux: code.png

2. Product icons:
   - Splash screen: 200x200
   - Welcome page: Various sizes
   - Marketplace: 128x128, 256x256

### Configuration Changes

#### product.json
```json
{
  "nameShort": "Genie",
  "nameLong": "Genie Code Editor",
  "applicationName": "genie",
  "dataFolderName": ".genie",
  "win32MutexName": "genie",
  "licenseName": "MIT",
  "licenseUrl": "https://github.com/YOUR_ORG/genie-editor/blob/main/LICENSE"
}
```

#### package.json
```json
{
  "name": "genie",
  "displayName": "Genie",
  "description": "AI-powered code editor",
  "version": "1.0.0"
}
```

## Naming Conventions

- Application: "Genie" or "Genie Code Editor"
- Executable: `genie` (lowercase)
- Config folder: `.genie`
- Process name: `genie`

## Legal Requirements

### Attribution
Always include in LICENSE and About dialog:
```
Based on Visual Studio Code
Copyright (c) Microsoft Corporation
https://github.com/microsoft/vscode

Genie modifications
Copyright (c) [Your Organization]
```

### MIT License Compliance
- Keep original MIT license text
- Add your copyright for modifications
- Maintain NOTICE file with all attributions
