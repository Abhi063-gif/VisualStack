import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentNodeMeta } from '../../../../types/project';

export class ContainerNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Container', name: meta.name || 'Container' });
  }
}

export class SectionNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Section', name: meta.name || 'Section' });
  }
}

export class FrameNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Frame', name: meta.name || 'Frame' });
  }
}

export class NavbarNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Navbar', name: meta.name || 'Navbar' });
  }
}

export class SidebarNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Sidebar', name: meta.name || 'Sidebar' });
  }
}

export class TabsNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Tabs', name: meta.name || 'Tabs' });
  }
}

export class GridNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Grid', name: meta.name || 'Grid' });
  }
}

export class FlexRowNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'FlexRow', name: meta.name || 'Flex Row' });
  }
}

export class FlexColumnNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'FlexColumn', name: meta.name || 'Flex Column' });
  }
}

export class StackNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> & { id?: string }) {
    super({ ...meta, type: 'Stack', name: meta.name || 'Stack' });
  }
}
