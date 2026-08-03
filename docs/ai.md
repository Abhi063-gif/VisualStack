# AI System Documentation & Provider Matrix

## Supported Providers
- **OpenAI**: `gpt-4o`, `gpt-4o-mini`, `o1-preview`
- **Anthropic**: `claude-3-5-sonnet`, `claude-3-opus`
- **Google Gemini**: `gemini-1.5-pro`, `gemini-1.5-flash`
- **DeepSeek**: `deepseek-coder`, `deepseek-v3`
- **Groq**: `llama-3.3-70b`
- **Ollama / LM Studio**: Local LLMs (`qwen-2.5-coder`)
- **Azure OpenAI**: Enterprise endpoint
- **Custom OpenAI Compatible**: Custom base URL

## Security & Sanitization
All prompts pass through `AISecurityFilter.ts` to redact passwords, JWT tokens, API keys, and private SSH keys prior to API transmission.
