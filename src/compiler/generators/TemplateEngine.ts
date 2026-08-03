export class TemplateEngine {
  public render(template: string, variables: Record<string, unknown>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value ?? ''));
    }
    return result;
  }
}

export const templateEngine = new TemplateEngine();
