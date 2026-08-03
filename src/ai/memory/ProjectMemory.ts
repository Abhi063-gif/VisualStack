export interface MemoryPreferences {
  architecturePattern: 'SPA' | 'Next.js' | 'Microservices';
  namingConvention: 'pascalCase' | 'camelCase' | 'kebab-case';
  preferredDatabase: 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'SQLite' | 'Supabase';
  primaryThemeColor: string;
  designSystem: 'Tailwind' | 'Vanilla CSS' | 'Custom Tokens';
  framework: string;
}

export class ProjectMemory {
  private preferences: MemoryPreferences = {
    architecturePattern: 'SPA',
    namingConvention: 'pascalCase',
    preferredDatabase: 'PostgreSQL',
    primaryThemeColor: '#6366f1',
    designSystem: 'Vanilla CSS',
    framework: 'React (Vite)',
  };

  private memoryNotes: Array<{ key: string; note: string; timestamp: string }> = [];

  public getPreferences(): MemoryPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(updates: Partial<MemoryPreferences>): void {
    this.preferences = { ...this.preferences, ...updates };
  }

  public addMemoryNote(key: string, note: string): void {
    this.memoryNotes.unshift({
      key,
      note,
      timestamp: new Date().toISOString(),
    });
  }

  public getMemoryNotes(): Array<{ key: string; note: string; timestamp: string }> {
    return [...this.memoryNotes];
  }
}

export const projectMemory = new ProjectMemory();
