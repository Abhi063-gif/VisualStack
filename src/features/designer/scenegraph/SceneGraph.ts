import { SceneNode } from './SceneNode';
import type { DesignerNode } from '../models/DesignerNode';

export class SceneGraph {
  private static instance: SceneGraph;
  private nodesMap: Map<string, SceneNode> = new Map();
  private rootNodes: SceneNode[] = [];

  private constructor() {}

  public static getInstance(): SceneGraph {
    if (!SceneGraph.instance) {
      SceneGraph.instance = new SceneGraph();
    }
    return SceneGraph.instance;
  }

  public addNode(node: DesignerNode): SceneNode {
    const sceneNode = new SceneNode(node);
    this.nodesMap.set(node.id, sceneNode);

    if (node.parent && this.nodesMap.has(node.parent)) {
      this.nodesMap.get(node.parent)!.addChild(sceneNode);
    } else {
      this.rootNodes.push(sceneNode);
    }

    return sceneNode;
  }

  public getNode(id: string): SceneNode | undefined {
    return this.nodesMap.get(id);
  }

  public removeNode(id: string): void {
    const sceneNode = this.nodesMap.get(id);
    if (!sceneNode) return;

    if (sceneNode.parent) {
      sceneNode.parent.removeChild(id);
    } else {
      this.rootNodes = this.rootNodes.filter((n) => n.node.id !== id);
    }

    this.nodesMap.delete(id);
  }

  public reorderNode(id: string, targetId: string, position: 'before' | 'after' | 'inside'): void {
    const node = this.nodesMap.get(id);
    const target = this.nodesMap.get(targetId);
    if (!node || !target || id === targetId) return;

    // 1. Remove node from its current parent/root
    if (node.parent) {
      node.parent.removeChild(id);
    } else {
      this.rootNodes = this.rootNodes.filter((n) => n.node.id !== id);
    }

    // 2. Insert into new location
    if (position === 'inside') {
      target.addChild(node);
      node.node.parent = targetId;
    } else {
      const parent = target.parent;
      node.parent = parent;
      node.node.parent = parent ? parent.node.id : null;

      const list = parent ? parent.children : this.rootNodes;
      const idList = parent ? parent.node.children : null;
      
      const targetIndex = list.findIndex(n => n.node.id === targetId);
      const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;

      list.splice(insertIndex, 0, node);
      if (idList) {
        idList.splice(insertIndex, 0, id);
      }
    }
  }
  public setNodeZIndex(id: string, action: 'front' | 'back' | 'forward' | 'backward'): void {
    const sceneNode = this.nodesMap.get(id);
    if (!sceneNode) return;

    const list = sceneNode.parent ? sceneNode.parent.children : this.rootNodes;
    const idList = sceneNode.parent ? sceneNode.parent.node.children : null;
    
    const currentIndex = list.findIndex(n => n.node.id === id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (action) {
      case 'front':
        newIndex = list.length - 1;
        break;
      case 'back':
        newIndex = 0;
        break;
      case 'forward':
        newIndex = Math.min(list.length - 1, currentIndex + 1);
        break;
      case 'backward':
        newIndex = Math.max(0, currentIndex - 1);
        break;
    }

    if (newIndex !== currentIndex) {
      // Remove from current
      list.splice(currentIndex, 1);
      if (idList) idList.splice(currentIndex, 1);
      
      // Insert at new
      list.splice(newIndex, 0, sceneNode);
      if (idList) idList.splice(newIndex, 0, id);
    }
  }

  public getAllNodes(): SceneNode[] {
    return Array.from(this.nodesMap.values());
  }

  public getRootNodes(): SceneNode[] {
    return this.rootNodes;
  }

  public clear(): void {
    this.nodesMap.clear();
    this.rootNodes = [];
  }
}

export const sceneGraph = SceneGraph.getInstance();
