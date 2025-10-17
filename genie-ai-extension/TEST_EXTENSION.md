# Testing Genie AI Extension

## ✅ Extension is Ready!

All files compiled successfully. Here's how to test:

## 🚀 Method 1: Launch Extension Development Host

### Step 1: Open VS Code
```bash
code genie-ai-extension
```

### Step 2: Press F5
- Or go to Run → Start Debugging
- Or press the green play button

### Step 3: New Window Opens
A new VS Code window opens with "[Extension Development Host]" in the title.

### Step 4: Test Commands

In the new window, press `Ctrl+Shift+P` and type:
- `Genie: Open AI Chat` - Opens chat panel
- `Genie: Open Agent Builder` - Opens agent builder
- `Genie: Generate Code` - Generates code

Or use keyboard shortcuts:
- `Ctrl+Shift+L` - Open Chat
- `Ctrl+Shift+B` - Open Agent Builder
- `Ctrl+Shift+G` - Generate Code

## 🎯 Method 2: Install as VSIX

### Create VSIX Package
```bash
npm install -g @vscode/vsce
vsce package
```

### Install
```bash
code --install-extension genie-ai-1.0.0.vsix
```

## 🧪 What to Test

### 1. Chat Panel (`Ctrl+Shift+L`)
- ✅ Panel opens
- ✅ UI displays correctly
- ✅ Can type messages
- ✅ Quick suggestions work
- ⚠️ API calls require Anthropic API key

### 2. Agent Builder (`Ctrl+Shift+B`)
- ✅ Panel opens
- ✅ Wizard displays
- ✅ Can create new agent
- ✅ Templates load
- ✅ Can save agents

### 3. Code Generation (`Ctrl+Shift+G`)
- ✅ Input box appears
- ✅ Can enter description
- ⚠️ Requires API key to generate

### 4. Status Bar
- ✅ "✨ Genie AI" appears in status bar
- ✅ Clicking opens chat panel

## 🔧 Configure API Key

Before testing AI features:

1. Open Settings (`Ctrl+,`)
2. Search for "Genie AI"
3. Enter your Anthropic API key:
   ```
   genie.apiKey: sk-ant-...
   ```

Or add to settings.json:
```json
{
  "genie.apiKey": "your-api-key-here",
  "genie.model": "claude-3-5-sonnet-20241022",
  "genie.maxTokens": 4096,
  "genie.temperature": 0.7
}
```

## 📊 Expected Results

### ✅ Working Features
- Extension activates
- Commands register
- Panels open
- UI displays
- Status bar shows
- Keyboard shortcuts work

### ⚠️ Requires API Key
- AI chat responses
- Code generation
- Code completion
- Error fixing

### 🐛 Known Issues
- Template literals in chatPanel.ts (fixed)
- Requires @anthropic-ai/sdk dependency
- API key must be configured

## 🎮 Quick Test Script

Run this in the Extension Development Host:

1. Press `Ctrl+Shift+P`
2. Type "Genie: Open AI Chat"
3. Chat panel should open
4. Try typing a message (won't respond without API key)
5. Press `Ctrl+Shift+P`
6. Type "Genie: Open Agent Builder"
7. Agent builder should open with wizard

## 📝 Debugging

### Check Extension is Loaded
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Developer: Show Running Extensions"
3. Look for "Genie AI" in the list

### Check Console for Errors
1. Help → Toggle Developer Tools
2. Check Console tab for errors
3. Look for "Genie AI extension activated" message

### Check Output Panel
1. View → Output
2. Select "Extension Host" from dropdown
3. Look for activation messages

## 🎯 Success Criteria

✅ Extension activates without errors
✅ Commands appear in Command Palette
✅ Chat panel opens
✅ Agent builder opens
✅ Status bar item appears
✅ Keyboard shortcuts work
✅ UI renders correctly

## 🚀 Next Steps

Once testing is complete:

1. **Fix any bugs** found during testing
2. **Add API key** to test AI features
3. **Create agents** using the builder
4. **Test code generation** with real code
5. **Package as VSIX** for distribution
6. **Publish to marketplace** (optional)

## 📚 Resources

- Extension code: `src/extension.ts`
- Chat UI: `src/chatPanel.ts`
- Agent Builder: `src/agentBuilder.ts`
- API Client: `src/anthropicClient.ts`

---

**Ready to test! Press F5 in VS Code!** 🚀✨
