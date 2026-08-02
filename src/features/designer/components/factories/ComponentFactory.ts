import { BaseDesignerNode } from '../../nodes/base/BaseDesignerNode';
import * as NodeTypes from '../../nodes/types';
import { ComponentInstanceNode } from '../../nodes/ComponentInstanceNode';
import { componentRegistry } from '../registry/ComponentRegistry';
import { selectionManager } from '../../selection/SelectionManager';
import { commandManager } from '../../../../core/commands/CommandManager';
import { CreateNodeCommand } from '../../commands/NodeCommands';
import type { ComponentNodeMeta } from '../../../../types/project';

export class ComponentFactory {
  public static createNode(type: string, meta: Partial<ComponentNodeMeta> = {}): BaseDesignerNode {
    const id = meta.id || crypto.randomUUID();
    const metadata = componentRegistry.getMetadata(type);
    
    // Assign defaults from metadata
    const size = meta.size || { 
      width: metadata?.defaultWidth ?? 100, 
      height: metadata?.defaultHeight ?? 100 
    };
    
    const baseMeta = {
      ...meta,
      id,
      type,
      size,
      name: meta.name || metadata?.displayName || type,
      category: metadata?.category || 'Basic',
    };

    let node: BaseDesignerNode;

    switch (type) {
      case 'Rectangle': node = new NodeTypes.RectangleNode(baseMeta); break;
      case 'Circle': node = new NodeTypes.CircleNode(baseMeta); break;
      case 'Ellipse': node = new NodeTypes.EllipseNode(baseMeta); break;
      case 'Line': node = new NodeTypes.LineNode(baseMeta); break;
      case 'Arrow': node = new NodeTypes.ArrowNode(baseMeta); break;
      
      case 'Text': node = new NodeTypes.TextNode(baseMeta); break;
      case 'Heading': node = new NodeTypes.HeadingNode(baseMeta); break;
      case 'Paragraph': node = new NodeTypes.ParagraphNode(baseMeta); break;
      
      case 'Button': node = new NodeTypes.ButtonNode(baseMeta); break;
      case 'Input': node = new NodeTypes.InputNode(baseMeta); break;
      case 'Textarea': node = new NodeTypes.TextareaNode(baseMeta); break;
      case 'Checkbox': node = new NodeTypes.CheckboxNode(baseMeta); break;
      case 'Radio': node = new NodeTypes.RadioNode(baseMeta); break;
      case 'Switch': node = new NodeTypes.SwitchNode(baseMeta); break;
      case 'Toggle': node = new NodeTypes.ToggleNode(baseMeta); break;
      
      case 'Image': node = new NodeTypes.ImageNode(baseMeta); break;
      case 'Video': node = new NodeTypes.VideoNode(baseMeta); break;
      case 'Avatar': node = new NodeTypes.AvatarNode(baseMeta); break;
      case 'Icon': node = new NodeTypes.IconNode(baseMeta); break;
      
      case 'Container': node = new NodeTypes.ContainerNode(baseMeta); break;
      case 'Section': node = new NodeTypes.SectionNode(baseMeta); break;
      case 'Frame': node = new NodeTypes.FrameNode(baseMeta); break;
      case 'Navbar': node = new NodeTypes.NavbarNode(baseMeta); break;
      case 'Sidebar': node = new NodeTypes.SidebarNode(baseMeta); break;
      case 'Tabs': node = new NodeTypes.TabsNode(baseMeta); break;
      case 'Grid': node = new NodeTypes.GridNode(baseMeta); break;
      case 'FlexRow': node = new NodeTypes.FlexRowNode(baseMeta); break;
      case 'FlexColumn': node = new NodeTypes.FlexColumnNode(baseMeta); break;
      case 'Stack': node = new NodeTypes.StackNode(baseMeta); break;
      
      case 'Card': node = new NodeTypes.CardNode(baseMeta); break;
      case 'Accordion': node = new NodeTypes.AccordionNode(baseMeta); break;
      case 'Modal': node = new NodeTypes.ModalNode(baseMeta); break;
      case 'Drawer': node = new NodeTypes.DrawerNode(baseMeta); break;
      case 'Toast': node = new NodeTypes.ToastNode(baseMeta); break;
      case 'Badge': node = new NodeTypes.BadgeNode(baseMeta); break;
      case 'Chip': node = new NodeTypes.ChipNode(baseMeta); break;
      case 'Spinner': node = new NodeTypes.SpinnerNode(baseMeta); break;
      case 'Progress': node = new NodeTypes.ProgressNode(baseMeta); break;
      
      case 'Group': node = new NodeTypes.GroupNode(baseMeta); break;
      case 'ComponentInstance': {
        const ciMeta = meta as any;
        node = new ComponentInstanceNode({ ...baseMeta, componentId: ciMeta.componentId || '', overrides: ciMeta.overrides || {} });
        break;
      }
      
      default:
        node = new NodeTypes.RectangleNode(baseMeta); // Fallback
    }

    // Apply default styles
    const defaultStyle = componentRegistry.getDefaultStyle(type);
    node.updateStyle(defaultStyle);
    
    // Additional overrides if passed in meta
    if (meta.style) {
      node.updateStyle(meta.style as any);
    }
    
    // Text content setup for typography and button nodes
    if (['Text', 'Heading', 'Paragraph', 'Button'].includes(type) && !node.textContent) {
      node.textContent = metadata?.displayName || type;
    }

    return node;
  }

  public static insertNode(type: string, meta: Partial<ComponentNodeMeta> = {}): BaseDesignerNode {
    const node = this.createNode(type, meta);
    
    // 1. Create the command
    const command = new CreateNodeCommand(node);
    
    // 2. Execute via CommandManager (This will update SceneGraph, emit events, etc.)
    commandManager.executeCommand(command);
    
    // 3. Selection
    selectionManager.selectNode(node, false);
    
    return node;
  }
}
