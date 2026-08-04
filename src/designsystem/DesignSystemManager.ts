export interface DesignTokens {
  colors: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSizeBase: number;
    headings: Record<string, number>;
  };
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  elevation: Record<string, string>;
}

export class DesignSystemManager {
  private tokens: DesignTokens = {
    colors: {
      primary: '#6366f1',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#0e0f12',
      surface: '#14161b',
      border: '#232733',
      textPrimary: '#ffffff',
      textSecondary: '#9ca3af',
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSizeBase: 14,
      headings: { h1: 32, h2: 24, h3: 18, h4: 15 },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    borderRadius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
    elevation: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    },
  };

  public getTokens(): DesignTokens {
    return { ...this.tokens };
  }

  public updateColorToken(key: string, colorHex: string): void {
    this.tokens.colors[key] = colorHex;
  }
}

export const designSystemManager = new DesignSystemManager();
