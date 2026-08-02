import type { TransformEvent, TransformStrategy } from './TransformStrategy';
import { selectionManager } from '../selection/SelectionManager';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { useSceneStore } from '../../../stores/SceneStore';
import { commandManager } from '../../../core/commands/CommandManager';
import { ResizeNodesCommand } from '../commands/TransformCommands';
import type { TransformState } from '../commands/TransformCommands';
import type { DesignerNode } from '../models/DesignerNode';
import type { HandleType } from './TransformHandles';
import { layoutEngine } from '../layout/LayoutEngine';

export class ResizeStrategy implements TransformStrategy {
  private initialStates: Map<string, TransformState> = new Map();
  private selectedNodes: DesignerNode[] = [];
  private allModifiedNodes: DesignerNode[] = [];
  private startEvent: TransformEvent | null = null;
  private hasResized: boolean = false;
  private handleType: HandleType;

  constructor(handleType: HandleType) {
    this.handleType = handleType;
  }

  start(e: TransformEvent): void {
    this.startEvent = e;
    this.selectedNodes = selectionManager.selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter((n): n is DesignerNode => !!n);
    this.allModifiedNodes = [...this.selectedNodes];

    const storeDescendants = (nId: string) => {
      const sn = sceneGraph.getNode(nId);
      if (!sn) return;
      for (const child of sn.children) {
        this.initialStates.set(child.node.id, {
          position: { ...child.node.position },
          size: { ...child.node.size }
        });
        if (!this.allModifiedNodes.find(n => n.id === child.node.id)) {
          this.allModifiedNodes.push(child.node);
        }
        storeDescendants(child.node.id);
      }
    };

    for (const node of this.selectedNodes) {
      this.initialStates.set(node.id, {
        position: { ...node.position },
        size: { ...node.size }
      });
      storeDescendants(node.id);
    }
    this.hasResized = false;
  }

  update(e: TransformEvent): void {
    if (!this.startEvent) return;

    let dx = e.clientX - this.startEvent.clientX;
    let dy = e.clientY - this.startEvent.clientY;
    
    if (dx !== 0 || dy !== 0) {
      this.hasResized = true;
    }

    const store = useSceneStore.getState();
    
    for (const node of this.selectedNodes) {
      const initial = this.initialStates.get(node.id)!;
      let { width, height } = initial.size!;
      let { x, y } = initial.position!;
      
      const aspect = width / height;

      if (e.shiftKey) {
        // Proportional resize (simplified for primary handle direction)
        if (Math.abs(dx) > Math.abs(dy)) {
          dy = dx / aspect;
        } else {
          dx = dy * aspect;
        }
      }

      // Simplified resize logic. For rotated nodes, dx/dy must be projected onto the node's local axes.
      // Assuming non-rotated nodes for this basic implementation:
      switch (this.handleType) {
        case 'e':
          width += dx;
          break;
        case 's':
          height += dy;
          break;
        case 'se':
          width += dx;
          height += dy;
          break;
        case 'w':
          width -= dx;
          x += dx;
          break;
        case 'n':
          height -= dy;
          y += dy;
          break;
        case 'nw':
          width -= dx;
          height -= dy;
          x += dx;
          y += dy;
          break;
        case 'ne':
          width += dx;
          height -= dy;
          y += dy;
          break;
        case 'sw':
          width -= dx;
          height += dy;
          x += dx;
          break;
      }

      if (e.altKey) {
        // Resize from center
        switch (this.handleType) {
          case 'e': case 'w': 
            width += Math.abs(dx); 
            x -= Math.abs(dx) / 2; 
            break;
          case 'n': case 's': 
            height += Math.abs(dy); 
            y -= Math.abs(dy) / 2; 
            break;
          case 'se': case 'nw': case 'ne': case 'sw':
            width += Math.abs(dx);
            height += Math.abs(dy);
            x -= Math.abs(dx) / 2;
            y -= Math.abs(dy) / 2;
            break;
        }
      }

      // Enforce min size
      if (width < 20) {
        if (['w', 'nw', 'sw'].includes(this.handleType)) x -= (20 - width);
        width = 20;
      }
      if (height < 20) {
        if (['n', 'nw', 'ne'].includes(this.handleType)) y -= (20 - height);
        height = 20;
      }

      store.updateNodeProperty(node.id, {
        position: { x, y },
        size: { width, height }
      });

      const scaleX = width / initial.size!.width;
      const scaleY = height / initial.size!.height;
      
      const updateDescendants = (nId: string) => {
        const sn = sceneGraph.getNode(nId);
        if (!sn) return;
        for (const child of sn.children) {
          const cInitial = this.initialStates.get(child.node.id)!;
          
          const cx = cInitial.position!.x * scaleX;
          const cy = cInitial.position!.y * scaleY;
          const cw = cInitial.size!.width * scaleX;
          const ch = cInitial.size!.height * scaleY;
          
          store.updateNodeProperty(child.node.id, {
            position: { x: cx, y: cy },
            size: { width: Math.max(1, cw), height: Math.max(1, ch) }
          });
          
          updateDescendants(child.node.id);
        }
      };

      updateDescendants(node.id);
    }
  }

  end(_e: TransformEvent): void {
    if (!this.startEvent || !this.hasResized) return;
    
    const store = useSceneStore.getState();
    const newStates = new Map<DesignerNode, TransformState>();

    for (const node of this.allModifiedNodes) {
      // Capture the final state from the store
      const sn = store.getNodeById(node.id);
      if (sn) {
        newStates.set(node, {
          position: { ...sn.position },
          size: { ...sn.size }
        });
      }
      // Revert to initial for command recording
      const initial = this.initialStates.get(node.id)!;
      store.updateNodeProperty(node.id, {
        position: initial.position,
        size: initial.size
      });
    }

    const command = new ResizeNodesCommand(this.allModifiedNodes, newStates);
    commandManager.executeCommand(command).then(() => {
      for (const node of this.allModifiedNodes) {
        if (node.parent) {
          layoutEngine.updateLayout(node.parent);
        }
        if (node.layoutConfig?.enabled) {
          layoutEngine.updateLayout(node.id);
        }
      }
    });
  }
}
