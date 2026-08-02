import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../../types/project';

export class CardNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Card', name: meta.name || 'Card' });
  }
}

export class AccordionNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Accordion', name: meta.name || 'Accordion' });
  }
}

export class ModalNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Modal', name: meta.name || 'Modal' });
  }
}

export class DrawerNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Drawer', name: meta.name || 'Drawer' });
  }
}

export class ToastNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Toast', name: meta.name || 'Toast' });
  }
}

export class BadgeNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Badge', name: meta.name || 'Badge' });
  }
}

export class ChipNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Chip', name: meta.name || 'Chip' });
  }
}

export class SpinnerNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Spinner', name: meta.name || 'Spinner' });
  }
}

export class ProgressNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Progress', name: meta.name || 'Progress' });
  }
}
