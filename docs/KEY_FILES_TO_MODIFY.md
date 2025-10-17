# Key Files to Modify for Rebranding

## Critical Configuration Files

### 1. product.json (Root directory)
**Location:** `product.json`
**Changes needed:**
- `nameShort`: "Genie"
- `nameLong`: "Genie Code Editor"
- `applicationName`: "genie"
- `dataFolderName`: ".genie"
- `win32MutexName`: "genie"
- `darwinBundleIdentifier`: "com.yourorg.genie"
- `linuxIconName`: "genie"
- `urlProtocol`: "genie"

### 2. package.json (Root directory)
**Location:** `package.json`
**Changes needed:**
- `name`: "genie"
- `description`: "AI-powered code editor"
- `productName`: "Genie"

### 3. Application Icons

#### Windows
- `resources/win32/code.ico` → Replace with genie.ico
- `resources/win32/code_70x70.png`
- `resources/win32/code_150x150.png`

#### macOS
- `resources/darwin/code.icns` → Replace with genie.icns

#### Linux
- `resources/linux/code.png` → Replace with genie.png

### 4. Title Bar
**Location:** `src/vs/workbench/browser/parts/titlebar/titlebarPart.ts`
Search for "Visual Studio Code" and replace with "Genie"

### 5. Welcome Page
**Location:** `src/vs/workbench/contrib/welcome/page/browser/welcomePage.ts`
Update welcome messages and branding

### 6. About Dialog
**Location:** `src/vs/workbench/electron-sandbox/parts/dialogs/dialogHandler.ts`
Update application name in dialogs

### 7. Main Process
**Location:** `src/vs/code/electron-main/app.ts`
Update application name references

## Search and Replace Strategy

Run these searches across the codebase:

1. **Case-sensitive search for "Visual Studio Code"**
   - Replace with "Genie Code Editor" or "Genie" as appropriate

2. **Search for "vscode"**
   - Replace with "genie" (be careful with URLs and imports)

3. **Search for "code-oss"**
   - Replace with "genie"

4. **Search for ".vscode"**
   - Replace with ".genie" (for config directories)

## Files to Review Manually

- `README.md` - Complete rewrite
- `LICENSE.txt` - Add attribution
- `ThirdPartyNotices.txt` - Review and update
- `build/lib/branding.js` - Build-time branding
- `build/azure-pipelines/*.yml` - CI/CD configurations
- `extensions/theme-defaults/themes/*.json` - Default themes

## Localization Files

Update all language files in:
- `i18n/*/messages.json`
- `src/vs/workbench/contrib/localization/`

## Build Configuration

- `build/gulpfile.vscode.js` - Build tasks
- `build/lib/electron.js` - Electron configuration
- `build/lib/util.js` - Utility functions with branding

## Extension Marketplace

If you plan to have your own marketplace:
- `src/vs/platform/extensionManagement/` - Extension management
- Update marketplace URLs in product.json
