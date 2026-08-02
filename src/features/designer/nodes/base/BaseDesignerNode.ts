
import type { ComponentNodeMeta } from '../../../../types/project';

/** First-class visual style fields on every designer node */
export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  blendMode: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  textAlign: string;
  margin: number;
  padding: number;
}

export interface LayoutConfig {
  enabled: boolean;
  direction: 'row' | 'column';
  gap: number;
  padding: { top: number; right: number; bottom: number; left: number };
  justify: 'start' | 'center' | 'end' | 'space-between';
  align: 'start' | 'center' | 'end' | 'stretch';
  widthMode: 'fixed' | 'hug' | 'fill';
  heightMode: 'fixed' | 'hug' | 'fill';
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  enabled: false,
  direction: 'row',
  gap: 10,
  padding: { top: 10, right: 10, bottom: 10, left: 10 },
  justify: 'start',
  align: 'start',
  widthMode: 'fixed',
  heightMode: 'fixed',
};

export const DEFAULT_STYLE: NodeStyle = {
  fill: '#ffffff',
  stroke: '#6366f1',
  strokeWidth: 0,
  cornerRadius: 0,
  opacity: 1,
  shadow: false,
  shadowColor: 'rgba(0,0,0,0.3)',
  shadowBlur: 8,
  shadowOffsetX: 0,
  shadowOffsetY: 2,
  blendMode: 'normal',
  fontFamily: 'Inter',
  fontSize: 14,
  fontWeight: 400,
  textAlign: 'left',
  margin: 0,
  padding: 0,
};

export abstract class BaseDesignerNode implements ComponentNodeMeta {
  public id: string;
  public uuid: string;
  public name: string;
  public displayName: string;
  public type: string;
  public category: string;
  public parent: string | null;
  public children: string[];
  public position: { x: number; y: number };
  public size: { width: number; height: number };
  public rotation: number;
  public opacity: number;
  public locked: boolean;
  public visibility: boolean;
  public constraints: {
    horizontal: 'left' | 'right' | 'center' | 'stretch';
    vertical: 'top' | 'bottom' | 'center' | 'stretch';
  };
  public style: Record<string, unknown>;
  public layout: Record<string, unknown>;
  public effects: Record<string, unknown>;
  public variables: Record<string, unknown>;
  public metadata: Record<string, unknown>;
  public events: Array<{ name: string; targetFlowId?: string }>;
  public bindings: Array<{ property: string; expression: string }>;
  public animations: Array<{ trigger: string; type: string; config: Record<string, unknown> }>;
  public responsive: {
    tablet?: Partial<ComponentNodeMeta>;
    mobile?: Partial<ComponentNodeMeta>;
  };

  public nodeStyle: NodeStyle;
  public layoutConfig: LayoutConfig;
  public textContent: string;

  constructor(meta: Partial<ComponentNodeMeta> & { id?: string; type: string; name?: string }) {
    this.id = meta.id || crypto.randomUUID();
    this.uuid = (meta as any).uuid || this.id;
    this.type = meta.type;
    this.name = meta.name || this.type;
    this.displayName = (meta as any).displayName || this.name;
    this.category = (meta as any).category || 'Basic';
    this.parent = meta.parent ?? null;
    this.children = meta.children ?? [];
    this.position = meta.position ?? { x: 0, y: 0 };
    this.size = meta.size ?? { width: 100, height: 100 };
    this.rotation = meta.rotation ?? 0;
    this.opacity = meta.opacity ?? 1;
    this.locked = (meta as any).locked ?? false;
    this.visibility = meta.visibility ?? true;
    this.constraints = meta.constraints ?? { horizontal: 'left', vertical: 'top' };
    this.style = meta.style ?? {};
    this.layout = (meta as any).layout ?? {};
    this.layoutConfig = {
      ...DEFAULT_LAYOUT_CONFIG,
      ...((meta as any).layoutConfig || {})
    };
    this.effects = (meta as any).effects ?? {};
    this.variables = meta.variables ?? {};
    this.metadata = (meta as any).metadata ?? {};
    this.events = meta.events ?? [];
    this.bindings = meta.bindings ?? [];
    this.animations = meta.animations ?? [];
    this.responsive = meta.responsive ?? {};

    const s = meta.style as Partial<NodeStyle> | undefined;
    this.nodeStyle = {
      ...DEFAULT_STYLE,
      ...(s ?? {}),
    };
    this.textContent = (meta.style as Record<string, unknown>)?.['textContent'] as string ?? '';
  }

  public clone(): this {
    const clonedMeta = this.serialize();
    clonedMeta.id = crypto.randomUUID();
    clonedMeta.uuid = clonedMeta.id;
    const cloned = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    cloned.id = clonedMeta.id;
    cloned.uuid = clonedMeta.uuid;
    return cloned;
  }

  public serialize(): Record<string, any> {
    return {
      id: this.id,
      uuid: this.uuid,
      name: this.name,
      displayName: this.displayName,
      type: this.type,
      category: this.category,
      parent: this.parent,
      children: [...this.children],
      position: { ...this.position },
      size: { ...this.size },
      rotation: this.rotation,
      opacity: this.opacity,
      locked: this.locked,
      visibility: this.visibility,
      constraints: { ...this.constraints },
      style: { ...this.style, ...this.nodeStyle, textContent: this.textContent },
      layout: { ...this.layout },
      effects: { ...this.effects },
      variables: { ...this.variables },
      metadata: { ...this.metadata },
      events: [...this.events],
      bindings: [...this.bindings],
      animations: [...this.animations],
      responsive: JSON.parse(JSON.stringify(this.responsive)),
    };
  }

  public deserialize(data: Record<string, any>): void {
    Object.assign(this, data);
  }

  public getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.size.width,
      height: this.size.height,
    };
  }

  public containsPoint(x: number, y: number, worldX?: number, worldY?: number): boolean {
    const nodeX = worldX !== undefined ? worldX : this.position.x;
    const nodeY = worldY !== undefined ? worldY : this.position.y;
    
    const cx = nodeX + this.size.width / 2;
    const cy = nodeY + this.size.height / 2;
    
    const angle = -(this.rotation || 0) * (Math.PI / 180);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    const dx = x - cx;
    const dy = y - cy;
    
    const rx = dx * cos - dy * sin + cx;
    const ry = dx * sin + dy * cos + cy;

    return (
      rx >= nodeX &&
      rx <= nodeX + this.size.width &&
      ry >= nodeY &&
      ry <= nodeY + this.size.height
    );
  }

  public setPosition(x: number, y: number): void {
    this.position = { x, y };
  }

  public setSize(width: number, height: number): void {
    this.size = { width, height };
  }

  public setRotation(rotation: number): void {
    this.rotation = rotation;
  }

  public setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  public setVisibility(visibility: boolean): void {
    this.visibility = visibility;
  }

  public setLocked(locked: boolean): void {
    this.locked = locked;
  }

  public addChild(childId: string): void {
    if (!this.children.includes(childId)) {
      this.children.push(childId);
    }
  }

  public removeChild(childId: string): void {
    this.children = this.children.filter(id => id !== childId);
  }

  public updateStyle(style: Partial<NodeStyle>): void {
    this.nodeStyle = { ...this.nodeStyle, ...style };
  }

  public updateLayout(layout: Record<string, unknown>): void {
    this.layout = { ...this.layout, ...layout };
  }
}
