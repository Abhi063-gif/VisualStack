import type { ComponentMetadata } from '../metadata/ComponentMetadata';
import { DefaultStyleFactory } from '../defaults/DefaultStyleFactory';
import type { NodeStyle } from '../../nodes/base/BaseDesignerNode';

export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentMetadata> = new Map();

  private constructor() {}

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  public registerComponent(metadata: ComponentMetadata): void {
    this.components.set(metadata.id, metadata);
  }

  public removeComponent(id: string): void {
    this.components.delete(id);
  }

  public getComponent(id: string): ComponentMetadata | undefined {
    return this.components.get(id);
  }

  public getAllComponents(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  public getByCategory(categoryId: string): ComponentMetadata[] {
    return this.getAllComponents().filter(c => c.category === categoryId);
  }

  public getMetadata(id: string): ComponentMetadata | undefined {
    return this.getComponent(id);
  }

  public getDefaultStyle(type: string): Partial<NodeStyle> {
    return DefaultStyleFactory.getStyle(type);
  }

  public search(query: string): ComponentMetadata[] {
    const q = query.toLowerCase();
    return this.getAllComponents().filter(c => 
      c.displayName.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.keywords.some(k => k.toLowerCase().includes(q))
    );
  }
}

export const componentRegistry = ComponentRegistry.getInstance();
