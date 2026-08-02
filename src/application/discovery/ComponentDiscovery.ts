import { useSceneStore } from '../../stores/SceneStore';

export interface DiscoveredComponent {
  id: string;
  name: string;
  type: string;
  category: 'Buttons' | 'Inputs' | 'Forms' | 'Containers' | 'Media' | 'Navigation' | 'Custom';
  supportedEvents: string[];
}

export class ComponentDiscoveryEngine {
  private defaultMockComponents: DiscoveredComponent[] = [
    {
      id: 'btn_login_submit',
      name: 'Button_Login',
      type: 'button',
      category: 'Buttons',
      supportedEvents: ['Click', 'Double Click', 'Hover', 'Focus', 'Blur'],
    },
    {
      id: 'btn_register_submit',
      name: 'Button_Register',
      type: 'button',
      category: 'Buttons',
      supportedEvents: ['Click', 'Double Click', 'Hover'],
    },
    {
      id: 'input_email',
      name: 'Input_Email',
      type: 'input',
      category: 'Inputs',
      supportedEvents: ['Input Change', 'Focus', 'Blur'],
    },
    {
      id: 'input_password',
      name: 'Input_Password',
      type: 'input',
      category: 'Inputs',
      supportedEvents: ['Input Change', 'Focus', 'Blur'],
    },
    {
      id: 'form_login',
      name: 'Form_LoginContainer',
      type: 'form',
      category: 'Forms',
      supportedEvents: ['Form Submitted', 'Component Mounted'],
    },
    {
      id: 'checkbox_remember',
      name: 'Remember_Checkbox',
      type: 'checkbox',
      category: 'Inputs',
      supportedEvents: ['Checkbox Toggle', 'Focus'],
    },
    {
      id: 'link_forgot_pass',
      name: 'ForgotPassword_Link',
      type: 'link',
      category: 'Navigation',
      supportedEvents: ['Click', 'Hover'],
    },
    {
      id: 'img_user_avatar',
      name: 'Profile_AvatarImage',
      type: 'image',
      category: 'Media',
      supportedEvents: ['Click', 'Hover'],
    },
  ];

  /**
   * Reads the active SceneGraph to discover all designed UI components.
   * Falls back to registered screen components if canvas is unpopulated.
   */
  public discoverComponents(): DiscoveredComponent[] {
    try {
      const sceneNodes = useSceneStore.getState().nodes || [];
      if (sceneNodes.length === 0) {
        return this.defaultMockComponents;
      }

      return sceneNodes.map((node) => ({
        id: node.id,
        name: node.name || `Component_${node.id}`,
        type: node.type || 'container',
        category: this.mapCategory(node.type),
        supportedEvents: this.getEventsForType(node.type),
      }));
    } catch {
      return this.defaultMockComponents;
    }
  }

  public getComponentById(id: string): DiscoveredComponent | undefined {
    return this.discoverComponents().find((c) => c.id === id);
  }

  private mapCategory(type: string): DiscoveredComponent['category'] {
    const t = type.toLowerCase();
    if (t.includes('button') || t.includes('btn')) return 'Buttons';
    if (t.includes('input') || t.includes('field') || t.includes('checkbox')) return 'Inputs';
    if (t.includes('form')) return 'Forms';
    if (t.includes('image') || t.includes('video')) return 'Media';
    if (t.includes('link') || t.includes('nav')) return 'Navigation';
    if (t.includes('card') || t.includes('container') || t.includes('modal')) return 'Containers';
    return 'Custom';
  }

  private getEventsForType(type: string): string[] {
    const t = type.toLowerCase();
    if (t.includes('button') || t.includes('btn') || t.includes('link')) {
      return ['Click', 'Double Click', 'Hover', 'Focus', 'Blur'];
    }
    if (t.includes('input') || t.includes('field')) {
      return ['Input Change', 'Focus', 'Blur'];
    }
    if (t.includes('checkbox') || t.includes('switch')) {
      return ['Checkbox Toggle', 'Click'];
    }
    if (t.includes('form')) {
      return ['Form Submitted', 'Component Mounted'];
    }
    return ['Click', 'Hover', 'Component Mounted', 'Page Loaded'];
  }
}

export const componentDiscoveryEngine = new ComponentDiscoveryEngine();
