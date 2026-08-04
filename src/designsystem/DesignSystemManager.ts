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

export interface ThemePreset {
  id: string;
  name: string;
  colors: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dark_modern',
    name: 'VisualStack Dark (Default)',
    colors: {
      primary: '#6366f1',
      secondary: '#10b981',
      accent: '#f59e0b',
      background: '#0e0f12',
      surface: '#14161b',
      border: '#232733',
      textPrimary: '#ffffff',
      textSecondary: '#9ca3af',
      danger: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6',
      sidebarBg: '#0e0f12',
      headerBg: '#14161b',
      canvasGrid: '#1f232d',
      selectionRing: '#6366f1',
    },
  },
  {
    id: 'dracula',
    name: 'Dracula Pro',
    colors: {
      primary: '#bd93f9',
      secondary: '#50fa7b',
      accent: '#ff79c6',
      background: '#282a36',
      surface: '#44475a',
      border: '#6272a4',
      textPrimary: '#f8f8f2',
      textSecondary: '#6272a4',
      danger: '#ff5555',
      warning: '#ffb86c',
      success: '#50fa7b',
      info: '#8be9fd',
      sidebarBg: '#21222c',
      headerBg: '#282a36',
      canvasGrid: '#44475a',
      selectionRing: '#ff79c6',
    },
  },
  {
    id: 'tokyo_night',
    name: 'Tokyo Night',
    colors: {
      primary: '#7aa2f7',
      secondary: '#73daca',
      accent: '#bb9af7',
      background: '#1a1b26',
      surface: '#24283b',
      border: '#414868',
      textPrimary: '#c0caf5',
      textSecondary: '#565f89',
      danger: '#f7768e',
      warning: '#e0af68',
      success: '#9ece6a',
      info: '#7dcfff',
      sidebarBg: '#16161e',
      headerBg: '#1a1b26',
      canvasGrid: '#24283b',
      selectionRing: '#7aa2f7',
    },
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Mocha',
    colors: {
      primary: '#cba6f7',
      secondary: '#a6e3a1',
      accent: '#f5c2e7',
      background: '#1e1e2e',
      surface: '#313244',
      border: '#45475a',
      textPrimary: '#cdd6f4',
      textSecondary: '#a6adc8',
      danger: '#f38ba8',
      warning: '#fab387',
      success: '#a6e3a1',
      info: '#89dceb',
      sidebarBg: '#181825',
      headerBg: '#1e1e2e',
      canvasGrid: '#313244',
      selectionRing: '#cba6f7',
    },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    colors: {
      primary: '#00ffcc',
      secondary: '#ff0055',
      accent: '#ffe600',
      background: '#090a0f',
      surface: '#121520',
      border: '#1f2638',
      textPrimary: '#00ffcc',
      textSecondary: '#7080a0',
      danger: '#ff0055',
      warning: '#ffe600',
      success: '#00ffcc',
      info: '#00bfff',
      sidebarBg: '#06070a',
      headerBg: '#090a0f',
      canvasGrid: '#181e2e',
      selectionRing: '#ff0055',
    },
  },
];

export class DesignSystemManager {
  private tokens: DesignTokens = {
    colors: { ...THEME_PRESETS[0].colors },
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

  public applyPreset(presetId: string): void {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      this.tokens.colors = { ...preset.colors };
    }
  }

  public updateColorToken(key: string, colorHex: string): void {
    this.tokens.colors[key] = colorHex;
  }
}

export const designSystemManager = new DesignSystemManager();
