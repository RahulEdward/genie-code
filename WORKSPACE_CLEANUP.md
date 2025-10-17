# Workspace Cleanup Guide

## Current Situation
Your IDE has **46 open files** which can slow down performance and make navigation difficult.

## Quick Cleanup Steps

### 1. Close All Files Except Essential Ones
Keep only these files open:
- `README.md` - Main project documentation
- `genie-ai-extension/src/extension.ts` - Main extension file
- `genie-ai-extension/package.json` - Extension configuration

### 2. Organize Files by Category

#### 📚 Documentation Files (Can be closed)
- All `PHASE*.md` files
- `IMPLEMENTATION_VERIFICATION.md`
- `FORK_SUCCESS_REPORT.md`
- `BUILD_*.md` files
- `CURRENT_STATUS.md`
- `FINAL_SUMMARY.md`

#### 🔧 Extension Source Files (Keep if actively developing)
- `genie-ai-extension/src/extension.ts` ✅ Keep
- `genie-ai-extension/src/chatPanel.ts` ✅ Keep
- `genie-ai-extension/src/agentBuilder.ts` ✅ Keep
- `genie-ai-extension/src/anthropicClient.ts` ✅ Keep
- `genie-ai-extension/src/agents/codeSprint.ts` - Close for now

#### 📖 Guide Files (Close, reference when needed)
- `AGENT_BUILDER_GUIDE.md`
- `UI_COMPONENTS_GUIDE.md`
- `GENIE_UI_QUICK_START.md`
- `GENIE_UI_IMPLEMENTATION.md`
- `AGENT_BUILDER_IMPLEMENTATION.md`

#### 🛠️ Scripts (Close)
- All `.bat` files
- `scripts/` folder files

#### 🎨 Theme Files (Close)
- `vscode/extensions/theme-defaults/package.json`

#### 📋 Config Files (Close)
- `vscode/product.json`
- `vscode/README.md`

## Quick Actions in VS Code

### Close All Editors
1. Press `Ctrl+K` then `W` (Windows/Linux)
2. Or: Right-click any tab → "Close All"

### Close All But Active
1. Right-click the file you want to keep
2. Select "Close Others"

### Close All to the Right
1. Right-click a tab
2. Select "Close to the Right"

### Pin Important Files
1. Right-click the tab
2. Select "Pin Tab"
3. Pinned tabs stay open and appear first

## Recommended Workspace Layout

### Essential Files to Keep Open:
```
📌 Pinned:
├── README.md
├── genie-ai-extension/package.json
└── genie-ai-extension/src/extension.ts

📂 Working Files (as needed):
├── genie-ai-extension/src/chatPanel.ts
├── genie-ai-extension/src/agentBuilder.ts
└── genie-ai-extension/src/anthropicClient.ts
```

### Reference Files (Open when needed):
```
📚 Documentation:
├── AGENT_BUILDER_GUIDE.md
├── UI_COMPONENTS_GUIDE.md
└── GENIE_UI_QUICK_START.md

📊 Status Reports:
├── PHASE4_GENIE_AI_COMPLETE.md
└── AGENT_BUILDER_IMPLEMENTATION.md
```

## VS Code Settings to Prevent This

Add to your `.vscode/settings.json`:

```json
{
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.value": 10,
  "workbench.editor.limit.perEditorGroup": true,
  "workbench.editor.closeOnFileDelete": true,
  "workbench.editor.highlightModifiedTabs": true
}
```

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Close Current File | `Ctrl+W` | `Cmd+W` |
| Close All Files | `Ctrl+K W` | `Cmd+K W` |
| Close Others | `Ctrl+K Ctrl+W` | `Cmd+K Cmd+W` |
| Reopen Closed File | `Ctrl+Shift+T` | `Cmd+Shift+T` |
| Navigate Files | `Ctrl+Tab` | `Cmd+Tab` |
| Quick Open | `Ctrl+P` | `Cmd+P` |

## File Organization Tips

### 1. Use File Explorer Instead
- Navigate using the file tree (left sidebar)
- Open files only when you need to edit them
- Close files after editing

### 2. Use Quick Open
- Press `Ctrl+P` to quickly open any file
- Type the filename
- No need to keep everything open

### 3. Use Search
- Press `Ctrl+Shift+F` to search across files
- Find what you need without opening files

### 4. Use Breadcrumbs
- Enable breadcrumbs at the top of the editor
- Navigate file structure without opening files

## Immediate Action Plan

1. **Right now**: Press `Ctrl+K W` to close all files
2. **Then**: Open only these 3 files:
   - `README.md`
   - `genie-ai-extension/package.json`
   - `genie-ai-extension/src/extension.ts`
3. **Pin them**: Right-click each tab → "Pin Tab"
4. **Work**: Open other files only as needed
5. **Close**: Close files when done editing

## Benefits of Clean Workspace

✅ **Better Performance** - Less memory usage
✅ **Faster Navigation** - Easier to find files
✅ **Reduced Confusion** - Clear focus
✅ **Quicker Startup** - Faster IDE loading
✅ **Better Focus** - Work on what matters

## Current File Count: 46 files open
## Recommended: 3-5 files open at a time

---

**Pro Tip**: Use `Ctrl+P` (Quick Open) instead of keeping files open. It's faster and cleaner!
