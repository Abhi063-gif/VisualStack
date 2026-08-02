import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../../types/project';

export class ButtonNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Button', name: meta.name || 'Button' });
  }
}

export class InputNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Input', name: meta.name || 'Input' });
  }
}

export class TextareaNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Textarea', name: meta.name || 'Textarea' });
  }
}

export class CheckboxNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Checkbox', name: meta.name || 'Checkbox' });
  }
}

export class RadioNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Radio', name: meta.name || 'Radio' });
  }
}

export class SwitchNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Switch', name: meta.name || 'Switch' });
  }
}

export class ToggleNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Toggle', name: meta.name || 'Toggle' });
  }
}
