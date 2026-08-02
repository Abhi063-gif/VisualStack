export interface EditorTab {
  id: string;
  title: string;
  language: string;
  path: string;
  content: string;
  isDirty?: boolean;
}

export type BottomPanelTab = 'terminal' | 'console' | 'problems' | 'code' | 'ai';

export type ActivityBarItem = 'explorer' | 'designer' | 'backend' | 'plugins' | 'settings';
