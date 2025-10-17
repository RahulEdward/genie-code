# Genie AI Chat UI & Agent Builder Guide

## Overview

This guide covers the two main UI components for AI interaction in Genie:

1. **Chat Panel** - Interactive AI chat interface for code assistance
2. **Agent Builder** - Visual tool for creating custom AI agents

## 1. Chat Panel Interface

### Features

- **Real-time AI Chat**: Interactive conversation with Claude AI
- **Context-Aware**: Automatically includes current file, selection, and errors
- **Code Actions**: Insert or apply code directly from chat responses
- **Markdown Support**: Formatted code blocks with syntax highlighting
- **Conversation History**: Maintains context throughout the session
- **Quick Suggestions**: Pre-built prompts for common tasks

### Opening the Chat

- **Command Palette**: `Genie: Open AI Chat`
- **Keyboard Shortcut**: `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac)
- **Status Bar**: Click the "✨ Genie AI" icon
- **Context Menu**: Right-click in editor → `Genie: Open AI Chat`

### Using the Chat

1. **Ask Questions**: Type your question or request in the input box
2. **Get Responses**: AI responds with explanations and code
3. **Code Actions**:
   - **Insert**: Add code at cursor position
   - **Apply**: Replace selected code or insert at cursor
4. **Clear Chat**: Reset conversation history

### Context Provided to AI

The chat automatically includes:
- Current file name and language
- Selected code (if any)
- Cursor position
- Active errors and diagnostics
- Full file content (for reference)

### Example Prompts

```
- "Explain this code"
- "Find bugs in my code"
- "Optimize this function"
- "Add error handling"
- "Write unit tests for this"
- "Convert this to TypeScript"
- "Add documentation comments"
```

## 2. Agent Builder Interface

### Features

- **Visual Agent Creation**: Build custom AI agents without coding
- **Template Library**: Pre-built agent templates for common tasks
- **Capability Selection**: Choose specific AI capabilities
- **Parameter Tuning**: Adjust temperature and token limits
- **Agent Management**: Save, edit, and delete custom agents
- **Test Integration**: Test agents before deployment

### Opening Agent Builder

- **Command Palette**: `Genie: Open Agent Builder`
- **Keyboard Shortcut**: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)

### Creating a Custom Agent

1. **Click "New Agent"** or select a template
2. **Configure Agent**:
   - **Name**: Descriptive name for your agent
   - **Description**: Brief explanation of purpose
   - **Model**: Choose Claude model (Sonnet, Opus, or Haiku)
   - **System Prompt**: Define agent behavior and expertise
   - **Capabilities**: Select what the agent can do
   - **Temperature**: Control creativity (0 = focused, 1 = creative)
   - **Max Tokens**: Set response length limit

3. **Save Agent**: Click "Save Agent" button
4. **Test Agent**: Click "Test Agent" to try it out

### Pre-built Templates

#### 🔍 Code Reviewer
- Reviews code for best practices
- Identifies bugs and edge cases
- Suggests performance improvements
- Checks security vulnerabilities

#### 🧪 Test Generator
- Creates unit tests
- Generates integration tests
- Covers edge cases
- Provides mock data

#### 📚 Documentation Writer
- Writes function documentation
- Creates API docs
- Generates usage examples
- Explains architecture

#### ♻️ Refactoring Expert
- Suggests code improvements
- Applies design patterns
- Enforces SOLID principles
- Optimizes performance

### Agent Capabilities

Select from these capabilities:

- **Code Generation**: Create new code from descriptions
- **Debugging**: Find and fix bugs
- **Code Review**: Analyze code quality
- **Testing**: Generate test cases
- **Documentation**: Write comments and docs
- **Refactoring**: Improve code structure
- **Security Analysis**: Find vulnerabilities
- **Performance**: Optimize code speed

### Configuration Parameters

#### Temperature (0.0 - 1.0)
- **0.0 - 0.3**: Very focused, deterministic responses
- **0.4 - 0.6**: Balanced creativity and consistency
- **0.7 - 0.9**: More creative and varied responses
- **1.0**: Maximum creativity (less predictable)

**Recommended**:
- Code generation: 0.3 - 0.5
- Code review: 0.5 - 0.7
- Documentation: 0.6 - 0.8
- Creative tasks: 0.7 - 1.0

#### Max Tokens
- **1024**: Short responses
- **2048**: Medium responses (default for quick tasks)
- **4096**: Long responses (recommended)
- **8192**: Very long responses (complex explanations)

### System Prompt Best Practices

A good system prompt should:

1. **Define Role**: "You are an expert [role]..."
2. **Specify Expertise**: List areas of knowledge
3. **Set Behavior**: How to respond and interact
4. **Provide Guidelines**: What to include/avoid
5. **Give Examples**: Show desired output format

#### Example System Prompt

```
You are an expert Python developer specializing in data science.

EXPERTISE:
- NumPy, Pandas, Scikit-learn
- Data visualization with Matplotlib/Seaborn
- Statistical analysis and modeling
- Performance optimization

BEHAVIOR:
- Provide clean, well-documented code
- Include type hints
- Follow PEP 8 style guide
- Explain complex algorithms
- Suggest best practices

RESPONSE FORMAT:
- Start with brief explanation
- Provide complete, runnable code
- Add inline comments for clarity
- Suggest improvements or alternatives
```

## Integration with Extension

### In extension.ts

```typescript
import { ChatPanel } from './chatPanel';
import { AgentBuilderPanel } from './agentBuilder';

// Open Chat Panel
vscode.commands.registerCommand('genie.openChat', () => {
    ChatPanel.createOrShow(context.extensionUri, anthropicClient);
});

// Open Agent Builder
vscode.commands.registerCommand('genie.openAgentBuilder', () => {
    AgentBuilderPanel.createOrShow(context.extensionUri);
});
```

### In package.json

```json
{
  "contributes": {
    "commands": [
      {
        "command": "genie.openChat",
        "title": "Genie: Open AI Chat"
      },
      {
        "command": "genie.openAgentBuilder",
        "title": "Genie: Open Agent Builder"
      }
    ],
    "keybindings": [
      {
        "command": "genie.openChat",
        "key": "ctrl+shift+l"
      },
      {
        "command": "genie.openAgentBuilder",
        "key": "ctrl+shift+b"
      }
    ]
  }
}
```

## Customization

### Styling

Both panels use VS Code theme variables for consistent appearance:
- `--vscode-editor-background`
- `--vscode-editor-foreground`
- `--vscode-button-background`
- `--vscode-input-background`
- etc.

### Extending Functionality

#### Add Custom Message Types

In `chatPanel.ts`:

```typescript
case 'customAction':
    await this._handleCustomAction(message.data);
    break;
```

#### Add New Agent Templates

In `agentBuilder.ts`:

```typescript
const templates = {
    'my-template': {
        name: 'My Custom Template',
        description: 'Does something specific',
        systemPrompt: '...',
        capabilities: ['...']
    }
};
```

## Troubleshooting

### Chat Not Responding

1. Check API key in settings: `genie.apiKey`
2. Verify internet connection
3. Check VS Code Developer Console for errors

### Agent Builder Not Saving

1. Check workspace configuration permissions
2. Verify `genie.customAgents` setting exists
3. Check file system write permissions

### Code Actions Not Working

1. Ensure active editor is open
2. Check if editor is read-only
3. Verify code extraction from markdown

## API Reference

### ChatPanel

```typescript
class ChatPanel {
    static createOrShow(extensionUri: Uri, client: AnthropicClient): void
    dispose(): void
}
```

### AgentBuilderPanel

```typescript
class AgentBuilderPanel {
    static createOrShow(extensionUri: Uri): void
    dispose(): void
}
```

### AgentConfig

```typescript
interface AgentConfig {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    capabilities: string[];
    temperature: number;
    maxTokens: number;
    model: string;
}
```

## Future Enhancements

Potential improvements:

1. **Multi-Agent Conversations**: Switch between agents in chat
2. **Agent Marketplace**: Share and download community agents
3. **Conversation Export**: Save chat history
4. **Voice Input**: Speech-to-text for prompts
5. **Code Diff View**: Visual comparison of changes
6. **Agent Analytics**: Track agent performance
7. **Collaborative Agents**: Multiple agents working together
8. **Custom UI Themes**: Personalized appearance

## Resources

- [Anthropic Claude Documentation](https://docs.anthropic.com/)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [Webview API Guide](https://code.visualstudio.com/api/extension-guides/webview)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review VS Code Developer Console
3. Check extension logs
4. Report issues on GitHub
