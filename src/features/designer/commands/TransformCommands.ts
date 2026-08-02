import { BaseCommand } from '../../../core/commands/Command';
import type { DesignerNode } from '../models/DesignerNode';
import { useSceneStore } from '../../../stores/SceneStore';

export interface TransformState {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
}

export class MoveNodesCommand extends BaseCommand {
  private originalStates: Map<DesignerNode, { x: number; y: number }> = new Map();
  private newStates: Map<DesignerNode, { x: number; y: number }> = new Map();

  constructor(nodes: DesignerNode[], dx: number, dy: number) {
    super(nodes.length === 1 ? `Move ${nodes[0].name}` : `Move ${nodes.length} items`);
    
    for (const node of nodes) {
      this.originalStates.set(node, { ...node.position });
      this.newStates.set(node, { x: node.position.x + dx, y: node.position.y + dy });
    }
  }

  execute(): void {
    const store = useSceneStore.getState();
    for (const [node, pos] of this.newStates) {
      store.updateNodeProperty(node.id, { position: { ...pos } });
    }
  }

  undo(): void {
    const store = useSceneStore.getState();
    for (const [node, pos] of this.originalStates) {
      store.updateNodeProperty(node.id, { position: { ...pos } });
    }
  }
}

export class ResizeNodesCommand extends BaseCommand {
  private originalStates: Map<DesignerNode, TransformState> = new Map();
  private newStates: Map<DesignerNode, TransformState> = new Map();

  constructor(
    nodes: DesignerNode[],
    newStatesMap: Map<DesignerNode, TransformState>
  ) {
    super(nodes.length === 1 ? `Resize ${nodes[0].name}` : `Resize ${nodes.length} items`);
    
    for (const node of nodes) {
      this.originalStates.set(node, {
        position: { ...node.position },
        size: { ...node.size }
      });
      const newState = newStatesMap.get(node);
      if (newState) {
        this.newStates.set(node, newState);
      }
    }
  }

  execute(): void {
    const store = useSceneStore.getState();
    for (const [node, state] of this.newStates) {
      store.updateNodeProperty(node.id, { 
        ...(state.position && { position: { ...state.position } }),
        ...(state.size && { size: { ...state.size } })
      });
    }
  }

  undo(): void {
    const store = useSceneStore.getState();
    for (const [node, state] of this.originalStates) {
      store.updateNodeProperty(node.id, { 
        ...(state.position && { position: { ...state.position } }),
        ...(state.size && { size: { ...state.size } })
      });
    }
  }
}

export class RotateNodesCommand extends BaseCommand {
  private originalStates: Map<DesignerNode, { rotation: number, x: number, y: number }> = new Map();
  private newStates: Map<DesignerNode, { rotation: number, x: number, y: number }> = new Map();

  constructor(
    nodes: DesignerNode[],
    newStatesMap: Map<DesignerNode, { rotation: number, x: number, y: number }>
  ) {
    super(nodes.length === 1 ? `Rotate ${nodes[0].name}` : `Rotate ${nodes.length} items`);
    
    for (const node of nodes) {
      this.originalStates.set(node, {
        rotation: node.rotation || 0,
        x: node.position.x,
        y: node.position.y
      });
      const newState = newStatesMap.get(node);
      if (newState) {
        this.newStates.set(node, newState);
      }
    }
  }

  execute(): void {
    const store = useSceneStore.getState();
    for (const [node, state] of this.newStates) {
      store.updateNodeProperty(node.id, { 
        rotation: state.rotation,
        position: { x: state.x, y: state.y }
      });
    }
  }

  undo(): void {
    const store = useSceneStore.getState();
    for (const [node, state] of this.originalStates) {
      store.updateNodeProperty(node.id, { 
        rotation: state.rotation,
        position: { x: state.x, y: state.y }
      });
    }
  }
}
