import { DesignerNode } from './DesignerNode';
import type { ComponentNodeMeta } from '../../../types/project';

export class FrameNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Frame',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#1e2030', stroke: '#363c4e', strokeWidth: 1, cornerRadius: 0 },
      events: [],
      variables: {},
      bindings: [],
      animations: [],
      visibility: true,
      responsive: {},
      ...meta,
    });
    this.nodeStyle.fill = '#1e2030';
    this.nodeStyle.stroke = '#363c4e';
    this.nodeStyle.strokeWidth = 1;
  }
}

export class ShapeNode extends DesignerNode {
  public shapeType: 'rectangle' | 'ellipse' | 'polygon';

  constructor(
    meta: Partial<ComponentNodeMeta> & { id: string; name: string },
    shapeType: 'rectangle' | 'ellipse' | 'polygon' = 'rectangle'
  ) {
    super({
      type: 'Shape',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 120 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, cornerRadius: 4 },
      events: [],
      variables: {},
      bindings: [],
      animations: [],
      visibility: true,
      responsive: {},
      ...meta,
    });
    this.shapeType = shapeType;
    this.nodeStyle.fill = '#6366f1';
    this.nodeStyle.cornerRadius = 4;
  }
}

export class TextNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Text',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 40 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: 'transparent', stroke: 'transparent', strokeWidth: 0, cornerRadius: 0, textContent: 'Text' },
      events: [],
      variables: {},
      bindings: [],
      animations: [],
      visibility: true,
      responsive: {},
      ...meta,
    });
    this.nodeStyle.fill = 'transparent';
    this.textContent = 'Text';
  }
}

export class ImageNode extends DesignerNode {
  public src: string;

  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }, src = '') {
    super({
      type: 'Image',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 150 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#232733', stroke: '#363c4e', strokeWidth: 1, cornerRadius: 4 },
      events: [],
      variables: {},
      bindings: [],
      animations: [],
      visibility: true,
      responsive: {},
      ...meta,
    });
    this.src = src;
    this.nodeStyle.fill = '#232733';
    this.nodeStyle.stroke = '#363c4e';
    this.nodeStyle.strokeWidth = 1;
  }
}

export class ComponentNode extends DesignerNode {
  public componentId: string;

  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }, componentId = '') {
    super({
      type: 'Component',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 48 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#312e81', stroke: '#6366f1', strokeWidth: 1, cornerRadius: 6 },
      events: [],
      variables: {},
      bindings: [],
      animations: [],
      visibility: true,
      responsive: {},
      ...meta,
    });
    this.componentId = componentId;
    this.nodeStyle.fill = '#312e81';
    this.nodeStyle.stroke = '#6366f1';
    this.nodeStyle.strokeWidth = 1;
    this.nodeStyle.cornerRadius = 6;
  }
}

export class LineNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Line',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 0 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: 'transparent', stroke: '#a5b4fc', strokeWidth: 2, cornerRadius: 0 },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
  }
}

export class ArrowNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Arrow',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 200, height: 0 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#a5b4fc', stroke: '#a5b4fc', strokeWidth: 2, cornerRadius: 0 },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
  }
}

export class ButtonNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Button',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 120, height: 40 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#4f46e5', stroke: 'transparent', strokeWidth: 0, cornerRadius: 6, textContent: 'Button' },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
    this.textContent = 'Button';
  }
}

export class InputNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Input',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 240, height: 40 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#1e1e2e', stroke: '#313244', strokeWidth: 1, cornerRadius: 6, textContent: 'Type here...' },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
    this.textContent = 'Type here...';
  }
}

export class ContainerNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Container',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: 'transparent', stroke: '#4b5563', strokeWidth: 1, cornerRadius: 0 },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
    // Setting stroke to dashed is handled in render layer
  }
}

export class StackNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Stack',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 400, height: 100 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: 'rgba(99, 102, 241, 0.05)', stroke: '#4f46e5', strokeWidth: 1, cornerRadius: 8 },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
  }
}

export class IconNode extends DesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id: string; name: string }) {
    super({
      type: 'Icon',
      parent: null,
      children: [],
      position: { x: 0, y: 0 },
      size: { width: 48, height: 48 },
      rotation: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      style: { fill: '#cdd6f4', stroke: 'transparent', strokeWidth: 0, cornerRadius: 0 },
      events: [], variables: {}, bindings: [], animations: [], visibility: true, responsive: {},
      ...meta,
    });
  }
}
