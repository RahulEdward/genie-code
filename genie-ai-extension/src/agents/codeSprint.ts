import { AnthropicClient } from '../anthropicClient';

export class CodeSprintAgent {
    private client: AnthropicClient;

    constructor(client: AnthropicClient) {
        this.client = client;
    }

    async generateCode(prompt: string, language: string): Promise<string> {
        return await this.client.generateCode(prompt, language);
    }

    async completeCode(codeContext: string, language: string): Promise<string> {
        return await this.client.completeCode(codeContext, language);
    }

    async optimizeCode(code: string, language: string): Promise<string> {
        return await this.client.optimizeCode(code, language);
    }

    async fixErrors(code: string, errors: string, language: string): Promise<string> {
        return await this.client.fixErrors(code, errors, language);
    }

    async getInlineCompletion(codeContext: string, language: string): Promise<string | null> {
        try {
            // Only provide completions for substantial context
            if (codeContext.length < 50) {
                return null;
            }

            const completion = await this.client.completeCode(codeContext, language);
            return completion;
        } catch (error) {
            console.error('Inline completion error:', error);
            return null;
        }
    }
}
