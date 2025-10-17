import * as vscode from 'vscode';

export interface AgentConfig {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    capabilities: string[];
    temperature: number;
    maxTokens: number;
    model: string;
    purpose?: string;
    expertiseLevel?: string;
    languages?: string[];
    frameworks?: string[];
    codingStyle?: string;
    responseFormat?: string;
    focusArea?: string;
}

export class AgentBuilderPanel {
    public static currentPanel: AgentBuilderPanel | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _agents: AgentConfig[] = [];

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._loadAgents();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlForWebview();
        this._setWebviewMessageListener();
    }

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor?.viewColumn;

        if (AgentBuilderPanel.currentPanel) {
            AgentBuilderPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            'genieAgentBuilder',
            'Genie Agent Builder',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [extensionUri]
            }
        );

        AgentBuilderPanel.currentPanel = new AgentBuilderPanel(panel, extensionUri);
    }

    public dispose() {
        AgentBuilderPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private async _loadAgents() {
        const config = vscode.workspace.getConfiguration('genie');
        this._agents = config.get<AgentConfig[]>('customAgents') || [];
    }

    private async _saveAgents() {
        const config = vscode.workspace.getConfiguration('genie');
        await config.update('customAgents', this._agents, vscode.ConfigurationTarget.Global);
    }

    private _setWebviewMessageListener() {
        this._panel.webview.onDidReceiveMessage(
            async (message: any) => {
                switch (message.command) {
                    case 'getAgents':
                        this._panel.webview.postMessage({
                            command: 'agentsList',
                            agents: this._agents
                        });
                        break;
                    case 'saveAgent':
                        await this._saveAgent(message.agent);
                        break;
                    case 'deleteAgent':
                        await this._deleteAgent(message.agentId);
                        break;
                    case 'testAgent':
                        await this._testAgent(message.agent);
                        break;
                    case 'generatePrompt':
                        this._generateSystemPrompt(message.config);
                        break;
                    case 'exportAgent':
                        await this._exportAgent(message.agentId);
                        break;
                    case 'importAgent':
                        await this._importAgent();
                        break;
                }
            },
            null,
            this._disposables
        );
    }

    private async _saveAgent(agent: AgentConfig) {
        const existingIndex = this._agents.findIndex(a => a.id === agent.id);

        if (existingIndex >= 0) {
            this._agents[existingIndex] = agent;
        } else {
            agent.id = Date.now().toString();
            this._agents.push(agent);
        }

        await this._saveAgents();

        this._panel.webview.postMessage({
            command: 'agentSaved',
            agent: agent
        });

        vscode.window.showInformationMessage(`Agent "${agent.name}" saved successfully!`);
    }

    private async _deleteAgent(agentId: string) {
        this._agents = this._agents.filter(a => a.id !== agentId);
        await this._saveAgents();

        this._panel.webview.postMessage({
            command: 'agentDeleted',
            agentId: agentId
        });

        vscode.window.showInformationMessage('Agent deleted successfully!');
    }

    private async _testAgent(agent: AgentConfig) {
        vscode.window.showInformationMessage(`Testing agent "${agent.name}"...`);
        // This would integrate with the chat panel to test the agent
    }

    private _generateSystemPrompt(config: any) {
        const prompt = this._buildSystemPromptFromConfig(config);
        this._panel.webview.postMessage({
            command: 'promptGenerated',
            prompt: prompt
        });
    }

    private _buildSystemPromptFromConfig(config: any): string {
        let prompt = `You are a ${config.expertiseLevel || 'expert'} ${config.purpose || 'coding assistant'}.\n\n`;

        if (config.languages && config.languages.length > 0) {
            prompt += `SPECIALIZATION:\n`;
            prompt += `- Languages: ${config.languages.join(', ')}\n`;
        }

        if (config.frameworks && config.frameworks.length > 0) {
            prompt += `- Frameworks: ${config.frameworks.join(', ')}\n`;
        }

        prompt += `\nEXPERTISE LEVEL: ${config.expertiseLevel || 'Expert'}\n`;

        if (config.codingStyle) {
            prompt += `\nCODING STYLE:\n${config.codingStyle}\n`;
        }

        prompt += `\nRESPONSE FORMAT:\n`;
        if (config.focusArea === 'speed') {
            prompt += `- Provide quick, concise solutions\n`;
            prompt += `- Focus on working code first\n`;
            prompt += `- Minimal explanation unless asked\n`;
        } else if (config.focusArea === 'quality') {
            prompt += `- Provide well-tested, production-ready code\n`;
            prompt += `- Include error handling and edge cases\n`;
            prompt += `- Follow best practices and design patterns\n`;
        } else if (config.focusArea === 'learning') {
            prompt += `- Provide detailed explanations\n`;
            prompt += `- Explain the reasoning behind decisions\n`;
            prompt += `- Include learning resources and alternatives\n`;
        }

        prompt += `\nGUIDELINES:\n`;
        prompt += `- Write clean, maintainable code\n`;
        prompt += `- Include relevant comments\n`;
        prompt += `- Consider performance and security\n`;
        prompt += `- Suggest improvements when appropriate\n`;

        return prompt;
    }

    private async _exportAgent(agentId: string) {
        const agent = this._agents.find(a => a.id === agentId);
        if (!agent) return;

        const json = JSON.stringify(agent, null, 2);
        const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(`${agent.name.replace(/\s+/g, '-').toLowerCase()}.json`),
            filters: { 'JSON': ['json'] }
        });

        if (uri) {
            await vscode.workspace.fs.writeFile(uri, Buffer.from(json, 'utf8'));
            vscode.window.showInformationMessage(`Agent exported to ${uri.fsPath}`);
        }
    }

    private async _importAgent() {
        const uri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: { 'JSON': ['json'] }
        });

        if (uri && uri[0]) {
            const content = await vscode.workspace.fs.readFile(uri[0]);
            const agent = JSON.parse(content.toString()) as AgentConfig;
            agent.id = Date.now().toString();
            this._agents.push(agent);
            await this._saveAgents();

            this._panel.webview.postMessage({
                command: 'agentsList',
                agents: this._agents
            });

            vscode.window.showInformationMessage(`Agent "${agent.name}" imported successfully!`);
        }
    }

    private _getHtmlForWebview(): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Genie Agent Builder</title>
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
        }

        .sidebar {
            width: 280px;
            border-right: 1px solid var(--vscode-panel-border);
            display: flex;
            flex-direction: column;
        }

        .sidebar-header {
            padding: 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }

        .sidebar-header h2 {
            font-size: 16px;
            margin-bottom: 12px;
        }

        .btn {
            width: 100%;
            padding: 8px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
        }

        .btn:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .agents-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
        }

        .agent-item {
            padding: 12px;
            margin-bottom: 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .agent-item:hover {
            border-color: var(--vscode-focusBorder);
        }

        .agent-item.active {
            background: var(--vscode-list-activeSelectionBackground);
            border-color: var(--vscode-focusBorder);
        }

        .agent-item h3 {
            font-size: 14px;
            margin-bottom: 4px;
        }

        .agent-item p {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .content-header {
            padding: 16px;
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .content-header h1 {
            font-size: 20px;
        }

        .header-actions {
            display: flex;
            gap: 8px;
        }

        .btn-secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }

        .btn-secondary:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }

        .form-container {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 8px 12px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-size: 13px;
            font-family: inherit;
        }

        .form-group textarea {
            min-height: 120px;
            resize: vertical;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }

        .form-group .help-text {
            margin-top: 4px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        .capabilities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 8px;
        }

        .capability-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
        }

        .capability-item input[type="checkbox"] {
            width: auto;
        }

        .capability-item label {
            margin: 0;
            font-weight: normal;
            cursor: pointer;
        }

        .slider-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .slider-container input[type="range"] {
            flex: 1;
        }

        .slider-value {
            min-width: 40px;
            text-align: right;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .empty-state {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 48px;
            color: var(--vscode-descriptionForeground);
        }

        .empty-state-icon {
            font-size: 64px;
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

        .template-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            width: 100%;
            max-width: 800px;
        }

        .template-card {
            padding: 20px;
            background: var(--vscode-input-background);
            border: 1px solid var(--vscode-input-border);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .template-card:hover {
            border-color: var(--vscode-focusBorder);
            transform: translateY(-2px);
        }

        .template-card h3 {
            font-size: 16px;
            margin-bottom: 8px;
        }

        .template-card p {
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="sidebar-header">
            <h2>My Agents</h2>
            <button class="btn" onclick="createNewAgent()">+ New Agent</button>
        </div>
        <div class="agents-list" id="agentsList">
            <!-- Agents will be populated here -->
        </div>
    </div>

    <div class="main-content">
        <div class="content-header">
            <h1 id="contentTitle">Agent Builder</h1>
            <div class="header-actions" id="headerActions" style="display: none;">
                <button class="btn btn-secondary" onclick="testAgent()">Test Agent</button>
                <button class="btn btn-secondary" onclick="deleteAgent()">Delete</button>
                <button class="btn" onclick="saveAgent()">Save Agent</button>
            </div>
        </div>

        <div class="form-container" id="formContainer">
            <div class="empty-state" id="emptyState">
                <div class="empty-state-icon">🤖</div>
                <h2>Build Your Custom Agent</h2>
                <p>Create specialized AI agents tailored to your workflow</p>
                <div class="template-cards">
                    <div class="template-card" onclick="useTemplate('code-reviewer')">
                        <h3>🔍 Code Reviewer</h3>
                        <p>Reviews code for best practices, bugs, and improvements</p>
                    </div>
                    <div class="template-card" onclick="useTemplate('test-generator')">
                        <h3>🧪 Test Generator</h3>
                        <p>Generates comprehensive unit and integration tests</p>
                    </div>
                    <div class="template-card" onclick="useTemplate('documentation')">
                        <h3>📚 Documentation Writer</h3>
                        <p>Creates detailed documentation and comments</p>
                    </div>
                    <div class="template-card" onclick="useTemplate('refactoring')">
                        <h3>♻️ Refactoring Expert</h3>
                        <p>Suggests code improvements and refactoring strategies</p>
                    </div>
                </div>
            </div>

            <form id="agentForm" style="display: none;">
                <div class="form-group">
                    <label for="agentName">Agent Name *</label>
                    <input type="text" id="agentName" placeholder="e.g., Code Reviewer Pro" required>
                    <div class="help-text">Give your agent a descriptive name</div>
                </div>

                <div class="form-group">
                    <label for="agentDescription">Description</label>
                    <input type="text" id="agentDescription" placeholder="Brief description of what this agent does">
                    <div class="help-text">Helps you remember the agent's purpose</div>
                </div>

                <div class="form-group">
                    <label for="agentModel">Model</label>
                    <select id="agentModel">
                        <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                        <option value="claude-3-opus-20240229">Claude 3 Opus (Most Capable)</option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku (Fastest)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="systemPrompt">System Prompt *</label>
                    <textarea id="systemPrompt" placeholder="You are a helpful coding assistant that..." required></textarea>
                    <div class="help-text">Define the agent's behavior, expertise, and response style</div>
                </div>

                <div class="form-group">
                    <label>Capabilities</label>
                    <div class="capabilities-grid">
                        <div class="capability-item">
                            <input type="checkbox" id="cap-code-gen" value="code-generation">
                            <label for="cap-code-gen">Code Generation</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-debugging" value="debugging">
                            <label for="cap-debugging">Debugging</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-review" value="code-review">
                            <label for="cap-review">Code Review</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-testing" value="testing">
                            <label for="cap-testing">Testing</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-docs" value="documentation">
                            <label for="cap-docs">Documentation</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-refactor" value="refactoring">
                            <label for="cap-refactor">Refactoring</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-security" value="security">
                            <label for="cap-security">Security Analysis</label>
                        </div>
                        <div class="capability-item">
                            <input type="checkbox" id="cap-performance" value="performance">
                            <label for="cap-performance">Performance</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="temperature">Temperature</label>
                    <div class="slider-container">
                        <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7">
                        <span class="slider-value" id="temperatureValue">0.7</span>
                    </div>
                    <div class="help-text">Lower = more focused, Higher = more creative</div>
                </div>

                <div class="form-group">
                    <label for="maxTokens">Max Tokens</label>
                    <div class="slider-container">
                        <input type="range" id="maxTokens" min="1024" max="8192" step="512" value="4096">
                        <span class="slider-value" id="maxTokensValue">4096</span>
                    </div>
                    <div class="help-text">Maximum length of responses</div>
                </div>
            </form>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentAgent = null;
        let agents = [];

        // Request agents on load
        vscode.postMessage({ command: 'getAgents' });

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'agentsList':
                    agents = message.agents;
                    renderAgentsList();
                    break;
                case 'agentSaved':
                    currentAgent = message.agent;
                    vscode.postMessage({ command: 'getAgents' });
                    break;
                case 'agentDeleted':
                    currentAgent = null;
                    showEmptyState();
                    vscode.postMessage({ command: 'getAgents' });
                    break;
            }
        });

        function renderAgentsList() {
            const list = document.getElementById('agentsList');
            list.innerHTML = '';

            agents.forEach(agent => {
                const item = document.createElement('div');
                item.className = 'agent-item';
                if (currentAgent && currentAgent.id === agent.id) {
                    item.classList.add('active');
                }
                const title = document.createElement('h3');
                title.textContent = agent.name;
                const desc = document.createElement('p');
                desc.textContent = agent.description || 'No description';
                item.appendChild(title);
                item.appendChild(desc);
                item.onclick = () => loadAgent(agent);
                list.appendChild(item);
            });
        }

        function createNewAgent() {
            currentAgent = {
                id: '',
                name: '',
                description: '',
                systemPrompt: '',
                capabilities: [],
                temperature: 0.7,
                maxTokens: 4096,
                model: 'claude-3-5-sonnet-20241022'
            };
            showForm();
        }

        function loadAgent(agent) {
            currentAgent = agent;
            showForm();
            populateForm(agent);
        }

        function showForm() {
            document.getElementById('emptyState').style.display = 'none';
            document.getElementById('agentForm').style.display = 'block';
            document.getElementById('headerActions').style.display = 'flex';
            document.getElementById('contentTitle').textContent = currentAgent.id ? 'Edit Agent' : 'New Agent';
        }

        function showEmptyState() {
            document.getElementById('emptyState').style.display = 'flex';
            document.getElementById('agentForm').style.display = 'none';
            document.getElementById('headerActions').style.display = 'none';
            document.getElementById('contentTitle').textContent = 'Agent Builder';
        }

        function populateForm(agent) {
            document.getElementById('agentName').value = agent.name;
            document.getElementById('agentDescription').value = agent.description;
            document.getElementById('agentModel').value = agent.model;
            document.getElementById('systemPrompt').value = agent.systemPrompt;
            document.getElementById('temperature').value = agent.temperature;
            document.getElementById('temperatureValue').textContent = agent.temperature;
            document.getElementById('maxTokens').value = agent.maxTokens;
            document.getElementById('maxTokensValue').textContent = agent.maxTokens;

            // Clear all checkboxes first
            document.querySelectorAll('.capability-item input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });

            // Check the agent's capabilities
            agent.capabilities.forEach(cap => {
                const checkbox = document.querySelector('input[value="' + cap + '"]');
                if (checkbox) checkbox.checked = true;
            });
        }

        function saveAgent() {
            const name = document.getElementById('agentName').value.trim();
            const systemPrompt = document.getElementById('systemPrompt').value.trim();

            if (!name || !systemPrompt) {
                alert('Please fill in required fields (Name and System Prompt)');
                return;
            }

            const capabilities = Array.from(
                document.querySelectorAll('.capability-item input[type="checkbox"]:checked')
            ).map(cb => cb.value);

            const agent = {
                id: currentAgent.id,
                name: name,
                description: document.getElementById('agentDescription').value.trim(),
                systemPrompt: systemPrompt,
                capabilities: capabilities,
                temperature: parseFloat(document.getElementById('temperature').value),
                maxTokens: parseInt(document.getElementById('maxTokens').value),
                model: document.getElementById('agentModel').value
            };

            vscode.postMessage({
                command: 'saveAgent',
                agent: agent
            });
        }

        function deleteAgent() {
            if (!currentAgent || !currentAgent.id) return;

            if (confirm('Are you sure you want to delete "' + currentAgent.name + '"?')) {
                vscode.postMessage({
                    command: 'deleteAgent',
                    agentId: currentAgent.id
                });
            }
        }

        function testAgent() {
            if (!currentAgent) return;
            vscode.postMessage({
                command: 'testAgent',
                agent: currentAgent
            });
        }

        function useTemplate(templateId) {
            const templates = {
                'code-reviewer': {
                    name: 'Code Reviewer',
                    description: 'Reviews code for best practices and improvements',
                    systemPrompt: 'You are an expert code reviewer. Analyze code for:\n- Code quality and best practices\n- Potential bugs and edge cases\n- Performance optimizations\n- Security vulnerabilities\n- Maintainability and readability\n\nProvide constructive feedback with specific suggestions.',
                    capabilities: ['code-review', 'debugging', 'security', 'performance']
                },
                'test-generator': {
                    name: 'Test Generator',
                    description: 'Generates comprehensive tests',
                    systemPrompt: 'You are a testing expert. Generate comprehensive tests including:\n- Unit tests for individual functions\n- Integration tests for component interactions\n- Edge cases and error scenarios\n- Mock data and fixtures\n\nUse appropriate testing frameworks and follow best practices.',
                    capabilities: ['testing', 'code-generation']
                },
                'documentation': {
                    name: 'Documentation Writer',
                    description: 'Creates detailed documentation',
                    systemPrompt: 'You are a technical documentation expert. Create clear, comprehensive documentation:\n- Function and class documentation\n- API documentation\n- Usage examples\n- Architecture explanations\n\nWrite in clear, accessible language.',
                    capabilities: ['documentation']
                },
                'refactoring': {
                    name: 'Refactoring Expert',
                    description: 'Suggests code improvements',
                    systemPrompt: 'You are a refactoring specialist. Suggest improvements for:\n- Code structure and organization\n- Design patterns\n- DRY principles\n- SOLID principles\n- Performance optimizations\n\nExplain the benefits of each suggestion.',
                    capabilities: ['refactoring', 'code-review', 'performance']
                }
            };

            const template = templates[templateId];
            if (template) {
                currentAgent = {
                    id: '',
                    ...template,
                    temperature: 0.7,
                    maxTokens: 4096,
                    model: 'claude-3-5-sonnet-20241022'
                };
                showForm();
                populateForm(currentAgent);
            }
        }

        // Slider value updates
        document.getElementById('temperature').addEventListener('input', function() {
            document.getElementById('temperatureValue').textContent = this.value;
        });

        document.getElementById('maxTokens').addEventListener('input', function() {
            document.getElementById('maxTokensValue').textContent = this.value;
        });
    </script>
</body>
</html>`;
    }
}
