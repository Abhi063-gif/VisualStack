import { BaseCommand } from '../../../core/commands/Command';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { TransformBox } from '../selection/TransformBox';
import type { DesignerNode } from '../models/DesignerNode';

export type AlignType = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
export type DistributeType = 'horizontal' | 'vertical';

export class AlignNodesCommand extends BaseCommand {
  private nodeIds: string[];
  private originalPositions: Record<string, { x: number; y: number }> = {};
  private newPositions: Record<string, { x: number; y: number }> = {};

  constructor(nodes: DesignerNode[], alignType: AlignType) {
    super(`Align ${alignType}`);
    this.nodeIds = nodes.map((n) => n.id);

    const bounds = TransformBox.calculateBounds(nodes);
    if (!bounds) throw new Error('Cannot align empty selection');

    for (const node of nodes) {
      this.originalPositions[node.id] = { ...node.position };

      const sceneNode = sceneGraph.getNode(node.id);
      if (!sceneNode) continue;

      const worldPos = sceneNode.getWorldPosition();
      const parentPos = { x: worldPos.x - node.position.x, y: worldPos.y - node.position.y };

      let newWorldX = worldPos.x;
      let newWorldY = worldPos.y;

      switch (alignType) {
        case 'left':
          newWorldX = bounds.x;
          break;
        case 'center':
          newWorldX = bounds.x + bounds.width / 2 - node.size.width / 2;
          break;
        case 'right':
          newWorldX = bounds.x + bounds.width - node.size.width;
          break;
        case 'top':
          newWorldY = bounds.y;
          break;
        case 'middle':
          newWorldY = bounds.y + bounds.height / 2 - node.size.height / 2;
          break;
        case 'bottom':
          newWorldY = bounds.y + bounds.height - node.size.height;
          break;
      }

      this.newPositions[node.id] = {
        x: Math.round(newWorldX - parentPos.x),
        y: Math.round(newWorldY - parentPos.y),
      };
    }
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.newPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.originalPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }
}

export class DistributeNodesCommand extends BaseCommand {
  public nodeIds: string[];
  public originalPositions: Record<string, { x: number; y: number }> = {};
  public newPositions: Record<string, { x: number; y: number }> = {};

  constructor(nodes: DesignerNode[], distributeType: DistributeType, gap?: number) {
    super(`Distribute ${distributeType}`);

    if (nodes.length < 2) throw new Error('Need at least 2 nodes to distribute');

    const nodesWithWorld = nodes.map((n) => {
      const sn = sceneGraph.getNode(n.id);
      return {
        node: n,
        worldPos: sn ? sn.getWorldPosition() : { x: n.position.x, y: n.position.y },
      };
    });

    nodesWithWorld.sort((a, b) =>
      distributeType === 'horizontal' ? a.worldPos.x - b.worldPos.x : a.worldPos.y - b.worldPos.y
    );

    this.nodeIds = nodesWithWorld.map((n) => n.node.id);

    let stepGap = gap;
    if (stepGap === undefined) {
      if (distributeType === 'horizontal') {
        const minX = nodesWithWorld[0].worldPos.x;
        const last = nodesWithWorld[nodesWithWorld.length - 1];
        const maxX = last.worldPos.x + last.node.size.width;
        const totalSpan = maxX - minX;
        const totalWidths = nodesWithWorld.reduce((sum, item) => sum + item.node.size.width, 0);
        stepGap = (totalSpan - totalWidths) / (nodesWithWorld.length - 1);
        if (stepGap < 0 || isNaN(stepGap)) stepGap = 16;
      } else {
        const minY = nodesWithWorld[0].worldPos.y;
        const last = nodesWithWorld[nodesWithWorld.length - 1];
        const maxY = last.worldPos.y + last.node.size.height;
        const totalSpan = maxY - minY;
        const totalHeights = nodesWithWorld.reduce((sum, item) => sum + item.node.size.height, 0);
        stepGap = (totalSpan - totalHeights) / (nodesWithWorld.length - 1);
        if (stepGap < 0 || isNaN(stepGap)) stepGap = 16;
      }
    }

    let currentCoord = distributeType === 'horizontal' ? nodesWithWorld[0].worldPos.x : nodesWithWorld[0].worldPos.y;

    for (const item of nodesWithWorld) {
      const { node, worldPos } = item;
      this.originalPositions[node.id] = { ...node.position };

      const parentPos = { x: worldPos.x - node.position.x, y: worldPos.y - node.position.y };

      let newWorldX = worldPos.x;
      let newWorldY = worldPos.y;

      if (distributeType === 'horizontal') {
        newWorldX = Math.round(currentCoord);
        currentCoord += node.size.width + stepGap;
      } else {
        newWorldY = Math.round(currentCoord);
        currentCoord += node.size.height + stepGap;
      }

      this.newPositions[node.id] = {
        x: newWorldX - parentPos.x,
        y: newWorldY - parentPos.y,
      };
    }
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.newPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.originalPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }
}

export class TidyUpNodesCommand extends BaseCommand {
  private nodeIds: string[];
  private originalPositions: Record<string, { x: number; y: number }> = {};
  private newPositions: Record<string, { x: number; y: number }> = {};

  constructor(nodes: DesignerNode[]) {
    super('Tidy Up Selection');

    if (nodes.length < 2) throw new Error('Need at least 2 nodes to tidy up');

    const bounds = TransformBox.calculateBounds(nodes);
    if (!bounds) throw new Error('Cannot compute bounds for selection');

    this.nodeIds = nodes.map((n) => n.id);

    const nodesWithWorld = nodes.map((n) => {
      const sn = sceneGraph.getNode(n.id);
      return {
        node: n,
        worldPos: sn ? sn.getWorldPosition() : { x: n.position.x, y: n.position.y },
      };
    });

    for (const item of nodesWithWorld) {
      this.originalPositions[item.node.id] = { ...item.node.position };
    }

    const avgWidth = nodesWithWorld.reduce((sum, i) => sum + i.node.size.width, 0) / nodesWithWorld.length;
    const avgHeight = nodesWithWorld.reduce((sum, i) => sum + i.node.size.height, 0) / nodesWithWorld.length;

    const minY = Math.min(...nodesWithWorld.map((i) => i.worldPos.y));
    const maxY = Math.max(...nodesWithWorld.map((i) => i.worldPos.y + i.node.size.height));
    const minX = Math.min(...nodesWithWorld.map((i) => i.worldPos.x));
    const maxX = Math.max(...nodesWithWorld.map((i) => i.worldPos.x + i.node.size.width));

    const ySpread = maxY - minY;
    const xSpread = maxX - minX;

    // Detect if selection is 1D Horizontal or 1D Vertical
    const isHorizontalRow = ySpread <= avgHeight * 1.5 || (nodesWithWorld.length <= 3 && xSpread > ySpread * 2);
    const isVerticalColumn = xSpread <= avgWidth * 1.5 || (nodesWithWorld.length <= 3 && ySpread > xSpread * 2);

    if (isHorizontalRow) {
      // 1D Horizontal: Distribute horizontally AND align vertical centers!
      const dist = new DistributeNodesCommand(nodes, 'horizontal');
      const middleY = bounds.y + bounds.height / 2;

      for (const item of nodesWithWorld) {
        const distPos = dist.newPositions[item.node.id] || item.node.position;
        const parentPos = { x: item.worldPos.x - item.node.position.x, y: item.worldPos.y - item.node.position.y };
        const newWorldY = middleY - item.node.size.height / 2;

        this.newPositions[item.node.id] = {
          x: distPos.x,
          y: Math.round(newWorldY - parentPos.y),
        };
      }
      return;
    }

    if (isVerticalColumn) {
      // 1D Vertical: Distribute vertically AND align horizontal centers!
      const dist = new DistributeNodesCommand(nodes, 'vertical');
      const centerX = bounds.x + bounds.width / 2;

      for (const item of nodesWithWorld) {
        const distPos = dist.newPositions[item.node.id] || item.node.position;
        const parentPos = { x: item.worldPos.x - item.node.position.x, y: item.worldPos.y - item.node.position.y };
        const newWorldX = centerX - item.node.size.width / 2;

        this.newPositions[item.node.id] = {
          x: Math.round(newWorldX - parentPos.x),
          y: distPos.y,
        };
      }
      return;
    }

    // 2D Grid Tidy Up:
    // Determine optimal number of columns based on bounding box ratio
    const count = nodesWithWorld.length;
    const ratio = Math.max(0.2, Math.min(5, bounds.width / (bounds.height || 1)));
    const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt(count * ratio))));
    const rowsCount = Math.ceil(count / cols);

    // Sort items top-to-bottom, left-to-right
    const sortedNodes = [...nodesWithWorld].sort((a, b) => {
      const yDiff = a.worldPos.y - b.worldPos.y;
      if (Math.abs(yDiff) > avgHeight * 0.7) return yDiff;
      return a.worldPos.x - b.worldPos.x;
    });

    const gapX = 16;
    const gapY = 16;

    const maxColWidths: number[] = new Array(cols).fill(0);
    const maxRowHeights: number[] = new Array(rowsCount).fill(0);

    sortedNodes.forEach((item, index) => {
      const r = Math.floor(index / cols);
      const c = index % cols;
      maxColWidths[c] = Math.max(maxColWidths[c], item.node.size.width);
      maxRowHeights[r] = Math.max(maxRowHeights[r], item.node.size.height);
    });

    const colXPositions: number[] = new Array(cols).fill(0);
    let currX = bounds.x;
    for (let c = 0; c < cols; c++) {
      colXPositions[c] = currX;
      currX += maxColWidths[c] + gapX;
    }

    const rowYPositions: number[] = new Array(rowsCount).fill(0);
    let currY = bounds.y;
    for (let r = 0; r < rowsCount; r++) {
      rowYPositions[r] = currY;
      currY += maxRowHeights[r] + gapY;
    }

    sortedNodes.forEach((item, index) => {
      const r = Math.floor(index / cols);
      const c = index % cols;

      const parentPos = { x: item.worldPos.x - item.node.position.x, y: item.worldPos.y - item.node.position.y };

      const targetWorldX = colXPositions[c];
      const targetWorldY = rowYPositions[r];

      this.newPositions[item.node.id] = {
        x: Math.round(targetWorldX - parentPos.x),
        y: Math.round(targetWorldY - parentPos.y),
      };
    });
  }

  public execute(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.newPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }

  public undo(): void {
    const store = useSceneStore.getState();
    for (const id of this.nodeIds) {
      const pos = this.originalPositions[id];
      if (pos) store.updateNodeProperty(id, { position: pos });
    }
  }
}
