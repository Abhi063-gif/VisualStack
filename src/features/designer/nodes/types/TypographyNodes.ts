import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../../types/project';

export class TextNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Text', name: meta.name || 'Text' });
  }
}

export class HeadingNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Heading', name: meta.name || 'Heading' });
  }
}

export class ParagraphNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Paragraph', name: meta.name || 'Paragraph' });
  }
}
