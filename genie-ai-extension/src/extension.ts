import * as vscode from 'vscode';
import { CodeSprintAgent } from './agents/codeSprint';
import { AnthropicClient } from './anthropicClient';
import { ChatPanel } from './chatPanel';
import { AgentBuilderPanel } from './agentBuilder';

let codeSprintAgent: CodeSprintAgent;
let anthropicClient: AnthropicClient;

export function activate(context: vscode.ExtensionContext) {
    console.log('Genie AI extension activated');

    // Initialize Anthropic client
    const config = vscode.workspace.getConfiguration('genie');
    const apiKey = config.get<string>('apiKey');

    if (!apiKey) {
        vscode.window.showWarningMessage('Genie AI: Please set your Anthropic API key in settings');
    }

    anthropicClient = new AnthropicClient(apiKey || '');
    codeSprintAgent = new CodeSprintAgent(anthropicClient);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('genie.openChat', () => {
            ChatPanel.createOrShow(context.extensionUri, anthropicClient);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('genie.openAgentBuilder', () => {
            AgentBuilderPanel.createOrShow(context.extensionUri);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('genie.generateCode', async () => {
            await generateCode();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('genie.completeCode', async () => {
            await completeCode();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('genie.optimizeCode', async () => {
            await optimizeCode();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('genie.fixErrors', async () => {
            await fixErrors();
        })
    );

    // Register inline completion provider
    context.subscriptions.push(
        vscode.languages.registerInlineCompletionItemProvider(
            { pattern: '**' },
            {
                provideInlineCompletionItems: async (document, position, context, token) => {
                    return await provideInlineCompletions(document, position);
                }
            }
        )
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(sparkle) Genie AI";
    statusBarItem.tooltip = "Open Genie AI Chat";
    statusBarItem.command = "genie.openChat";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

async function generateCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    const prompt = await vscode.window.showInputBox({
        prompt: 'Describe the code you want to generate',
        placeHolder: 'e.g., Create a function to sort an array of objects by date'
    });

    if (!prompt) return;

    const language = editor.document.languageId;

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Genie AI generating code...",
        cancellable: false
    }, async () => {
        try {
            const code = await codeSprintAgent.generateCode(prompt, language);
            const position = editor.selection.active;
            await editor.edit(editBuilder => {
                editBuilder.insert(position, code);
            });
            vscode.window.showInformationMessage('Code generated successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function completeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const document = editor.document;
    const position = editor.selection.active;
    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    const language = document.languageId;

    try {
        const completion = await codeSprintAgent.completeCode(textBeforeCursor, language);
        await editor.edit(editBuilder => {
            editBuilder.insert(position, completion);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error}`);
    }
}

async function optimizeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
        vscode.window.showWarningMessage('Please select code to optimize');
        return;
    }

    const language = editor.document.languageId;

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Optimizing code...",
        cancellable: false
    }, async () => {
        try {
            const optimized = await codeSprintAgent.optimizeCode(selectedText, language);
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, optimized);
            });
            vscode.window.showInformationMessage('Code optimized!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function fixErrors() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
    if (diagnostics.length === 0) {
        vscode.window.showInformationMessage('No errors found!');
        return;
    }

    const code = editor.document.getText();
    const language = editor.document.languageId;
    const errors = diagnostics.map(d => d.message).join('\n');

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "Fixing errors...",
        cancellable: false
    }, async () => {
        try {
            const fixed = await codeSprintAgent.fixErrors(code, errors, language);
            await editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    editor.document.positionAt(0),
                    editor.document.positionAt(code.length)
                );
                editBuilder.replace(fullRange, fixed);
            });
            vscode.window.showInformationMessage('Errors fixed!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });
}

async function provideInlineCompletions(document: vscode.TextDocument, position: vscode.Position) {
    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    const language = document.languageId;

    try {
        const completion = await codeSprintAgent.getInlineCompletion(textBeforeCursor, language);
        if (completion) {
            return [new vscode.InlineCompletionItem(completion)];
        }
    } catch (error) {
        console.error('Inline completion error:', error);
    }
    return [];
}

export function deactivate() {}
