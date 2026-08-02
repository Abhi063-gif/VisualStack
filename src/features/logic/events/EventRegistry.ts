export type AppEventName =
  | 'page_loaded'
  | 'button_click'
  | 'input_changed'
  | 'form_submitted'
  | 'hover'
  | 'double_click'
  | 'scroll'
  | 'timer'
  | 'app_started'
  | 'screen_open';

export interface AppEventDefinition {
  name: AppEventName;
  label: string;
  description: string;
  icon: string;
  color: string;
  outputs: { id: string; name: string; dataType: string }[];
}

const EVENT_DEFINITIONS: AppEventDefinition[] = [
  {
    name: 'app_started',
    label: 'App Started',
    description: 'Fires once when the application initialises.',
    icon: 'zap',
    color: '#f59e0b',
    outputs: [],
  },
  {
    name: 'page_loaded',
    label: 'Page Loaded',
    description: 'Fires when a page/screen finishes loading.',
    icon: 'layout',
    color: '#6366f1',
    outputs: [],
  },
  {
    name: 'button_click',
    label: 'Button Clicked',
    description: 'Fires when a button is clicked.',
    icon: 'mouse-pointer',
    color: '#3b82f6',
    outputs: [{ id: 'target', name: 'Target Element', dataType: 'string' }],
  },
  {
    name: 'input_changed',
    label: 'Input Changed',
    description: 'Fires when an input element value changes.',
    icon: 'edit-3',
    color: '#10b981',
    outputs: [{ id: 'value', name: 'Value', dataType: 'string' }],
  },
  {
    name: 'form_submitted',
    label: 'Form Submitted',
    description: 'Fires when a form is submitted.',
    icon: 'send',
    color: '#8b5cf6',
    outputs: [{ id: 'data', name: 'Form Data', dataType: 'object' }],
  },
  {
    name: 'hover',
    label: 'Hover',
    description: 'Fires when the cursor hovers over an element.',
    icon: 'move',
    color: '#ec4899',
    outputs: [{ id: 'target', name: 'Target Element', dataType: 'string' }],
  },
  {
    name: 'double_click',
    label: 'Double Click',
    description: 'Fires on double-click.',
    icon: 'mouse-pointer-2',
    color: '#f97316',
    outputs: [{ id: 'target', name: 'Target Element', dataType: 'string' }],
  },
  {
    name: 'scroll',
    label: 'Scroll',
    description: 'Fires on page or element scroll.',
    icon: 'scroll',
    color: '#14b8a6',
    outputs: [
      { id: 'scrollX', name: 'Scroll X', dataType: 'number' },
      { id: 'scrollY', name: 'Scroll Y', dataType: 'number' },
    ],
  },
  {
    name: 'timer',
    label: 'Timer',
    description: 'Fires after a configurable delay.',
    icon: 'clock',
    color: '#a855f7',
    outputs: [{ id: 'elapsed', name: 'Elapsed (ms)', dataType: 'number' }],
  },
  {
    name: 'screen_open',
    label: 'Screen Opened',
    description: 'Fires when a screen/modal is opened.',
    icon: 'monitor',
    color: '#0ea5e9',
    outputs: [{ id: 'screenId', name: 'Screen ID', dataType: 'string' }],
  },
];

export class EventRegistry {
  private events: Map<AppEventName, AppEventDefinition> = new Map();

  constructor() {
    for (const def of EVENT_DEFINITIONS) {
      this.events.set(def.name, def);
    }
  }

  public getAll(): AppEventDefinition[] {
    return Array.from(this.events.values());
  }

  public get(name: AppEventName): AppEventDefinition | undefined {
    return this.events.get(name);
  }

  public register(def: AppEventDefinition): void {
    this.events.set(def.name, def);
  }
}

export const eventRegistry = new EventRegistry();
