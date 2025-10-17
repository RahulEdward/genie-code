import * as vscode from 'vscode';
import { AnthropicClient } from './anthropicClient';

export class ChatPanel {
    public static currentPanel: ChatPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _conversationHistory: Array<{ role: string; content: string }> = [];
    private _client: AnthropicClient;

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, client: AnthropicClient) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._client = client;

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlForWebview();
        this._setWebviewMessageListener();
    }

    public static createOrShow(extensionUri: vscode.Uri, client: AnthropicClient) {
        const column = vscode.window.activeTextEditor?.viewColumn;

        if (ChatPanel.currentPanel) {
            ChatPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'genieChat',
            'Genie AI Chat',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        ChatPanel.currentPanel = new ChatPanel(panel, extensionUri, client);
    }

    public dispose() {
        ChatPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _setWebviewMessageListener() {
        this._panel.webview.onDidReceiveMessage(
            async (message: any) => {
                switch (message.command) {
                    case 'sendMessage':
                        await this._handleUserMessage(message.text);
                        break;
                    case 'clearChat':
                        this._conversationHistory = [];
                        this._panel.webview.postMessage({ command: 'chatCleared' });
                        break;
                    case 'insertCode':
                        await this._insertCodeIntoEditor(message.code);
                        break;
                    case 'applyCode':
                        await this._applyCodeToEditor(message.code);
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    private async _handleUserMessage(userMessage: string) {
        this._conversationHistory.push({ role: 'user', content: userMessage });

        this._panel.webview.postMessage({
            command: 'addMessage',
            role: 'user',
            content: userMessage
        });

        this._panel.webview.postMessage({ command: 'showTyping' });

        try {
            const context = await this._getEditorContext();
            const systemPrompt = this._buildSystemPrompt(context);

            const response = await this._client.sendMessage(
                systemPrompt,
                this._conversationHistory
            );

            this._conversationHistory.push({ role: 'assistant', content: response });

            this._panel.webview.postMessage({
                command: 'addMessage',
                role: 'assistant',
                content: response
            });
        } catch (error: any) {
            this._panel.webview.postMessage({
                command: 'addMessage',
                role: 'error',
                content: `Error: ${error.message}`
            });
        } finally {
            this._panel.webview.postMessage({ command: 'hideTyping' });
        }
    }

    private async _getEditorContext() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return { hasEditor: false };
        }

        const document = editor.document;
        const selection = editor.selection;
        const selectedText = document.getText(selection);
        const diagnostics = vscode.languages.getDiagnostics(document.uri);

        return {
            hasEditor: true,
            fileName: document.fileName,
            language: document.languageId,
            selectedText: selectedText || null,
            cursorPosition: { line: selection.active.line, character: selection.active.character },
            errors: diagnostics.map(d => ({ message: d.message, line: d.range.start.line })),
            fullText: document.getText()
        };
    }

    private _buildSystemPrompt(context: any): string {
        let prompt = `You are the Genie AI Assistant integrated into the code editor. You help developers with:

CORE CAPABILITIES:
- Code generation and completion
- Bug fixing and debugging assistance
- Code explanation and documentation
- Architecture planning and design patterns
- Database schema design and queries
- API development and integration
- Performance optimization suggestions
- Security vulnerability detection

RESPONSE FORMAT:
- Always provide working, tested code
- Include clear explanations for complex logic
- Suggest best practices and alternatives
- Offer multiple implementation approaches when relevant
- Provide inline comments for complex code sections
- Use markdown code blocks with language identifiers

INTERACTION STYLE:
- Be concise but thorough
- Ask clarifying questions when requirements are unclear
- Proactively suggest improvements
- Reference the current codebase context when available
- Maintain professional, helpful tone

When user asks for code, always:
1. Understand the requirement completely
2. Provide clean, efficient code
3. Explain the solution approach
4. Suggest potential improvements
5. Offer testing strategies
`;

        if (context.hasEditor) {
            prompt += `\n\nCURRENT CONTEXT:
- File: ${context.fileName}
- Language: ${context.language}
- Cursor Position: Line ${context.cursorPosition.line + 1}, Column ${context.cursorPosition.character + 1}
`;

            if (context.selectedText) {
                prompt += `- Selected Code:\n\`\`\`${context.language}\n${context.selectedText}\n\`\`\`\n`;
            }

            if (context.errors.length > 0) {
                prompt += `- Active Errors:\n${context.errors.map((e: any) => `  Line ${e.line + 1}: ${e.message}`).join('\n')}\n`;
            }
        }

        return prompt;
    }

    private async _insertCodeIntoEditor(code: string) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        await editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.insert(editor.selection.active, code);
        });
    }

    private async _applyCodeToEditor(code: string) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            await editor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.insert(selection.active, code);
            });
        } else {
            await editor.edit((editBuilder: vscode.TextEditorEdit) => {
                editBuilder.replace(selection, code);
            });
        }
    }

    private _getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genie AI Chat</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            padding: 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .btn {
            padding: 6px 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        }

        .btn:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .message {
            display: flex;
            gap: 12px;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
        }

        .user-avatar {
            background: var(--vscode-button-background);
        }

        .assistant-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .message-content {
            flex: 1;
            padding: 12px;
            border-radius: 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
        }

        .message.user .message-content {
            background: var(--vscode-button-secondaryBackground);
        }

        .message-content pre {
            background: var(--vscode-textCodeBlock-background);
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 8px 0;
            position: relative;
        }

        .message-content code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
        }

        .code-actions {
            position: absolute;
            top: 8px;
            right: 8px;
            display: flex;
            gap: 4px;
        }

        .code-btn {
            padding: 4px 8px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
        }

        .code-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .typing-indicator {
            display: none;
            align-items: center;
            gap: 12px;
            padding: 12px;
        }

        .typing-indicator.show {
            display: flex;
        }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--vscode-button-background);
            animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }

        .input-container {
            padding: 16px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            gap: 8px;
        }

        .input-wrapper {
            flex: 1;
            position: relative;
        }

        #messageInput {
            width: 100%;
            padding: 12px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            font-size: 14px;
            resize: none;
            font-family: inherit;
            min-height: 44px;
            max-height: 200px;
        }

        #messageInput:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        #sendButton {
            padding: 12px 24px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }

        #sendButton:hover:not(:disabled) {
            background: var(--vscode-button-hoverBackground);
        }

        #sendButton:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .empty-state {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 32px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state-icon {
            font-size: 48px;
            margin-bottom: 16px;
        }

        .empty-state h2 {
            font-size: 20px;
            margin-bottom: 8px;
            color: var(--vscode-editor-foreground);
        }

        .empty-state p {
            font-size: 14px;
            margin-bottom: 24px;
        }

        .suggestions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            width: 100%;
            max-width: 600px;
        }

        .suggestion-card {
            padding: 12px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .suggestion-card:hover {
            border-color: var(--vscode-focusBorder);
            transform: translateY(-2px);
        }

        .suggestion-card h3 {
            font-size: 13px;
            margin-bottom: 4px;
        }

        .suggestion-card p {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>
            <span>✨</span>
            Genie AI Chat
        </h1>
        <div class="header-actions">
            <button class="btn btn-secondary" onclick="clearChat()">Clear Chat</button>
        </div>
    </div>

    <div class="chat-container" id="chatContainer">
        <div class="empty-state" id="emptyState">
            <div class="empty-state-icon">✨</div>
            <h2>Welcome to Genie AI</h2>
            <p>Your intelligent coding assistant. Ask me anything about your code!</p>
            <div class="suggestions">
                <div class="suggestion-card" onclick="sendSuggestion('Explain this code')">
                    <h3>📖 Explain Code</h3>
                    <p>Get detailed explanations</p>
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('Find bugs in my code')">
                    <h3>🐛 Find Bugs</h3>
                    <p>Detect potential issues</p>
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('Optimize this code')">
                    <h3>⚡ Optimize</h3>
                    <p>Improve performance</p>
                </div>
                <div class="suggestion-card" onclick="sendSuggestion('Add documentation')">
                    <h3>📝 Document</h3>
                    <p>Generate comments</p>
                </div>
            </div>
        </div>

        <div class="typing-indicator" id="typingIndicator">
            <div class="message-avatar assistant-avatar">✨</div>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </div>

    <div class="input-container">
        <div class="input-wrapper">
            <textarea
                id="messageInput"
                placeholder="Ask Genie anything about your code..."
                rows="1"
            ></textarea>
        </div>
        <button id="sendButton" onclick="sendMessage()">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let messageHistory = [];

        const chatContainer = document.getElementById('chatContainer');
        const emptyState = document.getElementById('emptyState');
        const typingIndicator = document.getElementById('typingIndicator');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        // Send on Enter (Shift+Enter for new line)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text) return;

            vscode.postMessage({
                command: 'sendMessage',
                text: text
            });

            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendButton.disabled = true;
        }

        function sendSuggestion(text) {
            messageInput.value = text;
            sendMessage();
        }

        function clearChat() {
            vscode.postMessage({ command: 'clearChat' });
        }

        function insertCode(code) {
            vscode.postMessage({
                command: 'insertCode',
                code: code
            });
        }

        function applyCode(code) {
            vscode.postMessage({
                command: 'applyCode',
                code: code
            });
        }

        window.addEventListener('message', event => {
            const message = event.data;

            switch (message.command) {
                case 'addMessage':
                    addMessage(message.role, message.content);
                    break;
                case 'showTyping':
                    typingIndicator.classList.add('show');
                    scrollToBottom();
                    break;
                case 'hideTyping':
                    typingIndicator.classList.remove('show');
                    sendButton.disabled = false;
                    break;
                case 'chatCleared':
                    clearMessages();
                    break;
            }
        });

        function addMessage(role, content) {
            if (emptyState.style.display !== 'none') {
                emptyState.style.display = 'none';
            }

            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + role;

            const avatar = document.createElement('div');
            avatar.className = 'message-avatar ' + (role === 'user' ? 'user-avatar' : 'assistant-avatar');
            avatar.textContent = role === 'user' ? '👤' : '✨';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = formatMessage(content);

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(contentDiv);

            chatContainer.insertBefore(messageDiv, typingIndicator);
            scrollToBottom();

            // Add code action buttons
            const codeBlocks = contentDiv.querySelectorAll('pre');
            codeBlocks.forEach(block => {
                const actions = document.createElement('div');
                actions.className = 'code-actions';
                const insertBtn = document.createElement('button');
                insertBtn.className = 'code-btn';
                insertBtn.textContent = 'Insert';
                insertBtn.onclick = function() { insertCode(block.querySelector('code').textContent); };
                const applyBtn = document.createElement('button');
                applyBtn.className = 'code-btn';
                applyBtn.textContent = 'Apply';
                applyBtn.onclick = function() { applyCode(block.querySelector('code').textContent); };
                actions.appendChild(insertBtn);
                actions.appendChild(applyBtn);
                block.insertBefore(actions, block.firstChild);
            });
        }

        function formatMessage(content) {
            // Simple markdown-like formatting
            content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
            content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
            content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
            content = content.replace(/\n/g, '<br>');
            return content;
        }

        function clearMessages() {
            const messages = chatContainer.querySelectorAll('.message');
            messages.forEach(msg => msg.remove());
            emptyState.style.display = 'flex';
        }

        function scrollToBottom() {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    </script>
</body>
</html>`;
    }
}
