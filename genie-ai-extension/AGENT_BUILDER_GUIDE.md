# Genie AI Agent Builder - Complete Guide

## Overview

The Genie AI Agent Builder is a powerful visual tool for creating custom AI coding assistants tailored to your specific needs. Build specialized agents for any coding task without writing complex prompts.

## Features

### 🧙 **Guided Wizard Mode**
Step-by-step agent creation with intelligent prompt generation

### 📦 **8 Pre-built Templates**
Ready-to-use agents for common development tasks

### 🎨 **Visual Configuration**
Intuitive interface for customizing agent behavior

### 💾 **Import/Export**
Share agents with your team or community

### 🧪 **Test Mode**
Try your agents before deploying them

---

## Getting Started

### Opening the Agent Builder

**Three ways to open:**
1. **Keyboard**: `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
2. **Command Palette**: `Genie: Open Agent Builder`
3. **Status Bar**: Click "✨ Genie AI" → Agent Builder

---

## Creating Agents

### Method 1: Wizard Mode (Recommended)

The wizard guides you through 4 steps to create a perfect agent:

#### **Step 1: Purpose**

Define what your agent will do:

**Agent Purpose Options:**
- **Code Generation** - Creates new code from descriptions
- **Code Review & Analysis** - Reviews code for quality and bugs
- **Code Refactoring** - Improves code structure
- **Testing & QA** - Generates tests and finds issues
- **Documentation** - Creates docs and comments

**Example:**
```
Name: React Component Builder
Description: Generates React components with TypeScript
Purpose: Code Generation
```

#### **Step 2: Technology**

Specify the tech stack:

**Programming Languages:**
- Add languages by typing and pressing Enter
- Common: JavaScript, TypeScript, Python, Java, Go, Rust, C++

**Frameworks & Libraries:**
- Add frameworks the same way
- Common: React, Vue, Angular, Express, Django, Spring, FastAPI

**Expertise Level:**
- **Beginner** - Simple, well-explained code
- **Intermediate** - Balanced complexity (recommended)
- **Expert** - Advanced patterns and optimizations

**Example:**
```
Languages: TypeScript, JavaScript
Frameworks: React, Next.js
Expertise: Intermediate
```

#### **Step 3: Behavior**

Configure how the agent responds:

**Focus Area:**
- **⚡ Speed** - Quick, concise solutions
- **✨ Quality** - Production-ready code with best practices
- **📚 Learning** - Detailed explanations and education

**Coding Style Preferences (Optional):**
```
- Use functional programming
- Prefer composition over inheritance
- Follow Airbnb style guide
- Include TypeScript types
- Add JSDoc comments
```

**Creativity Level:**
- **0.0-0.3** - Very focused, deterministic
- **0.4-0.6** - Balanced (recommended)
- **0.7-1.0** - More creative and varied

**Example:**
```
Focus: Quality
Coding Style: Functional programming, TypeScript, Airbnb style
Creativity: 0.5
```

#### **Step 4: Review**

Review and customize the generated prompt:

The wizard automatically generates a comprehensive system prompt based on your inputs. You can:
- Review the generated prompt
- Edit it to add specific requirements
- Add custom guidelines
- Finalize and create the agent

**Generated Prompt Example:**
```
You are an intermediate React developer specializing in code generation.

SPECIALIZATION:
- Languages: TypeScript, JavaScript
- Frameworks: React, Next.js

EXPERTISE LEVEL: Intermediate

CODING STYLE:
- Use functional programming
- Prefer composition over inheritance
- Follow Airbnb style guide

RESPONSE FORMAT:
- Provide well-tested, production-ready code
- Include error handling and edge cases
- Follow best practices and design patterns

GUIDELINES:
- Write clean, maintainable code
- Include relevant comments
- Consider performance and security
- Suggest improvements when appropriate
```

### Method 2: Template-Based Creation

Choose from 8 pre-built templates:

#### 1. ⚛️ **React Component Builder**
```yaml
Purpose: Generate React components
Languages: TypeScript, JavaScript
Frameworks: React
Focus: Quality
Use Case: Building UI components with hooks and TypeScript
```

#### 2. 🔌 **API Endpoint Generator**
```yaml
Purpose: Create RESTful APIs
Languages: TypeScript, JavaScript, Python
Frameworks: Express, FastAPI, NestJS
Focus: Quality
Use Case: Building backend endpoints with validation
```

#### 3. 🗄️ **Database Query Optimizer**
```yaml
Purpose: Optimize SQL queries
Languages: SQL
Frameworks: PostgreSQL, MySQL, MongoDB
Focus: Quality
Use Case: Improving database performance
```

#### 4. 🔒 **Security Code Reviewer**
```yaml
Purpose: Find security vulnerabilities
Languages: JavaScript, TypeScript, Python, Java
Focus: Quality
Use Case: Security audits and vulnerability detection
```

#### 5. ⚡ **Performance Analyzer**
```yaml
Purpose: Analyze and optimize performance
Languages: JavaScript, TypeScript, Python, Java, Go
Focus: Quality
Use Case: Performance optimization and profiling
```

#### 6. 🧪 **Test Case Generator**
```yaml
Purpose: Generate test suites
Languages: JavaScript, TypeScript, Python, Java
Frameworks: Jest, Vitest, Pytest, JUnit
Focus: Quality
Use Case: Creating comprehensive test coverage
```

#### 7. 📚 **Documentation Writer**
```yaml
Purpose: Create documentation
Languages: Markdown
Focus: Learning
Use Case: API docs, README files, code comments
```

#### 8. ♻️ **Code Refactoring Specialist**
```yaml
Purpose: Refactor code
Languages: JavaScript, TypeScript, Python, Java
Focus: Quality
Use Case: Improving code structure and maintainability
```

### Method 3: Quick Create

For advanced users who want full control:
1. Click "Quick Create"
2. Manually configure all settings
3. Write custom system prompt
4. Save agent

---

## Agent Configuration Reference

### System Prompt Structure

A well-structured system prompt includes:

```
1. ROLE DEFINITION
   - Who the agent is
   - Primary expertise

2. SPECIALIZATION
   - Languages and frameworks
   - Specific domains

3. EXPERTISE LEVEL
   - Beginner, Intermediate, or Expert

4. CODING STYLE
   - Preferred patterns
   - Conventions to follow

5. RESPONSE FORMAT
   - How to present solutions
   - What to include

6. GUIDELINES
   - Quality standards
   - Best practices
```

### Example: Custom Security Agent

```
You are an expert security engineer specializing in web application security.

SPECIALIZATION:
- Languages: JavaScript, TypeScript, Python
- Frameworks: React, Express, Django
- Security: OWASP Top 10, Penetration Testing

EXPERTISE LEVEL: Expert

SECURITY FOCUS:
- SQL/NoSQL injection
- XSS and CSRF attacks
- Authentication vulnerabilities
- Data exposure risks
- Dependency vulnerabilities

RESPONSE FORMAT:
- Identify vulnerabilities by severity (Critical, High, Medium, Low)
- Explain the security risk and potential impact
- Provide secure code examples
- Suggest mitigation strategies
- Reference security standards (OWASP, CWE)

GUIDELINES:
- Prioritize critical vulnerabilities
- Provide actionable, specific fixes
- Consider defense in depth
- Recommend security tools and practices
- Include prevention strategies
```

---

## Advanced Features

### Import/Export Agents

**Export an Agent:**
1. Select the agent from the sidebar
2. Click "📤 Export"
3. Choose save location
4. Share the JSON file

**Import an Agent:**
1. Click "📥 Import Agent"
2. Select the JSON file
3. Agent is added to your library

**Agent JSON Format:**
```json
{
  "id": "1234567890",
  "name": "React Component Builder",
  "description": "Generates React components",
  "systemPrompt": "You are an expert...",
  "capabilities": ["code-generation", "refactoring"],
  "temperature": 0.5,
  "maxTokens": 4096,
  "model": "claude-3-5-sonnet-20241022",
  "languages": ["TypeScript", "JavaScript"],
  "frameworks": ["React"],
  "expertiseLevel": "intermediate",
  "focusArea": "quality"
}
```

### Testing Agents

Before deploying an agent:
1. Select the agent
2. Click "🧪 Test"
3. Opens chat panel with the agent
4. Try sample queries
5. Refine if needed

### Managing Agents

**Edit an Agent:**
1. Click the agent in the sidebar
2. Modify settings
3. Click "💾 Save"

**Delete an Agent:**
1. Select the agent
2. Click "🗑️ Delete"
3. Confirm deletion

**Duplicate an Agent:**
1. Export the agent
2. Import it back
3. Rename and modify

---

## Best Practices

### 1. **Be Specific**
```
❌ "You are a developer"
✅ "You are an expert React developer specializing in TypeScript and hooks"
```

### 2. **Define Clear Behavior**
```
❌ "Write good code"
✅ "Provide production-ready code with error handling, type safety, and comprehensive comments"
```

### 3. **Set Appropriate Temperature**
```
Code Generation: 0.3-0.5 (focused)
Code Review: 0.5-0.7 (balanced)
Documentation: 0.6-0.8 (creative)
Brainstorming: 0.7-1.0 (very creative)
```

### 4. **Include Examples**
```
RESPONSE FORMAT:
- Start with a brief explanation
- Provide complete, runnable code
- Include usage examples:

  Example:
  const MyComponent = () => {
    return <div>Hello</div>;
  };
```

### 5. **Specify Output Format**
```
RESPONSE FORMAT:
- Use markdown code blocks with language identifiers
- Include file names as comments
- Add inline comments for complex logic
- Provide before/after comparisons for refactoring
```

---

## Use Cases

### Use Case 1: Team-Specific Agent

**Scenario:** Your team uses specific coding standards

**Solution:**
```
Name: Team Code Generator
Languages: TypeScript
Frameworks: React, Next.js

Coding Style:
- Follow company style guide (link)
- Use custom hooks from @company/hooks
- Implement error boundaries
- Use company's design system
- Follow naming conventions: PascalCase for components
```

### Use Case 2: Learning Agent

**Scenario:** Teaching junior developers

**Solution:**
```
Name: Teaching Assistant
Expertise: Beginner
Focus: Learning

Response Format:
- Explain concepts before showing code
- Break down complex logic step-by-step
- Provide multiple examples
- Suggest learning resources
- Include common pitfalls to avoid
```

### Use Case 3: Migration Agent

**Scenario:** Migrating from JavaScript to TypeScript

**Solution:**
```
Name: JS to TS Migrator
Purpose: Refactoring

Guidelines:
- Convert JavaScript to TypeScript
- Add proper type annotations
- Use interfaces for object shapes
- Implement generics where appropriate
- Maintain existing functionality
- Explain type decisions
```

---

## Troubleshooting

### Agent Not Responding as Expected

**Check:**
1. System prompt clarity
2. Temperature setting (too high = unpredictable)
3. Conflicting instructions
4. Token limit (increase if responses are cut off)

**Solution:**
- Simplify the system prompt
- Lower temperature to 0.3-0.5
- Remove contradictory guidelines
- Increase maxTokens to 8192

### Agent Too Verbose

**Solution:**
```
Add to system prompt:
- Be concise and direct
- Avoid unnecessary explanations
- Focus on code over commentary
- Only explain complex logic
```

### Agent Not Following Style Guide

**Solution:**
```
Add specific examples:

CODING STYLE:
✅ Good:
const MyComponent: React.FC<Props> = ({ title }) => {
  return <h1>{title}</h1>;
};

❌ Avoid:
function MyComponent(props) {
  return <h1>{props.title}</h1>;
}
```

---

## Tips & Tricks

### 1. **Layer Your Agents**
Create specialized agents for different tasks:
- One for generation
- One for review
- One for testing

### 2. **Use Context Wisely**
Agents automatically receive:
- Current file
- Selected code
- Active errors
- Cursor position

### 3. **Iterate and Refine**
- Start with a template
- Test with real code
- Refine based on results
- Save multiple versions

### 4. **Share with Team**
- Export successful agents
- Create a team library
- Document agent purposes
- Version control agent configs

### 5. **Combine with Chat**
- Use agents in chat panel
- Switch between agents
- Compare different approaches

---

## API Reference

### AgentConfig Interface

```typescript
interface AgentConfig {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Brief description
  systemPrompt: string;          // Main prompt
  capabilities: string[];        // Agent capabilities
  temperature: number;           // 0-1, creativity level
  maxTokens: number;            // Response length limit
  model: string;                // Claude model to use
  purpose?: string;             // Primary purpose
  expertiseLevel?: string;      // Beginner/Intermediate/Expert
  languages?: string[];         // Programming languages
  frameworks?: string[];        // Frameworks and libraries
  codingStyle?: string;         // Style preferences
  responseFormat?: string;      // Output format
  focusArea?: string;          // Speed/Quality/Learning
}
```

### Capabilities

Available capabilities:
- `code-generation` - Generate new code
- `code-review` - Review and analyze code
- `debugging` - Find and fix bugs
- `testing` - Generate tests
- `documentation` - Create documentation
- `refactoring` - Improve code structure
- `security` - Security analysis
- `performance` - Performance optimization

---

## Future Enhancements

Planned features:
- [ ] Agent marketplace
- [ ] Collaborative agent editing
- [ ] Agent analytics and metrics
- [ ] Multi-agent workflows
- [ ] Agent versioning
- [ ] Custom capability definitions
- [ ] Agent templates from community
- [ ] A/B testing for agents

---

## Resources

- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Claude Model Comparison](https://docs.anthropic.com/claude/docs/models-overview)
- [System Prompt Best Practices](https://docs.anthropic.com/claude/docs/system-prompts)

---

## Support

Need help?
- Check the [troubleshooting section](#troubleshooting)
- Review [example agents](#method-2-template-based-creation)
- Ask in GitHub Discussions
- Report issues on GitHub

---

**Happy Agent Building! 🤖✨**
