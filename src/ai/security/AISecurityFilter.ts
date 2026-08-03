export class AISecurityFilter {
  /** Replaces sensitive API keys, tokens, JWTs, and private keys with safe placeholders before transmitting to LLMs */
  public sanitizePrompt(input: string): string {
    let sanitized = input;

    // Mask Bearer tokens & Authorization headers
    sanitized = sanitized.replace(/(Authorization:\s*Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/gi, '$1[REDACTED_BEARER_TOKEN]');

    // Mask OpenAI / GitHub / Generic secret keys
    sanitized = sanitized.replace(/(sk-[A-Za-z0-9]{20,})/gi, '[REDACTED_OPENAI_KEY]');
    sanitized = sanitized.replace(/(ghp_[A-Za-z0-9]{20,})/gi, '[REDACTED_GITHUB_TOKEN]');
    sanitized = sanitized.replace(/(vs-verify=[A-Za-z0-9]{8,})/gi, '[REDACTED_DNS_TOKEN]');

    // Mask RSA Private Keys
    sanitized = sanitized.replace(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/gi, '[REDACTED_PRIVATE_KEY]');

    return sanitized;
  }
}

export const aiSecurityFilter = new AISecurityFilter();
