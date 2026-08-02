import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../../types/project';

export class ImageNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Image', name: meta.name || 'Image' });
  }
}

export class VideoNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Video', name: meta.name || 'Video' });
  }
}

export class AvatarNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Avatar', name: meta.name || 'Avatar' });
  }
}

export class IconNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Icon', name: meta.name || 'Icon' });
  }
}
