import type { DesignerNode } from '../models/DesignerNode';

import { sceneGraph } from '../scenegraph/SceneGraph';

export interface SnapLine {
  axis: 'x' | 'y';
  value: number; // The coordinate of the snap line
  distance: number; // Distance from the snapped edge/center to the line
}

export interface SnapResult {
  dx: number;
  dy: number;
  lines: SnapLine[];
}

export class SnappingEngine {
  private threshold = 5; // Pixels distance to snap
  public activeLines: SnapLine[] = [];

  public snap(
    movingNodes: DesignerNode[],
    allNodes: DesignerNode[],
    dx: number,
    dy: number,
    zoom: number
  ): SnapResult {
    if (movingNodes.length === 0) return { dx, dy, lines: [] };

    // Bounding box of moving nodes in WORLD space
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const node of movingNodes) {
      const sceneNode = sceneGraph.getNode(node.id);
      if (!sceneNode) continue;
      const worldPos = sceneNode.getWorldPosition();
      minX = Math.min(minX, worldPos.x);
      minY = Math.min(minY, worldPos.y);
      maxX = Math.max(maxX, worldPos.x + node.size.width);
      maxY = Math.max(maxY, worldPos.y + node.size.height);
    }

    // dx and dy are passed in local space, but we need them in world space for snapping.
    // However, if moving nodes share the SAME parent, their local dx/dy is the same as world dx/dy
    // assuming parents aren't scaled or rotated. Currently there's no scaling/rotation on parents,
    // so worldDelta = localDelta.
    const worldDx = dx;
    const worldDy = dy;

    const movingBounds = {
      left: minX + worldDx,
      right: maxX + worldDx,
      top: minY + worldDy,
      bottom: maxY + worldDy,
      centerX: minX + worldDx + (maxX - minX) / 2,
      centerY: minY + worldDy + (maxY - minY) / 2,
    };

    const movingIds = new Set(movingNodes.map(n => n.id));
    const targetNodes = allNodes.filter(n => !movingIds.has(n.id) && n.visibility);

    let bestDx = dx;
    let bestDy = dy;
    let minDiffX = Infinity;
    let minDiffY = Infinity;
    const lines: SnapLine[] = [];

    const thresholdWorld = this.threshold / zoom;

    // Helper to evaluate snap points on a single axis
    const checkSnap = (
      movingPoints: number[], 
      targetPoints: number[], 
      axis: 'x' | 'y', 
      currentD: number
    ): { bestD: number; diff: number; lineVal: number | null } => {
      let bestD = currentD;
      let minDiff = axis === 'x' ? minDiffX : minDiffY;
      let lineVal: number | null = null;

      for (const mPt of movingPoints) {
        for (const tPt of targetPoints) {
          const diff = tPt - mPt;
          if (Math.abs(diff) < thresholdWorld && Math.abs(diff) < minDiff) {
            minDiff = Math.abs(diff);
            bestD = currentD + diff;
            lineVal = tPt;
          }
        }
      }
      return { bestD, diff: minDiff, lineVal };
    };

    for (const target of targetNodes) {
      const sceneNode = sceneGraph.getNode(target.id);
      if (!sceneNode) continue;
      const tWorldPos = sceneNode.getWorldPosition();
      
      const tBounds = {
        left: tWorldPos.x,
        right: tWorldPos.x + target.size.width,
        top: tWorldPos.y,
        bottom: tWorldPos.y + target.size.height,
        centerX: tWorldPos.x + target.size.width / 2,
        centerY: tWorldPos.y + target.size.height / 2,
      };

      // X axis
      const xResult = checkSnap(
        [movingBounds.left, movingBounds.right, movingBounds.centerX],
        [tBounds.left, tBounds.right, tBounds.centerX],
        'x',
        bestDx
      );
      if (xResult.lineVal !== null) {
        bestDx = xResult.bestD;
        minDiffX = xResult.diff;
        // Keep only the closest line
        const existingIndex = lines.findIndex(l => l.axis === 'x');
        if (existingIndex !== -1) {
          lines.splice(existingIndex, 1);
        }
        lines.push({ axis: 'x', value: xResult.lineVal, distance: minDiffX });
      }

      // Y axis
      const yResult = checkSnap(
        [movingBounds.top, movingBounds.bottom, movingBounds.centerY],
        [tBounds.top, tBounds.bottom, tBounds.centerY],
        'y',
        bestDy
      );
      if (yResult.lineVal !== null) {
        bestDy = yResult.bestD;
        minDiffY = yResult.diff;
        const existingIndex = lines.findIndex(l => l.axis === 'y');
        if (existingIndex !== -1) {
          lines.splice(existingIndex, 1);
        }
        lines.push({ axis: 'y', value: yResult.lineVal, distance: minDiffY });
      }
    }

    this.activeLines = lines;
    return { dx: bestDx, dy: bestDy, lines };
  }
  
  public clear(): void {
    this.activeLines = [];
  }
}

export const snappingEngine = new SnappingEngine();
