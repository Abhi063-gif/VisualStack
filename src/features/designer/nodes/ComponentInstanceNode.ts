import { BaseDesignerNode } from '../nodes/base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../types/project';

export class ComponentInstanceNode extends BaseDesignerNode {
  /** ID of the Main Component definition this instance links to */
  public componentId: string;

  /** Per-instance overrides (fill, textContent, opacity, etc.) */
  public overrides: Record<string, unknown>;

  /** Whether this instance has been detached from its component */
  public isDetached: boolean;

  constructor(
    meta: Partial<ComponentNodeMeta> & { id?: string; componentId: string; overrides?: Record<string, unknown> }
  ) {
    super({ ...meta, type: 'ComponentInstance' });
    this.componentId = meta.componentId;
    this.overrides = meta.overrides ?? {};
    this.isDetached = false;
  }

  /** Apply an override to this instance */
  public setOverride(key: string, value: unknown): void {
    this.overrides = { ...this.overrides, [key]: value };
  }

  /** Remove an override, reverting to the main component's value */
  public clearOverride(key: string): void {
    const next = { ...this.overrides };
    delete next[key];
    this.overrides = next;
  }

  /** Detach this instance (convert to standalone, clearing componentId link) */
  public detach(): void {
    this.isDetached = true;
    this.type = 'Frame'; // Convert to a plain Frame node
  }
}
