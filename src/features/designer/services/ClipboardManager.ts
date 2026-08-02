import { selectionManager } from '../selection/SelectionManager';
import { sceneGraph } from '../scenegraph/SceneGraph';
import { commandManager } from '../../../core/commands/CommandManager';
import { PasteNodesCommand, MultiDeleteNodeCommand } from '../commands/NodeCommands';
import { ComponentFactory } from '../components/factories/ComponentFactory';
import type { DesignerNode } from '../models/DesignerNode';

class ClipboardManager {
  private clipboardData: DesignerNode[] = [];
  private pasteOffset = 20;

  public copy(): void {
    const selectedIds = selectionManager.selectedIds;
    if (selectedIds.length === 0) return;

    this.clipboardData = selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter(Boolean) as DesignerNode[];
    
    // Reset paste offset when copying
    this.pasteOffset = 20;
  }

  public cut(): void {
    this.copy();
    this.delete();
  }

  public paste(): void {
    if (this.clipboardData.length === 0) return;

    const newNodes = this.cloneNodes(this.clipboardData, this.pasteOffset);
    if (newNodes.length > 0) {
      const command = new PasteNodesCommand(newNodes);
      commandManager.executeCommand(command);
      this.pasteOffset += 20; // Increment offset for subsequent pastes
    }
  }

  public duplicate(): void {
    const selectedIds = selectionManager.selectedIds;
    if (selectedIds.length === 0) return;

    const nodesToDuplicate = selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter(Boolean) as DesignerNode[];

    const newNodes = this.cloneNodes(nodesToDuplicate, 20);
    if (newNodes.length > 0) {
      const command = new PasteNodesCommand(newNodes);
      commandManager.executeCommand(command);
    }
  }

  public delete(): void {
    const selectedIds = selectionManager.selectedIds;
    if (selectedIds.length === 0) return;

    const nodes = selectedIds
      .map(id => sceneGraph.getNode(id)?.node)
      .filter(Boolean) as DesignerNode[];

    if (nodes.length > 0) {
      const command = new MultiDeleteNodeCommand(nodes);
      commandManager.executeCommand(command);
    }
  }

  private deepClone(node: DesignerNode, offset: number, newParentId: string | null): DesignerNode[] {
    const clonedList: DesignerNode[] = [];
    const newId = Math.random().toString(36).substring(7);
    
    const copyMeta = {
      ...node,
      id: newId,
      uuid: crypto.randomUUID(),
      parent: newParentId,
      children: [], // will be populated by SceneGraph automatically when children are added
      position: {
        x: node.position.x + offset,
        y: node.position.y + offset
      }
    };
    
    const newNode = ComponentFactory.createNode(node.type, copyMeta);
    newNode.nodeStyle = { ...node.nodeStyle };
    clonedList.push(newNode);
    
    // Deep clone children
    if (node.children && node.children.length > 0) {
      for (const childId of node.children) {
        const childSceneNode = sceneGraph.getNode(childId);
        if (childSceneNode) {
          // Children positions are relative to their parent, so offset is 0
          const childClones = this.deepClone(childSceneNode.node, 0, newId);
          clonedList.push(...childClones);
        }
      }
    }
    
    return clonedList;
  }

  private cloneNodes(nodes: DesignerNode[], offset: number): DesignerNode[] {
    const cloned: DesignerNode[] = [];
    
    // Only clone top-level nodes in the selection to avoid double-cloning children
    const rootNodes = nodes.filter(n => !n.parent || !nodes.some(p => p.id === n.parent));
    
    for (const node of rootNodes) {
      const flatClones = this.deepClone(node, offset, node.parent);
      cloned.push(...flatClones);
    }
    
    return cloned;
  }
}

export const clipboardManager = new ClipboardManager();
