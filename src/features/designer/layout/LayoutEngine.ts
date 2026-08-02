import { sceneGraph } from '../scenegraph/SceneGraph';
import type { SceneNode } from '../scenegraph/SceneNode';
import { useSceneStore } from '../../../stores/SceneStore';
import { eventBus } from '../../../core/events/EventBus';
import { SystemEventType } from '../../../core/events/EventTypes';

export class LayoutEngine {
  private static instance: LayoutEngine;

  private constructor() {}

  public static getInstance(): LayoutEngine {
    if (!LayoutEngine.instance) {
      LayoutEngine.instance = new LayoutEngine();
    }
    return LayoutEngine.instance;
  }

  /** Find nodes spatially inside the parent container's bounds and reparent them */
  public adoptSpatialChildren(parentSceneNode: SceneNode): void {
    const parentNode = parentSceneNode.node;
    const parentWorldPos = parentSceneNode.getWorldPosition();
    const parentBounds = {
      x: parentWorldPos.x,
      y: parentWorldPos.y,
      width: parentNode.size.width,
      height: parentNode.size.height,
    };

    const allNodes = sceneGraph.getAllNodes();
    for (const sceneNode of allNodes) {
      const node = sceneNode.node;
      if (node.id === parentNode.id) continue;

      // Skip ancestors
      let isAncestor = false;
      let curr: SceneNode | null = parentSceneNode;
      while (curr) {
        if (curr.node.id === node.id) {
          isAncestor = true;
          break;
        }
        curr = curr.parent;
      }
      if (isAncestor) continue;

      // Check if node center is inside parentBounds
      const worldPos = sceneNode.getWorldPosition();
      const centerX = worldPos.x + node.size.width / 2;
      const centerY = worldPos.y + node.size.height / 2;

      const isInside = 
        centerX >= parentBounds.x &&
        centerX <= parentBounds.x + parentBounds.width &&
        centerY >= parentBounds.y &&
        centerY <= parentBounds.y + parentBounds.height;

      if (isInside && sceneNode.parent?.node.id !== parentNode.id) {
        sceneGraph.reorderNode(node.id, parentNode.id, 'inside');
        node.position = {
          x: Math.round(worldPos.x - parentBounds.x),
          y: Math.round(worldPos.y - parentBounds.y),
        };
        useSceneStore.getState().upsertNode(node);
        useSceneStore.getState().upsertNode(parentNode);
      }
    }
  }

  public updateLayout(parentNodeOrId: string | SceneNode): void {
    const parentSceneNode = typeof parentNodeOrId === 'string' 
      ? sceneGraph.getNode(parentNodeOrId) 
      : parentNodeOrId;

    if (!parentSceneNode) return;

    const parentNode = parentSceneNode.node;
    const config = parentNode.layoutConfig;

    if (!config || !config.enabled) return;

    // Auto-adopt any spatial children inside the container
    this.adoptSpatialChildren(parentSceneNode);

    const children = parentSceneNode.children.filter(c => c.node.visibility);
    if (children.length === 0) return;

    // Sort children by their current position (top-to-bottom or left-to-right) for logical layout ordering
    const isRow = config.direction === 'row';
    children.sort((a, b) => {
      return isRow 
        ? a.node.position.x - b.node.position.x 
        : a.node.position.y - b.node.position.y;
    });

    // 1. Process nested child layouts first so their sizes are updated
    for (const child of children) {
      if (child.node.layoutConfig?.enabled) {
        this.updateLayout(child);
      }
    }

    const pLeft = config.padding.left || 0;
    const pRight = config.padding.right || 0;
    const pTop = config.padding.top || 0;
    const pBottom = config.padding.bottom || 0;
    const gap = config.gap || 0;

    // 2. Compute Hug Size for Parent if configured
    if (config.widthMode === 'hug' || config.heightMode === 'hug') {
      let contentW = 0;
      let contentH = 0;

      if (isRow) {
        contentW = children.reduce((sum, c) => sum + c.node.size.width, 0) + gap * Math.max(0, children.length - 1);
        contentH = Math.max(0, ...children.map(c => c.node.size.height));
      } else {
        contentW = Math.max(0, ...children.map(c => c.node.size.width));
        contentH = children.reduce((sum, c) => sum + c.node.size.height, 0) + gap * Math.max(0, children.length - 1);
      }

      if (config.widthMode === 'hug') {
        parentNode.size.width = Math.max(20, contentW + pLeft + pRight);
      }
      if (config.heightMode === 'hug') {
        parentNode.size.height = Math.max(20, contentH + pTop + pBottom);
      }

      useSceneStore.getState().upsertNode(parentNode);
    }

    const availWidth = parentNode.size.width - pLeft - pRight;
    const availHeight = parentNode.size.height - pTop - pBottom;

    // 3. Resolve Fill Sizing for children along main axis
    if (isRow) {
      const fillChildren = children.filter(c => c.node.layoutConfig?.widthMode === 'fill');
      if (fillChildren.length > 0) {
        const nonFillWidth = children
          .filter(c => c.node.layoutConfig?.widthMode !== 'fill')
          .reduce((sum, c) => sum + c.node.size.width, 0);
        const remainingW = Math.max(0, availWidth - nonFillWidth - gap * (children.length - 1));
        const fillW = remainingW / fillChildren.length;
        fillChildren.forEach(c => {
          c.node.size.width = Math.max(10, fillW);
        });
      }
    } else {
      const fillChildren = children.filter(c => c.node.layoutConfig?.heightMode === 'fill');
      if (fillChildren.length > 0) {
        const nonFillHeight = children
          .filter(c => c.node.layoutConfig?.heightMode !== 'fill')
          .reduce((sum, c) => sum + c.node.size.height, 0);
        const remainingH = Math.max(0, availHeight - nonFillHeight - gap * (children.length - 1));
        const fillH = remainingH / fillChildren.length;
        fillChildren.forEach(c => {
          c.node.size.height = Math.max(10, fillH);
        });
      }
    }

    // 4. Resolve Stretch for children along cross axis
    if (isRow) {
      children.forEach(c => {
        if (config.align === 'stretch' || c.node.layoutConfig?.heightMode === 'fill') {
          c.node.size.height = Math.max(10, availHeight);
        }
      });
    } else {
      children.forEach(c => {
        if (config.align === 'stretch' || c.node.layoutConfig?.widthMode === 'fill') {
          c.node.size.width = Math.max(10, availWidth);
        }
      });
    }

    // 5. Calculate Main Axis offsets & spacing
    const totalMainSize = children.reduce((sum, c) => sum + (isRow ? c.node.size.width : c.node.size.height), 0);
    const totalGaps = gap * Math.max(0, children.length - 1);
    const mainContentSize = totalMainSize + totalGaps;

    let currentMainOffset = isRow ? pLeft : pTop;
    let actualGap = gap;

    if (config.justify === 'center') {
      const remaining = (isRow ? availWidth : availHeight) - mainContentSize;
      currentMainOffset += Math.max(0, remaining / 2);
    } else if (config.justify === 'end') {
      const remaining = (isRow ? availWidth : availHeight) - mainContentSize;
      currentMainOffset += Math.max(0, remaining);
    } else if (config.justify === 'space-between' && children.length > 1) {
      const mainTotalNoGap = totalMainSize;
      const remainingSpace = (isRow ? availWidth : availHeight) - mainTotalNoGap;
      actualGap = Math.max(0, remainingSpace / (children.length - 1));
    }

    // 6. Position children
    for (const child of children) {
      const childNode = child.node;
      const childW = childNode.size.width;
      const childH = childNode.size.height;

      let childX = 0;
      let childY = 0;

      if (isRow) {
        childX = currentMainOffset;

        // Cross axis (Y) alignment
        if (config.align === 'center') {
          childY = pTop + (availHeight - childH) / 2;
        } else if (config.align === 'end') {
          childY = pTop + availHeight - childH;
        } else {
          // start or stretch
          childY = pTop;
        }

        currentMainOffset += childW + actualGap;
      } else {
        childY = currentMainOffset;

        // Cross axis (X) alignment
        if (config.align === 'center') {
          childX = pLeft + (availWidth - childW) / 2;
        } else if (config.align === 'end') {
          childX = pLeft + availWidth - childW;
        } else {
          // start or stretch
          childX = pLeft;
        }

        currentMainOffset += childH + actualGap;
      }

      childNode.position = { x: Math.round(childX), y: Math.round(childY) };
      useSceneStore.getState().upsertNode(childNode);
    }

    eventBus.emit(SystemEventType.CANVAS_NODE_UPDATED, { nodeId: parentNode.id, changes: {} });
  }

  /** Calculate drop index when dragging an element over an Auto Layout container */
  public getDropIndex(parentSceneNode: SceneNode, localX: number, localY: number): number {
    const config = parentSceneNode.node.layoutConfig;
    if (!config || !config.enabled) return -1;

    const children = parentSceneNode.children.filter(c => c.node.visibility);
    const isRow = config.direction === 'row';

    for (let i = 0; i < children.length; i++) {
      const child = children[i].node;
      const childCenter = isRow 
        ? child.position.x + child.size.width / 2
        : child.position.y + child.size.height / 2;

      const cursorVal = isRow ? localX : localY;
      if (cursorVal < childCenter) {
        return i;
      }
    }

    return children.length;
  }
}

export const layoutEngine = LayoutEngine.getInstance();
