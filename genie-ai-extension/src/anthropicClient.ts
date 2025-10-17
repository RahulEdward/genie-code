import Anthropic from '@anthropic-ai/sdk';
import * as vscode from 'vscode';

export class AnthropicClient {
    private client: Anthropic;
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.client = new Anthropic({ apiKey });
    }

    async sendMessage(
        systemPrompt: string,
        messages: Array<{ role: string; content: string }>
    ): Promise<string> {
        const config = vscode.workspace.getConfiguration('genie');
        const model = config.get<string>('model') || 'claude-3-5-sonnet-20241022';
        const maxTokens = config.get<number>('maxTokens') || 4096;
        const temperature = config.get<number>('temperature') || 0.7;

        try {
            const response = await this.client.messages.create({
                model,
                max_tokens: maxTokens,
                temperature,
                system: systemPrompt,
                messages: messages.map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content
                }))
            });

            const content = response.content[0];
            if (content.type === 'text') {
                return content.text;
            }

            return 'No response generated';
        } catch (error: any) {
            throw new Error(`Anthropic API error: ${error.message}`);
        }
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        const systemPrompt = `You are an expert ${language} developer. Generate clean, efficient, well-documented code based on the user's request. Only return the code without explanations unless asked.`;

        const response = await this.sendMessage(systemPrompt, [
            { role: 'user', content: prompt }
        ]);

        return this.extractCode(response);
    }

    async completeCode(codeContext: string, language: string): Promise<string> {
        const systemPrompt = `You are a code completion assistant. Complete the code naturally based on the context. Return only the completion without repeating the context.`;

        const response = await this.sendMessage(systemPrompt, [
            {
                role: 'user',
                content: `Complete this ${language} code:\n\n${codeContext}`
            }
        ]);

        return this.extractCode(response);
    }

    async optimizeCode(code: string, language: string): Promise<string> {
        const systemPrompt = `You are a code optimization expert. Improve the provided code for performance, readability, and best practices. Return only the optimized code.`;

        const response = await this.sendMessage(systemPrompt, [
            {
                role: 'user',
                content: `Optimize this ${language} code:\n\n${code}`
            }
        ]);

        return this.extractCode(response);
    }

    async fixErrors(code: string, errors: string, language: string): Promise<string> {
        const systemPrompt = `You are a debugging expert. Fix the errors in the provided code. Return only the corrected code.`;

        const response = await this.sendMessage(systemPrompt, [
            {
                role: 'user',
                content: `Fix these errors in ${language} code:\n\nErrors:\n${errors}\n\nCode:\n${code}`
            }
        ]);

        return this.extractCode(response);
    }

    private extractCode(response: string): string {
        // Extract code from markdown code blocks if present
        const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
        const matches = [...response.matchAll(codeBlockRegex)];

        if (matches.length > 0) {
            return matches.map(match => match[1].trim()).join('\n\n');
        }

        return response.trim();
    }
}
