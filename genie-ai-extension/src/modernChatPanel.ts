import * as vscode from 'vscode';
import { AnthropicClient } from './anthropicClient';

export class ModernChatPanel {
    public static currentPanel: ModernChatPanel | undefined;
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

        if (ModernChatPanel.currentPanel) {
            ModernChatPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'genieModernChat',
            'Genie AI',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        ModernChatPanel.currentPanel = new ModernChatPanel(panel, extensionUri, client);
    }

    public dispose() {
        ModernChatPanel.currentPanel = undefined;
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
                        await this._handleUserMessage(message.text, message.mode);
                        break;
                    case 'newSession':
                        this._conversationHistory = [];
                        this._panel.webview.postMessage({ command: 'sessionCleared' });
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    private async _handleUserMessage(userMessage: string, mode: string) {
        this._conversationHistory.push({ role: 'user', content: userMessage });

        this._panel.webview.postMessage({
            command: 'addMessage',
            role: 'user',
            content: userMessage
        });

        this._panel.webview.postMessage({ command: 'showTyping' });

        try {
            const context = await this._getEditorContext();
            const systemPrompt = this._buildSystemPrompt(context, mode);

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

        return {
            hasEditor: true,
            fileName: document.fileName,
            language: document.languageId,
            selectedText: selectedText || null,
            fullText: document.getText()
        };
    }

    private _buildSystemPrompt(context: any, mode: string): string {
        let prompt = '';

        if (mode === 'vibe') {
            prompt = `You are Genie AI - Creative Code Sprint Agent

VIBE MODE - Chat first, then build:
- Explore ideas and iterate as you discover needs
- Ask clarifying questions when needed
- Suggest creative solutions
- Think out loud and brainstorm
- Be conversational and helpful
- Generate code quickly when requested

RESPONSE FORMAT FOR CODE:
\`\`\`language
// Brief explanation
[COMPLETE WORKING CODE]
\`\`\`

**Explanation:** [Concise technical details]
**Usage:** [How to use the code]
**Next Steps:** [Suggestions for improvement]

GENERATION RULES:
1. SPEED: Provide immediate, working solutions
2. ACCURACY: Code must run without errors
3. BEST PRACTICES: Follow language conventions
4. COMPLETENESS: Include imports and dependencies
5. OPTIMIZATION: Write efficient, clean code

Great for:
- Rapid exploration and testing
- Building when requirements are unclear
- Implementing a task quickly
`;
        } else {
            prompt = `You are Genie AI - Structured Code Sprint Agent

SPEC MODE - Plan first, then build:
- Create requirements and design before coding
- Be systematic and thorough
- Provide detailed specifications
- Think through architecture first
- Generate production-ready code

RESPONSE FORMAT:
1. **Requirements Analysis**
2. **Architecture Design**
3. **Implementation Plan**
4. **Code Generation:**
\`\`\`language
[PRODUCTION-READY CODE]
\`\`\`
5. **Testing Strategy**
6. **Deployment Notes**

GENERATION RULES:
1. PLANNING: Think through design first
2. QUALITY: Production-ready code
3. DOCUMENTATION: Comprehensive comments
4. TESTING: Include test cases
5. SCALABILITY: Consider future growth

Great for:
- Complex projects
- Team collaboration
- Production code
- Enterprise applications
`;
        }

        if (context.hasEditor) {
            prompt += `\n\nCURRENT CONTEXT:
- File: ${context.fileName}
- Language: ${context.language}
`;
            if (context.selectedText) {
                prompt += `- Selected Code:\n\`\`\`${context.language}\n${context.selectedText}\n\`\`\`\n`;
            }
        }

        return prompt;
    }

    private _getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genie AI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #1a1a1a;
            color: #e0e0e0;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .header {
            padding: 16px 24px;
            border-bottom: 1px solid #2a2a2a;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            font-size: 14px;
            font-weight: 500;
            color: #888;
        }

        .new-session-btn {
            padding: 6px 12px;
            background: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        }

        .new-session-btn:hover {
            background: #3a3a3a;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .welcome-screen {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px;
        }

        .welcome-icon {
            font-size: 48px;
            margin-bottom: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .welcome-title {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .welcome-subtitle {
            font-size: 16px;
            color: #888;
            margin-bottom: 48px;
        }

        .mode-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            width: 100%;
            max-width: 600px;
            margin-bottom: 32px;
        }

        .mode-card {
            padding: 24px;
            background: #2a2a2a;
            border: 2px solid #3a3a3a;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .mode-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }

        .mode-card.selected {
            border-color: #667eea;
            background: #2d2a3a;
        }

        .mode-icon {
            font-size: 24px;
            margin-bottom: 12px;
        }

        .mode-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #e0e0e0;
        }

        .mode-description {
            font-size: 14px;
            color: #888;
            margin-bottom: 16px;
            line-height: 1.5;
        }

        .mode-features {
            border-left: 3px solid #667eea;
            padding-left: 12px;
        }

        .mode-features-title {
            font-size: 12px;
            font-weight: 600;
            color: #888;
            margin-bottom: 8px;
        }

        .mode-features ul {
            list-style: none;
            font-size: 13px;
            color: #aaa;
        }

        .mode-features li {
            margin-bottom: 4px;
        }

        .mode-features li:before {
            content: "• ";
            color: #667eea;
            font-weight: bold;
            margin-right: 8px;
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            display: none;
        }

        .chat-container.active {
            display: block;
        }

        .message {
            margin-bottom: 24px;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .message-avatar {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        }

        .user-avatar {
            background: #3a3a3a;
        }

        .assistant-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .message-role {
            font-size: 13px;
            font-weight: 600;
            color: #888;
        }

        .message-content {
            padding-left: 32px;
            color: #e0e0e0;
            line-height: 1.6;
        }

        .message-content pre {
            background: #2a2a2a;
            padding: 16px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 12px 0;
        }

        .message-content code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
        }

        .typing-indicator {
            display: none;
            padding-left: 32px;
            color: #888;
        }

        .typing-indicator.show {
            display: block;
        }

        .input-container {
            padding: 16px 24px;
            border-top: 1px solid #2a2a2a;
            background: #1a1a1a;
        }

        .input-wrapper {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        .input-icons {
            display: flex;
            gap: 8px;
        }

        .input-icon {
            width: 36px;
            height: 36px;
            background: #2a2a2a;
            border: 1px solid #3a3a3a;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 16px;
        }

        .input-icon:hover {
            background: #3a3a3a;
        }

        .input-box {
            flex: 1;
            position: relative;
        }

        #messageInput {
            width: 100%;
            padding: 12px 16px;
            background: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
            border-radius: 8px;
            font-size: 14px;
            resize: none;
            font-family: inherit;
            min-height: 44px;
            max-height: 200px;
        }

        #messageInput:focus {
            outline: none;
            border-color: #667eea;
        }

        #messageInput::placeholder {
            color: #666;
        }

        .send-btn {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
        }

        .send-btn:hover {
            opacity: 0.9;
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .footer {
            padding: 12px 24px;
            border-top: 1px solid #2a2a2a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #666;
        }

        .model-selector {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .model-select {
            background: #2a2a2a;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
        }

        .autopilot-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .toggle-switch {
            width: 36px;
            height: 20px;
            background: #3a3a3a;
            border-radius: 10px;
            position: relative;
            cursor: pointer;
        }

        .toggle-switch.active {
            background: #667eea;
        }

        .toggle-slider {
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 2px;
            left: 2px;
            transition: left 0.2s;
        }

        .toggle-switch.active .toggle-slider {
            left: 18px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New session</h1>
        <button class="new-session-btn" onclick="newSession()">New Session</button>
    </div>

    <div class="main-content">
        <div class="welcome-screen" id="welcomeScreen">
            <div class="welcome-icon">✨</div>
            <h1 class="welcome-title">Let's build</h1>
            <p class="welcome-subtitle">Plan, search, or build anything</p>

            <div class="mode-cards">
                <div class="mode-card selected" data-mode="vibe" onclick="selectMode('vibe')">
                    <div class="mode-icon">💬</div>
                    <h3 class="mode-title">Vibe</h3>
                    <p class="mode-description">Chat first, then build. Explore ideas and iterate as you discover needs.</p>
                    <div class="mode-features">
                        <div class="mode-features-title">Great for:</div>
                        <ul>
                            <li>Rapid exploration and testing</li>
                            <li>Building when requirements are unclear</li>
                            <li>Implementing a task</li>
                        </ul>
                    </div>
                </div>

                <div class="mode-card" data-mode="spec" onclick="selectMode('spec')">
                    <div class="mode-icon">📋</div>
                    <h3 class="mode-title">Spec</h3>
                    <p class="mode-description">Plan first, then build. Create requirements and design before coding starts.</p>
                    <div class="mode-features">
                        <div class="mode-features-title">Great for:</div>
                        <ul>
                            <li>Complex projects</li>
                            <li>Team collaboration</li>
                            <li>Production code</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="chat-container" id="chatContainer">
            <div class="typing-indicator" id="typingIndicator">
                Genie is thinking...
            </div>
        </div>
    </div>

    <div class="input-container">
        <div class="input-wrapper">
            <div class="input-icons">
                <div class="input-icon" title="Attach file">#</div>
                <div class="input-icon" title="Add context">@</div>
            </div>
            <div class="input-box">
                <textarea 
                    id="messageInput" 
                    placeholder="Ask a question or describe a task..."
                    rows="1"
                ></textarea>
            </div>
            <button class="send-btn" id="sendBtn" onclick="sendMessage()">↑</button>
        </div>
    </div>

    <div class="footer">
        <div class="model-selector">
            <select class="model-select" id="modelSelect">
                <option value="claude-3-5-sonnet-20241022">Claude Sonnet 4.5</option>
                <option value="claude-3-opus-20240229">Claude Opus</option>
                <option value="claude-3-haiku-20240307">Claude Haiku</option>
            </select>
        </div>
        <div class="autopilot-toggle">
            <span>Autopilot</span>
            <div class="toggle-switch" id="autopilotToggle" onclick="toggleAutopilot()">
                <div class="toggle-slider"></div>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let selectedMode = 'vibe';
        let isAutopilot = false;

        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatContainer = document.getElementById('chatContainer');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const typingIndicator = document.getElementById('typingIndicator');

        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });

        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        function selectMode(mode) {
            selectedMode = mode;
            document.querySelectorAll('.mode-card').forEach(card => {
                card.classList.remove('selected');
            });
            document.querySelector(\`[data-mode="\${mode}"]\`).classList.add('selected');
        }

        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text) return;

            if (welcomeScreen.style.display !== 'none') {
                welcomeScreen.style.display = 'none';
                chatContainer.classList.add('active');
            }

            vscode.postMessage({
                command: 'sendMessage',
                text: text,
                mode: selectedMode
            });

            messageInput.value = '';
            messageInput.style.height = 'auto';
            sendBtn.disabled = true;
        }

        function newSession() {
            vscode.postMessage({ command: 'newSession' });
            welcomeScreen.style.display = 'flex';
            chatContainer.classList.remove('active');
            chatContainer.innerHTML = '<div class="typing-indicator" id="typingIndicator">Genie is thinking...</div>';
        }

        function toggleAutopilot() {
            isAutopilot = !isAutopilot;
            document.getElementById('autopilotToggle').classList.toggle('active');
        }

        window.addEventListener('message', event => {
            const message = event.data;

            switch (message.command) {
                case 'addMessage':
                    addMessage(message.role, message.content);
                    break;
                case 'showTyping':
                    typingIndicator.classList.add('show');
                    break;
                case 'hideTyping':
                    typingIndicator.classList.remove('show');
                    sendBtn.disabled = false;
                    break;
                case 'sessionCleared':
                    // Session cleared
                    break;
            }
        });

        function addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';

            const header = document.createElement('div');
            header.className = 'message-header';

            const avatar = document.createElement('div');
            avatar.className = \`message-avatar \${role === 'user' ? 'user-avatar' : 'assistant-avatar'}\`;
            avatar.textContent = role === 'user' ? '👤' : '✨';

            const roleLabel = document.createElement('div');
            roleLabel.className = 'message-role';
            roleLabel.textContent = role === 'user' ? 'You' : 'Genie';

            header.appendChild(avatar);
            header.appendChild(roleLabel);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.innerHTML = formatMessage(content);

            messageDiv.appendChild(header);
            messageDiv.appendChild(contentDiv);

            chatContainer.insertBefore(messageDiv, typingIndicator);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function formatMessage(content) {
            content = content.replace(/\`\`\`([\\w]*)[\\n]([\\s\\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>');
            content = content.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
            content = content.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
            content = content.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
            content = content.replace(/\\n/g, '<br>');
            return content;
        }
    </script>
</body>
</html>`;
    }
}
