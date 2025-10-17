# Genie AI - CodeSprint Agent

AI-powered coding assistant with fast code generation capabilities.

## Features

### CodeSprint Agent
- **Generate Code**: Create complete functions from natural language
- **Auto-Complete**: Intelligent code completion
- **Optimize Code**: Improve performance and efficiency
- **Fix Errors**: Automatically fix syntax and logic errors
- **Algorithm Suggestions**: Get optimal algorithm recommendations

## Setup

1. Get your Anthropic API key from https://console.anthropic.com/
2. Open VS Code Settings (Ctrl+,)
3. Search for "Genie"
4. Enter your API key in `Genie: Api Key`

## Usage

### Generate Code
- Press `Ctrl+Shift+G` (or `Cmd+Shift+G` on Mac)
- Describe what you want to create
- CodeSprint generates the code

### Complete Code
- Start typing
- Press `Ctrl+Space` for inline completions
- CodeSprint suggests the next lines

### Optimize Code
- Select code you want to optimize
- Run command: `Genie: Optimize Code`
- Get performance-improved version

### Fix Errors
- Run command: `Genie: Fix Errors`
- CodeSprint analyzes and fixes all errors

## Commands

- `Genie: Generate Code` - Generate code from description
- `Genie: Complete Code` - Complete current code
- `Genie: Optimize Code` - Optimize selected code
- `Genie: Fix Errors` - Fix all errors in file

## Settings

- `genie.apiKey` - Your Anthropic API key
- `genie.model` - Claude model (default: claude-3-5-sonnet-20241022)
- `genie.maxTokens` - Maximum response tokens (default: 4096)
- `genie.temperature` - Creativity level (default: 0.7)

## Models

- **Claude 3.5 Sonnet** - Best balance (recommended)
- **Claude 3 Opus** - Most capable
- **Claude 3 Haiku** - Fastest

## License

MIT
