# 🎨 Remove VS Code Branding - Complete Guide

**Issue:** VS Code logo aur Copilot icon abhi bhi dikh rahe hain

---

## 🔍 Kya Remove Karna Hai

### 1. **Center VS Code Logo** (Watermark)
- Welcome page par bada VS Code logo
- Background watermark

### 2. **Copilot Icon** (Bottom Bar)
- GitHub Copilot extension icon
- Status bar mein AI icon

### 3. **Application Icon** (Taskbar/Title)
- Window icon
- Taskbar icon
- File icons

---

## ✅ Solution 1: Remove Welcome Watermark

### Location
The VS Code logo is in the compiled CSS/JavaScript files.

### Option A: Disable Welcome Page
Add to `product.json`:

```json
{
  "welcomePage": {
    "enabled": false
  }
}
```

### Option B: Custom CSS (Quick Fix)
Create a custom CSS file to hide the logo:

**File:** `vscode/resources/app/out/vs/workbench/workbench.desktop.main.css`

Add at the end:
```css
/* Hide VS Code watermark */
.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark {
    background-image: none !important;
}

/* Hide welcome page logo */
.welcome-page .welcomePage-logo {
    display: none !important;
}
```

---

## ✅ Solution 2: Remove Copilot Icon

### Option A: Disable Copilot Extension
In VS Code settings or product.json:

```json
{
  "extensionsGallery": {
    "serviceUrl": "https://marketplace.visualstudio.com/_apis/public/gallery",
    "itemUrl": "https://marketplace.visualstudio.com/items"
  }
}
```

### Option B: Hide from UI
Add to product.json:

```json
{
  "extensionKind": {
    "github.copilot": ["ui"]
  }
}
```

### Option C: Uninstall Copilot
```cmd
code --uninstall-extension GitHub.copilot
```

---

## ✅ Solution 3: Replace Application Icons

### Icons to Replace

#### Windows Icons
```
vscode/resources/win32/code.ico          → genie.ico
vscode/resources/win32/code_70x70.png    → genie_70x70.png
vscode/resources/win32/code_150x150.png  → genie_150x150.png
```

#### macOS Icons
```
vscode/resources/darwin/code.icns        → genie.icns
```

#### Linux Icons
```
vscode/resources/linux/code.png          → genie.png
```

---

## 🎨 Create Genie Icons

### Quick Icon Creation

#### Option 1: Use Online Tool
1. Go to https://www.favicon-generator.org/
2. Upload Genie lamp image
3. Generate ICO, ICNS, PNG

#### Option 2: Use ImageMagick
```cmd
# Install ImageMagick
# Then convert:
magick convert genie-logo.png -resize 256x256 genie.ico
```

#### Option 3: Use AI Image Generator
Prompt: "Minimalist genie lamp icon, purple and orange gradient, modern flat design, transparent background"

---

## 🚀 Quick Fix Script

Create `remove-vscode-branding.bat`:

```batch
@echo off
echo Removing VS Code Branding...

set VSCODE_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Microsoft VS Code\resources\app

REM Disable welcome page
echo Disabling welcome page...
REM This requires modifying product.json

REM Hide watermark with CSS
echo Creating custom CSS...
echo /* Hide VS Code watermark */ >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo .monaco-workbench .part.editor ^> .content .editor-group-container ^> .editor-group-watermark { >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo     background-image: none !important; >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"
echo } >> "%VSCODE_PATH%\out\vs\workbench\workbench.desktop.main.css"

echo Done!
pause
```

---

## 📝 Update product.json

Add these settings to hide VS Code branding:

```json
{
  "nameShort": "Genie",
  "nameLong": "Genie Code Editor",
  "applicationName": "genie",
  
  "welcomePage": {
    "enabled": false
  },
  
  "workbench.startupEditor": "none",
  
  "telemetryOptOut": true,
  
  "extensionRecommendations": {
    "onFileOpen": {}
  }
}
```

---

## 🎯 Complete Removal Checklist

### Visual Elements
- [ ] Center watermark logo
- [ ] Welcome page logo
- [ ] Application icon (taskbar)
- [ ] File type icons
- [ ] Splash screen
- [ ] About dialog logo

### Extensions
- [ ] Copilot icon removed
- [ ] Built-in extension icons
- [ ] Marketplace branding

### Text References
- [ ] Title bar text
- [ ] About dialog text
- [ ] Help menu items
- [ ] Error messages

---

## 🔧 Advanced: Rebuild with Custom Icons

If you want permanent changes:

### Step 1: Replace Icon Files
```cmd
cd vscode/resources/win32
del code.ico
copy path\to\genie.ico code.ico
```

### Step 2: Rebuild Application
```cmd
cd vscode
npm run compile
npm run gulp vscode-win32-x64
```

### Step 3: Install Custom Build
Your custom Genie build will have all icons replaced.

---

## 💡 Temporary CSS Override

Create: `%APPDATA%\Code\User\settings.json`

Add:
```json
{
  "workbench.colorCustomizations": {
    "[Genie Dark]": {
      "editorGroupHeader.tabsBackground": "#1E1E1E"
    }
  },
  "vscode_custom_css.imports": [
    "file:///C:/path/to/custom-genie.css"
  ]
}
```

Create `custom-genie.css`:
```css
/* Hide all VS Code branding */
.monaco-workbench .part.editor > .content .editor-group-container > .editor-group-watermark {
    background-image: none !important;
}

.welcome-page {
    background-image: none !important;
}

/* Add Genie branding */
.monaco-workbench::before {
    content: "🧞 Genie";
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: #7B2CBF;
    font-size: 12px;
    opacity: 0.5;
}
```

---

## 🎨 Create Genie Welcome Page

Create custom welcome page:

**File:** `vscode/src/vs/workbench/contrib/welcome/page/browser/welcomePage.ts`

Replace VS Code logo with Genie branding.

---

## 📊 What Needs Icons

| Item | Size | Format | Priority |
|------|------|--------|----------|
| App Icon | 256x256 | ICO | High |
| Taskbar | 48x48 | PNG | High |
| File Icons | 16x16 | PNG | Medium |
| Splash | 200x200 | PNG | Medium |
| About Dialog | 128x128 | PNG | Low |

---

## 🚀 Quick Action Plan

### Today (30 minutes)
1. Run `remove-vscode-branding.bat`
2. Disable welcome page in product.json
3. Uninstall Copilot extension

### This Week (2 hours)
1. Design Genie lamp logo
2. Generate all icon sizes
3. Replace icon files
4. Test branding

### Next Week (4 hours)
1. Rebuild from source with icons
2. Create custom welcome page
3. Remove all VS Code references

---

## 🧞 Immediate Fix

Run these commands NOW:

```cmd
REM 1. Update product.json
cd vscode
notepad product.json
REM Add: "welcomePage": { "enabled": false }

REM 2. Apply changes
cd ..
.\apply-genie-branding.bat

REM 3. Uninstall Copilot
code --uninstall-extension GitHub.copilot

REM 4. Restart VS Code
```

---

## ✅ Expected Result

After applying fixes:
- ❌ No VS Code watermark
- ❌ No Copilot icon
- ✅ Clean Genie interface
- ✅ Purple/orange colors
- ✅ Genie themes

---

**Next:** Main abhi product.json update karke welcome page disable kar deta hoon!
