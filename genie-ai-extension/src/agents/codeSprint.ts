import { AnthropicClient } from '../anthropicClient';

export class CodeSprintAgent {
    private client: AnthropicClient;

    constructor(client: AnthropicClient) {
        this.client = client;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        const systemPrompt = this.buildCodeSprintPrompt(language);
        const response = await this.client.sendMessage(systemPrompt, [
            { role: 'user', content: prompt }
        ]);
        return this.extractCode(response);
    }

    async completeCode(codeContext: string, language: string): Promise<string> {
        const systemPrompt = `You are Genie Code Sprint Agent - Ultra-fast code completion specialist.

MISSION: Complete code accurately and efficiently

RULES:
1. Analyze the context and cursor position
2. Provide natural, idiomatic completion
3. Match existing code style
4. Complete only what's needed
5. No explanations, just code

Return ONLY the completion code, nothing else.`;

        const response = await this.client.sendMessage(systemPrompt, [
            { role: 'user', content: `Complete this ${language} code:\n\n${codeContext}` }
        ]);
        return this.extractCode(response);
    }

    async optimizeCode(code: string, language: string): Promise<string> {
        const systemPrompt = `You are Genie Code Sprint Agent - Performance optimization specialist.

MISSION: Optimize code for performance and readability

OPTIMIZATION FOCUS:
1. Time complexity improvements
2. Memory efficiency
3. Code readability
4. Best practices
5. Remove redundancy

RESPONSE FORMAT:
\`\`\`${language}
[OPTIMIZED CODE]
\`\`\`

**Improvements Made:**
- [List key optimizations]`;

        const response = await this.client.sendMessage(systemPrompt, [
            { role: 'user', content: `Optimize this ${language} code:\n\n${code}` }
        ]);
        return this.extractCode(response);
    }

    async fixErrors(code: string, errors: string, language: string): Promise<string> {
        const systemPrompt = `You are Genie Code Sprint Agent - Error fixing specialist.

MISSION: Fix errors quickly and accurately

FIX STRATEGY:
1. Identify root cause
2. Apply minimal fix
3. Maintain functionality
4. Preserve code style
5. Add error handling if needed

Return ONLY the fixed code, no explanations.`;

        const response = await this.client.sendMessage(systemPrompt, [
            { role: 'user', content: `Fix these errors in ${language} code:\n\nErrors:\n${errors}\n\nCode:\n${code}` }
        ]);
        return this.extractCode(response);
    }

    async getInlineCompletion(codeContext: string, language: string): Promise<string | null> {
        try {
            if (codeContext.length < 50) {
                return null;
            }

            const completion = await this.completeCode(codeContext, language);
            return completion;
        } catch (error) {
            console.error('Inline completion error:', error);
            return null;
        }
    }

    private buildCodeSprintPrompt(language: string): string {
        return `You are GENIE CODE SPRINT AGENT - Ultra-fast, accurate code generator

ROLE: Production-ready code generator
MISSION: Generate working code in seconds

GENERATION RULES:
1. SPEED: Provide immediate, working solutions
2. ACCURACY: Code must run without errors
3. BEST PRACTICES: Follow ${language} conventions
4. COMPLETENESS: Include necessary imports and dependencies
5. OPTIMIZATION: Write efficient, clean code

RESPONSE STRUCTURE:
\`\`\`${language}
// Brief comment explaining the approach
[COMPLETE WORKING CODE]
\`\`\`

**Explanation:**
[Concise technical explanation]

**Usage:**
[How to implement/run the code]

**Improvements:**
[Potential enhancements]

INPUT PROCESSING:
- Parse natural language requirements
- Identify specific functionalities required
- Consider performance requirements
- Determine complexity level needed

OUTPUT OPTIMIZATION:
- Minimize token usage while maintaining clarity
- Provide runnable code blocks
- Include error handling where appropriate
- Suggest relevant documentation links
- Offer debugging tips

LANGUAGE: ${language}
FOCUS: Production-ready, tested, optimized code`;
    }

    private extractCode(response: string): string {
        // Extract code from markdown code blocks
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
        const matches = [...response.matchAll(codeBlockRegex)];

        if (matches.length > 0) {
            return matches.map(match => match[1].trim()).join('\n\n');
        }

        return response.trim();
    }
}
