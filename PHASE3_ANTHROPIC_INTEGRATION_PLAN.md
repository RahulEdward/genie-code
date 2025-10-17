# Phase 3: Anthropic Integration - Planning Document

## Overview
Now that Copilot is removed, this document outlines the plan for integrating Anthropic's Claude AI into Genie Code Editor.

---

## Architecture Design

### 1. AI Service Provider Layer
**Location:** `vscode/src/vs/platform/ai/`

Create a new platform service for AI integration:

```
vscode/src/vs/platform/ai/
├── common/
│   ├── ai.ts                    # AI service interface
│   ├── aiService.ts             # Base AI service implementation
│   └── anthropicClient.ts       # Claude API client
├── browser/
│   └── aiBrowserService.ts      # Browser-specific implementation
└── node/
    └── aiNodeService.ts         # Node.js-specific implementation
```

### 2. Genie AI Extension
**Location:** `vscode/extensions/genie-ai/`

Create a new built-in extension:

```
vscode/extensions/genie-ai/
├── src/
│   ├── extension.ts             # Extension entry point
│   ├── chatProvider.ts          # Chat interface provider
│   ├── completionProvider.ts    # Code completion provider
│   ├── anthropicService.ts      # Anthropic API integration
│   └── commands/
│       ├── chat.ts              # Chat commands
│       ├── explain.ts           # Code explanation
│       └── refactor.ts          # Code refactoring
├── package.json                 # Extension manifest
├── tsconfig.json
└── README.md
```

### 3. UI Components
**Location:** `vscode/src/vs/workbench/contrib/genieAi/`

Create workbench contributions:

```
vscode/src/vs/workbench/contrib/genieAi/
├── browser/
│   ├── genieAi.contribution.ts  # Register contribution
│   ├── genieAiView.ts           # Chat view
│   ├── genieAiPanel.ts          # Side panel
│   └── genieAiStatusBar.ts      # Status bar item
└── common/
    └── genieAiService.ts        # Workbench service
```

---

## Implementation Steps

### Step 1: Create AI Service Interface (2-3 hours)

1. **Create base AI service interface**
   ```typescript
   // vscode/src/vs/platform/ai/common/ai.ts
   export interface IAIService {
     sendMessage(message: string, context?: AIContext): Promise<AIResponse>;
     streamMessage(message: string, context?: AIContext): AsyncIterable<string>;
     getModels(): Promise<AIModel[]>;
     setModel(modelId: string): void;
   }
   ```

2. **Implement Anthropic client**
   ```typescript
   // vscode/src/vs/platform/ai/common/anthropicClient.ts
   export class AnthropicClient {
     constructor(private apiKey: string) {}
     
     async sendMessage(message: string): Promise<string> {
       // Call Anthropic API
     }
   }
   ```

3. **Register service in dependency injection**
   - Add to `vscode/src/vs/workbench/workbench.common.main.ts`

### Step 2: Create Genie AI Extension (3-4 hours)

1. **Create extension structure**
   ```bash
   mkdir vscode/extensions/genie-ai
   cd vscode/extensions/genie-ai
   npm init -y
   ```

2. **Create package.json manifest**
   ```json
   {
     "name": "genie-ai",
     "displayName": "Genie AI",
     "description": "AI-powered coding assistant by Genie",
     "version": "1.0.0",
     "publisher": "genie",
     "engines": {
       "vscode": "^1.85.0"
     },
     "categories": ["Other"],
     "activationEvents": ["onStartupFinished"],
     "main": "./out/extension.js",
     "contributes": {
       "commands": [
         {
           "command": "genie.chat",
           "title": "Genie: Open Chat"
         },
         {
           "command": "genie.explain",
           "title": "Genie: Explain Code"
         }
       ],
       "configuration": {
         "title": "Genie AI",
         "properties": {
           "genie.apiKey": {
             "type": "string",
             "description": "Anthropic API Key"
           },
           "genie.model": {
             "type": "string",
             "default": "claude-3-5-sonnet-20241022",
             "enum": [
               "claude-3-5-sonnet-20241022",
               "claude-3-opus-20240229",
               "claude-3-haiku-20240307"
             ]
           }
         }
       }
     }
   }
   ```

3. **Implement extension activation**
   ```typescript
   // vscode/extensions/genie-ai/src/extension.ts
   import * as vscode from 'vscode';
   
   export function activate(context: vscode.ExtensionContext) {
     // Register commands
     // Initialize AI service
     // Set up chat provider
   }
   ```

### Step 3: Create Chat Interface (2-3 hours)

1. **Create chat view provider**
   ```typescript
   // vscode/extensions/genie-ai/src/chatProvider.ts
   export class GenieChatProvider implements vscode.WebviewViewProvider {
     resolveWebviewView(webviewView: vscode.WebviewView) {
       // Set up chat UI
     }
   }
   ```

2. **Create chat webview HTML**
   - Purple/orange Genie theme
   - Message input
   - Response display
   - Code highlighting

3. **Register view in package.json**
   ```json
   "views": {
     "genie": [
       {
         "type": "webview",
         "id": "genie.chatView",
         "name": "Genie Chat"
       }
     ]
   }
   ```

### Step 4: Implement Code Completion (3-4 hours)

1. **Create completion provider**
   ```typescript
   // vscode/extensions/genie-ai/src/completionProvider.ts
   export class GenieCompletionProvider implements vscode.InlineCompletionItemProvider {
     async provideInlineCompletionItems(
       document: vscode.TextDocument,
       position: vscode.Position
     ): Promise<vscode.InlineCompletionItem[]> {
       // Get AI suggestions
     }
   }
   ```

2. **Register completion provider**
   ```typescript
   vscode.languages.registerInlineCompletionItemProvider(
     { pattern: '**' },
     new GenieCompletionProvider()
   );
   ```

### Step 5: Add UI Components (2-3 hours)

1. **Create status bar item**
   ```typescript
   const statusBarItem = vscode.window.createStatusBarItem(
     vscode.StatusBarAlignment.Right,
     100
   );
   statusBarItem.text = "$(genie-icon) Genie AI";
   statusBarItem.command = "genie.chat";
   statusBarItem.show();
   ```

2. **Add custom icons**
   - Create genie lamp icon
   - Add to `vscode/extensions/genie-ai/icons/`
   - Register in package.json

3. **Create activity bar view**
   ```json
   "viewsContainers": {
     "activitybar": [
       {
         "id": "genie",
         "title": "Genie AI",
         "icon": "icons/genie.svg"
       }
     ]
   }
   ```

### Step 6: Configure Settings (1-2 hours)

1. **Add configuration schema**
   - API key input
   - Model selection
   - Temperature settings
   - Max tokens

2. **Create settings UI**
   - Welcome screen with setup instructions
   - API key validation
   - Model testing

3. **Add to product.json**
   ```json
   "genie": {
     "enabled": true,
     "defaultModel": "claude-3-5-sonnet-20241022"
   }
   ```

---

## API Integration Details

### Anthropic API Setup

1. **Install SDK**
   ```bash
   cd vscode/extensions/genie-ai
   npm install @anthropic-ai/sdk
   ```

2. **Basic API call**
   ```typescript
   import Anthropic from '@anthropic-ai/sdk';
   
   const client = new Anthropic({
     apiKey: process.env.ANTHROPIC_API_KEY,
   });
   
   const message = await client.messages.create({
     model: 'claude-3-5-sonnet-20241022',
     max_tokens: 1024,
     messages: [
       { role: 'user', content: 'Hello, Claude!' }
     ],
   });
   ```

3. **Streaming responses**
   ```typescript
   const stream = await client.messages.stream({
     model: 'claude-3-5-sonnet-20241022',
     max_tokens: 1024,
     messages: [
       { role: 'user', content: 'Explain this code' }
     ],
   });
   
   for await (const chunk of stream) {
     // Handle streaming response
   }
   ```

---

## Configuration Files to Update

### 1. product.json
Add Genie AI configuration:
```json
{
  "genie": {
    "ai": {
      "enabled": true,
      "provider": "anthropic",
      "defaultModel": "claude-3-5-sonnet-20241022"
    }
  }
}
```

### 2. extensions/package.json
Add genie-ai to built-in extensions:
```json
{
  "dependencies": {
    "genie-ai": "file:./genie-ai"
  }
}
```

### 3. Build configuration
Update gulp tasks to include genie-ai extension.

---

## Testing Strategy

### Unit Tests
- AI service interface tests
- Anthropic client tests
- Command handler tests

### Integration Tests
- Extension activation
- Chat interface
- Code completion
- Settings management

### Manual Testing
1. Install extension
2. Configure API key
3. Test chat interface
4. Test code completion
5. Test code explanation
6. Test refactoring suggestions

---

## Security Considerations

### API Key Storage
- Store in VS Code secrets API
- Never log API keys
- Validate before use

### Rate Limiting
- Implement request throttling
- Handle API errors gracefully
- Show user-friendly error messages

### Privacy
- Don't send sensitive code without permission
- Add opt-in for telemetry
- Clear privacy policy

---

## UI/UX Design

### Chat Interface
- Purple/orange Genie theme
- Markdown rendering for responses
- Code syntax highlighting
- Copy code button
- Regenerate response button

### Status Bar
- Genie lamp icon
- Model indicator
- Active/inactive state
- Click to open chat

### Activity Bar
- Genie icon
- Chat history
- Settings access
- Quick actions

---

## Estimated Timeline

| Task | Time | Priority |
|------|------|----------|
| AI Service Interface | 2-3 hours | High |
| Anthropic Client | 2-3 hours | High |
| Extension Structure | 1-2 hours | High |
| Chat Interface | 2-3 hours | High |
| Code Completion | 3-4 hours | Medium |
| UI Components | 2-3 hours | Medium |
| Settings & Config | 1-2 hours | Medium |
| Testing | 2-3 hours | High |
| Documentation | 1-2 hours | Low |

**Total: 16-25 hours**

---

## Success Criteria

✅ **Phase 3 Complete When:**
1. Genie AI extension is functional
2. Chat interface works with Claude
3. Code completion provides suggestions
4. Settings are configurable
5. UI matches Genie branding
6. All tests pass
7. Documentation is complete

---

## Resources

### Anthropic Documentation
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude Models](https://docs.anthropic.com/claude/docs/models-overview)
- [API Reference](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

### VS Code Extension Development
- [Extension API](https://code.visualstudio.com/api)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [Language Features](https://code.visualstudio.com/api/language-extensions/programmatic-language-features)

### Example Extensions
- GitHub Copilot (for reference)
- Tabnine
- Codeium

---

## Next Steps

1. Review this plan
2. Set up Anthropic API account
3. Get API key
4. Start with Step 1: AI Service Interface
5. Iterate and test each component
6. Document as you go

Ready to start Phase 3? 🚀
