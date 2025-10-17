const vscode = acquireVsCodeApi();
let currentAgent = null;
let agents = [];
let currentWizardStep = 1;
let wizardData = {
    languages: [],
    frameworks: []
};

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
        case 'promptGenerated':
            document.getElementById('promptPreview').textContent = message.prompt;
            document.getElementById('wizardSystemPrompt').value = message.prompt;
            break;
    }
});

// Agent Templates
const agentTemplates = {
    'react-component': {
        name: 'React Component Builder',
        description: 'Generates React components with TypeScript and best practices',
        purpose: 'code-generation',
        languages: ['TypeScript', 'JavaScript'],
        frameworks: ['React'],
        expertiseLevel: 'intermediate',
        focusArea: 'quality',
        systemPrompt: `You are an expert React developer specializing in building modern, type-safe components.

EXPERTISE:
- React 18+ with hooks and functional components
- TypeScript for type safety
- Component composition and reusability
- Performance optimization (memo, useMemo, useCallback)
- Accessibility (ARIA, semantic HTML)

CODING STYLE:
- Use functional components with TypeScript
- Implement proper prop types and interfaces
- Follow React best practices and hooks rules
- Use meaningful component and variable names
- Include JSDoc comments for complex logic

RESPONSE FORMAT:
- Provide complete, working component code
- Include necessary imports
- Add prop type definitions
- Include usage examples
- Suggest testing approaches

GUIDELINES:
- Ensure components are reusable and maintainable
- Consider performance implications
- Follow accessibility standards
- Use modern React patterns
- Include error boundaries where appropriate`,
        capabilities: ['code-generation', 'refactoring'],
        temperature: 0.5,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'api-endpoint': {
        name: 'API Endpoint Generator',
        description: 'Creates RESTful API endpoints with validation',
        purpose: 'code-generation',
        languages: ['TypeScript', 'JavaScript', 'Python'],
        frameworks: ['Express', 'FastAPI', 'NestJS'],
        expertiseLevel: 'intermediate',
        focusArea: 'quality',
        systemPrompt: `You are an expert backend developer specializing in RESTful API design.

EXPERTISE:
- RESTful API design principles
- Request validation and sanitization
- Error handling and status codes
- Authentication and authorization
- Database integration
- API documentation (OpenAPI/Swagger)

CODING STYLE:
- Follow REST conventions (GET, POST, PUT, DELETE)
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Include input validation
- Add comprehensive logging

RESPONSE FORMAT:
- Provide complete endpoint implementation
- Include route definitions
- Add validation schemas
- Implement error handling
- Include API documentation comments

GUIDELINES:
- Ensure security best practices
- Handle edge cases and errors gracefully
- Use appropriate HTTP status codes
- Implement rate limiting considerations
- Include authentication/authorization checks`,
        capabilities: ['code-generation', 'security'],
        temperature: 0.4,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'database-optimizer': {
        name: 'Database Query Optimizer',
        description: 'Optimizes SQL queries for performance',
        purpose: 'code-review',
        languages: ['SQL'],
        frameworks: ['PostgreSQL', 'MySQL', 'MongoDB'],
        expertiseLevel: 'expert',
        focusArea: 'quality',
        systemPrompt: `You are a database optimization expert specializing in query performance.

EXPERTISE:
- SQL query optimization
- Index design and usage
- Query execution plans
- Database normalization
- Performance tuning
- N+1 query problems

ANALYSIS APPROACH:
- Analyze query execution plans
- Identify missing or unused indexes
- Detect N+1 query patterns
- Suggest query rewrites
- Recommend caching strategies

RESPONSE FORMAT:
- Explain current query issues
- Provide optimized query version
- Suggest index additions
- Include performance metrics
- Explain optimization reasoning

GUIDELINES:
- Consider database-specific features
- Balance read vs write performance
- Suggest appropriate indexes
- Identify potential bottlenecks
- Provide before/after comparisons`,
        capabilities: ['code-review', 'performance'],
        temperature: 0.3,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'security-reviewer': {
        name: 'Security Code Reviewer',
        description: 'Identifies security vulnerabilities',
        purpose: 'code-review',
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
        frameworks: [],
        expertiseLevel: 'expert',
        focusArea: 'quality',
        systemPrompt: `You are a security expert specializing in code vulnerability analysis.

SECURITY FOCUS AREAS:
- SQL injection and NoSQL injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Authentication and authorization flaws
- Sensitive data exposure
- Insecure dependencies
- Security misconfigurations
- Insufficient logging and monitoring

ANALYSIS APPROACH:
- Identify OWASP Top 10 vulnerabilities
- Check for input validation issues
- Review authentication mechanisms
- Analyze data handling practices
- Examine dependency security

RESPONSE FORMAT:
- List identified vulnerabilities by severity
- Explain the security risk
- Provide secure code examples
- Suggest mitigation strategies
- Reference security standards (OWASP, CWE)

GUIDELINES:
- Prioritize critical vulnerabilities
- Provide actionable fixes
- Consider defense in depth
- Recommend security tools
- Include prevention best practices`,
        capabilities: ['code-review', 'security'],
        temperature: 0.2,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'performance-analyzer': {
        name: 'Performance Analyzer',
        description: 'Analyzes and optimizes code performance',
        purpose: 'code-review',
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
        frameworks: [],
        expertiseLevel: 'expert',
        focusArea: 'quality',
        systemPrompt: `You are a performance optimization expert.

PERFORMANCE AREAS:
- Time complexity analysis
- Space complexity analysis
- Memory leaks and management
- Algorithmic efficiency
- Caching strategies
- Async/await optimization
- Bundle size optimization

ANALYSIS APPROACH:
- Identify performance bottlenecks
- Analyze algorithm complexity
- Detect memory leaks
- Review resource usage
- Suggest optimization strategies

RESPONSE FORMAT:
- Identify performance issues
- Explain impact and metrics
- Provide optimized code
- Include complexity analysis
- Suggest profiling approaches

GUIDELINES:
- Focus on measurable improvements
- Consider trade-offs
- Provide benchmarking suggestions
- Recommend monitoring tools
- Balance optimization vs readability`,
        capabilities: ['code-review', 'performance'],
        temperature: 0.3,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'test-generator': {
        name: 'Test Case Generator',
        description: 'Generates comprehensive test suites',
        purpose: 'testing',
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
        frameworks: ['Jest', 'Vitest', 'Pytest', 'JUnit'],
        expertiseLevel: 'intermediate',
        focusArea: 'quality',
        systemPrompt: `You are a testing expert specializing in comprehensive test coverage.

TESTING EXPERTISE:
- Unit testing best practices
- Integration testing
- Test-driven development (TDD)
- Mocking and stubbing
- Test coverage analysis
- Edge case identification

TEST TYPES:
- Unit tests for individual functions
- Integration tests for component interaction
- Edge cases and boundary conditions
- Error handling scenarios
- Performance tests

RESPONSE FORMAT:
- Provide complete test suite
- Include setup and teardown
- Add descriptive test names
- Cover happy path and edge cases
- Include mock data and fixtures

GUIDELINES:
- Follow AAA pattern (Arrange, Act, Assert)
- Write clear, maintainable tests
- Aim for high code coverage
- Test behavior, not implementation
- Include both positive and negative tests`,
        capabilities: ['testing', 'code-generation'],
        temperature: 0.4,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'documentation-writer': {
        name: 'Documentation Writer',
        description: 'Creates comprehensive documentation',
        purpose: 'documentation',
        languages: ['Markdown'],
        frameworks: [],
        expertiseLevel: 'intermediate',
        focusArea: 'learning',
        systemPrompt: `You are a technical documentation expert.

DOCUMENTATION TYPES:
- API documentation
- Code comments and JSDoc
- README files
- Architecture documentation
- User guides
- Tutorial content

DOCUMENTATION STYLE:
- Clear, concise language
- Structured with headings
- Include code examples
- Add diagrams when helpful
- Provide usage examples

RESPONSE FORMAT:
- Well-structured markdown
- Include table of contents
- Add code examples with syntax highlighting
- Include installation/setup instructions
- Provide troubleshooting section

GUIDELINES:
- Write for the target audience
- Use consistent terminology
- Include practical examples
- Keep documentation up-to-date
- Add links to related resources`,
        capabilities: ['documentation'],
        temperature: 0.6,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    },
    'refactoring-specialist': {
        name: 'Code Refactoring Specialist',
        description: 'Refactors code for better design',
        purpose: 'refactoring',
        languages: ['JavaScript', 'TypeScript', 'Python', 'Java'],
        frameworks: [],
        expertiseLevel: 'expert',
        focusArea: 'quality',
        systemPrompt: `You are a code refactoring expert specializing in clean code principles.

REFACTORING FOCUS:
- SOLID principles
- Design patterns
- Code smells elimination
- DRY (Don't Repeat Yourself)
- Separation of concerns
- Naming conventions
- Function/method extraction

ANALYSIS APPROACH:
- Identify code smells
- Suggest design patterns
- Improve code structure
- Enhance readability
- Reduce complexity

RESPONSE FORMAT:
- Explain current issues
- Provide refactored code
- Explain improvements
- Show before/after comparison
- Suggest further improvements

GUIDELINES:
- Maintain existing functionality
- Improve maintainability
- Enhance testability
- Follow language idioms
- Consider team conventions`,
        capabilities: ['refactoring', 'code-review'],
        temperature: 0.4,
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    }
};

// Wizard Functions
function startWizard() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('wizardContainer').style.display = 'block';
    document.getElementById('agentForm').style.display = 'none';
    document.getElementById('contentTitle').textContent = 'Create Agent - Wizard';
    document.getElementById('headerActions').style.display = 'none';
    currentWizardStep = 1;
    wizardData = { languages: [], frameworks: [] };
    updateWizardStep();
}

function nextStep() {
    if (currentWizardStep < 4) {
        currentWizardStep++;
        updateWizardStep();

        // Generate prompt preview on step 4
        if (currentWizardStep === 4) {
            generatePromptPreview();
        }
    }
}

function previousStep() {
    if (currentWizardStep > 1) {
        currentWizardStep--;
        updateWizardStep();
    }
}

function updateWizardStep() {
    // Update step indicators
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentWizardStep) {
            step.classList.add('active');
        } else if (stepNum < currentWizardStep) {
            step.classList.add('completed');
        }
    });

    // Update pages
    document.querySelectorAll('.wizard-page').forEach((page, index) => {
        page.classList.remove('active');
        if (index + 1 === currentWizardStep) {
            page.classList.add('active');
        }
    });

    // Update navigation buttons
    document.getElementById('wizardPrev').style.display = currentWizardStep > 1 ? 'block' : 'none';
    document.getElementById('wizardNext').style.display = currentWizardStep < 4 ? 'block' : 'none';
    document.getElementById('wizardFinish').style.display = currentWizardStep === 4 ? 'block' : 'none';
}

function generatePromptPreview() {
    const config = {
        purpose: document.querySelector('input[name="wizardPurpose"]:checked')?.value || '',
        languages: wizardData.languages,
        frameworks: wizardData.frameworks,
        expertiseLevel: document.getElementById('wizardExpertise').value,
        focusArea: document.querySelector('input[name="wizardFocus"]:checked')?.value || 'quality',
        codingStyle: document.getElementById('wizardCodingStyle').value
    };

    vscode.postMessage({
        command: 'generatePrompt',
        config: config
    });
}

function finishWizard() {
    const agent = {
        id: '',
        name: document.getElementById('wizardName').value.trim(),
        description: document.getElementById('wizardDescription').value.trim(),
        systemPrompt: document.getElementById('wizardSystemPrompt').value.trim(),
        purpose: document.querySelector('input[name="wizardPurpose"]:checked')?.value || '',
        languages: wizardData.languages,
        frameworks: wizardData.frameworks,
        expertiseLevel: document.getElementById('wizardExpertise').value,
        focusArea: document.querySelector('input[name="wizardFocus"]:checked')?.value || 'quality',
        codingStyle: document.getElementById('wizardCodingStyle').value,
        capabilities: determineCapabilities(),
        temperature: parseFloat(document.getElementById('wizardTemperature').value),
        maxTokens: 4096,
        model: 'claude-3-5-sonnet-20241022'
    };

    if (!agent.name || !agent.systemPrompt) {
        alert('Please fill in required fields (Name and System Prompt)');
        return;
    }

    vscode.postMessage({
        command: 'saveAgent',
        agent: agent
    });

    // Reset wizard
    document.getElementById('wizardContainer').style.display = 'none';
    document.getElementById('emptyState').style.display = 'flex';
}

function determineCapabilities() {
    const purpose = document.querySelector('input[name="wizardPurpose"]:checked')?.value;
    const capabilityMap = {
        'code-generation': ['code-generation'],
        'code-review': ['code-review', 'debugging'],
        'refactoring': ['refactoring', 'code-review'],
        'testing': ['testing', 'code-generation'],
        'documentation': ['documentation']
    };
    return capabilityMap[purpose] || [];
}

// Tag Input Functions
function setupTagInput(inputId, tagsContainerId, dataKey) {
    const input = document.getElementById(inputId);
    const container = document.getElementById(tagsContainerId);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            e.preventDefault();
            const value = input.value.trim();
            if (!wizardData[dataKey].includes(value)) {
                wizardData[dataKey].push(value);
                renderTags(container, dataKey, inputId);
            }
            input.value = '';
        }
    });
}

function renderTags(container, dataKey, inputId) {
    const tags = wizardData[dataKey];
    const input = document.getElementById(inputId);

    // Clear existing tags
    Array.from(container.children).forEach(child => {
        if (!child.classList.contains('tag-input')) {
            child.remove();
        }
    });

    // Add tags
    tags.forEach(tag => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag';
        tagEl.innerHTML = `${tag} <span class="tag-remove" onclick="removeTag('${dataKey}', '${tag}')">×</span>`;
        container.insertBefore(tagEl, input);
    });
}

function removeTag(dataKey, value) {
    wizardData[dataKey] = wizardData[dataKey].filter(v => v !== value);
    const containerId = dataKey === 'languages' ? 'languagesTags' : 'frameworksTags';
    const inputId = dataKey === 'languages' ? 'languagesInput' : 'frameworksInput';
    renderTags(document.getElementById(containerId), dataKey, inputId);
}

// Initialize tag inputs
setTimeout(() => {
    setupTagInput('languagesInput', 'languagesTags', 'languages');
    setupTagInput('frameworksInput', 'frameworksTags', 'frameworks');
}, 100);

// Temperature slider
document.getElementById('wizardTemperature')?.addEventListener('input', function() {
    document.getElementById('wizardTemperatureValue').textContent = this.value;
});

// Template Functions
function useTemplate(templateId) {
    const template = agentTemplates[templateId];
    if (!template) return;

    currentAgent = { ...template, id: '' };

    // Show wizard with pre-filled data
    startWizard();

    // Fill wizard fields
    document.getElementById('wizardName').value = template.name;
    document.getElementById('wizardDescription').value = template.description;

    // Set purpose
    const purposeRadio = document.querySelector(`input[name="wizardPurpose"][value="${template.purpose}"]`);
    if (purposeRadio) purposeRadio.checked = true;

    // Set languages and frameworks
    wizardData.languages = [...template.languages];
    wizardData.frameworks = [...template.frameworks];

    // Set expertise
    document.getElementById('wizardExpertise').value = template.expertiseLevel;

    // Set focus
    const focusRadio = document.querySelector(`input[name="wizardFocus"][value="${template.focusArea}"]`);
    if (focusRadio) focusRadio.checked = true;

    // Set temperature
    document.getElementById('wizardTemperature').value = template.temperature;
    document.getElementById('wizardTemperatureValue').textContent = template.temperature;
}

// Agent List Functions
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

function loadAgent(agent) {
    currentAgent = agent;
    // Show agent details (implement as needed)
}

function createNewAgent() {
    // Show quick create form
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('wizardContainer').style.display = 'none';
    document.getElementById('agentForm').style.display = 'block';
    document.getElementById('headerActions').style.display = 'flex';
}

function saveAgent() {
    // Implement save logic
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

function exportAgent() {
    if (!currentAgent || !currentAgent.id) return;
    vscode.postMessage({
        command: 'exportAgent',
        agentId: currentAgent.id
    });
}

function importAgent() {
    vscode.postMessage({
        command: 'importAgent'
    });
}

function showEmptyState() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('wizardContainer').style.display = 'none';
    document.getElementById('agentForm').style.display = 'none';
    document.getElementById('headerActions').style.display = 'none';
    document.getElementById('contentTitle').textContent = 'Agent Builder';
}
