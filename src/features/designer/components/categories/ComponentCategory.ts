export interface ComponentCategory {
  id: string;
  title: string;
  icon: string;
  priority: number;
  isCollapsed: boolean;
  searchKeywords: string[];
}

export const COMPONENT_CATEGORIES: Record<string, ComponentCategory> = {
  layout: {
    id: 'layout',
    title: 'Layout',
    icon: 'layout',
    priority: 10,
    isCollapsed: false,
    searchKeywords: ['container', 'section', 'frame', 'grid', 'flex', 'stack'],
  },
  basic: {
    id: 'basic',
    title: 'Basic',
    icon: 'square',
    priority: 20,
    isCollapsed: false,
    searchKeywords: ['rectangle', 'circle', 'ellipse', 'line', 'arrow'],
  },
  typography: {
    id: 'typography',
    title: 'Typography',
    icon: 'type',
    priority: 30,
    isCollapsed: false,
    searchKeywords: ['text', 'heading', 'paragraph', 'font'],
  },
  input: {
    id: 'input',
    title: 'Input',
    icon: 'mouse-pointer-2',
    priority: 40,
    isCollapsed: false,
    searchKeywords: ['button', 'input', 'textarea', 'checkbox', 'radio', 'switch', 'toggle'],
  },
  navigation: {
    id: 'navigation',
    title: 'Navigation',
    icon: 'navigation',
    priority: 50,
    isCollapsed: false,
    searchKeywords: ['navbar', 'sidebar', 'tabs'],
  },
  cards: {
    id: 'cards',
    title: 'Cards',
    icon: 'panel-top',
    priority: 60,
    isCollapsed: false,
    searchKeywords: ['card'],
  },
  media: {
    id: 'media',
    title: 'Media',
    icon: 'image',
    priority: 70,
    isCollapsed: false,
    searchKeywords: ['image', 'video', 'avatar', 'icon'],
  },
  advanced: {
    id: 'advanced',
    title: 'Advanced',
    icon: 'layers',
    priority: 80,
    isCollapsed: false,
    searchKeywords: ['accordion', 'modal', 'drawer', 'toast', 'badge', 'chip', 'spinner', 'progress'],
  }
};
