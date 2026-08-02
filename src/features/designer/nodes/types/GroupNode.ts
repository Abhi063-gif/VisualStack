import { BaseDesignerNode } from '../base/BaseDesignerNode';
import type { ComponentMetadata } from '../../components/metadata/ComponentMetadata';

import type { ComponentNodeMeta } from '../../../../types/project';

export class GroupNode extends BaseDesignerNode {
  constructor(meta: Partial<ComponentNodeMeta> = {}) {
    super({ ...meta, type: 'Group' });
    // Transparent group styling by default
    this.nodeStyle = {
      ...this.nodeStyle,
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
      ...meta.style,
    };
  }

  static get metadata(): ComponentMetadata {
    return {
      id: 'Group',
      displayName: 'Group',
      description: 'A transparent container for grouping nodes',
      icon: 'folder',
      category: 'layout',
      keywords: ['group', 'layout', 'container'],
      defaultWidth: 100,
      defaultHeight: 100,
      minimumWidth: 1,
      minimumHeight: 1,
      supportsChildren: true,
      supportsText: false,
      supportsImage: false,
      supportsLayout: true,
      supportsRotation: true,
      supportsEffects: true,
    };
  }


}
