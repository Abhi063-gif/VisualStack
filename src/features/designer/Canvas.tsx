import React, { useRef, useEffect, useCallback, useState } from 'react';
import { CanvasEngine } from './canvas/CanvasEngine';
import { DesignerInteractionManager } from './interaction/DesignerInteractionManager';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';
import { useViewportStore } from '../../stores/ViewportStore';
import { ContextMenu } from '../../components/ui/ContextMenu';
import { sceneGraph } from './scenegraph/SceneGraph';
import { useSceneStore } from '../../stores/SceneStore';
import { selectionManager } from './selection/SelectionManager';
import { commandManager } from '../../core/commands/CommandManager';
import { DeleteNodeCommand, DuplicateNodeCommand, UpdateNodePropertyCommand } from './commands/NodeCommands';
import { ArrangeCommand } from './commands/ArrangeCommands';
import { LockCommand, VisibilityCommand } from './commands/VisibilityCommands';

function generateId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CanvasEngine | null>(null);
  const { zoom } = useViewportStore();
  const activePageId = useSceneStore((s) => s.activePageId);

  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; nodeId: string | null;
  } | null>(null);

  const [textEditor, setTextEditor] = useState<{
    nodeId: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: number | string;
    textAlign: string;
    fill: string;
  } | null>(null);

  // Context menu via custom window event from interaction manager
  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, nodeId } = (e as CustomEvent).detail as { x: number; y: number; nodeId: string | null };
      setContextMenu({ x, y, nodeId });
    };
    
    const textEditHandler = (e: Event) => {
      const { nodeId } = (e as CustomEvent).detail as { nodeId: string };
      const sn = sceneGraph.getNode(nodeId);
      if (sn && ['Text', 'Heading', 'Paragraph', 'Button', 'Input'].includes(sn.node.type)) {
        const camera = useViewportStore.getState();
        const n = sn.node;
        const worldPos = sn.getWorldPosition();
        const x = worldPos.x * camera.zoom + camera.x;
        const y = worldPos.y * camera.zoom + camera.y;

        const fontSize = (n.nodeStyle?.fontSize || 16) * camera.zoom;
        const width = Math.max(n.size.width * camera.zoom, 100);
        const height = Math.max(n.size.height * camera.zoom, fontSize * 1.5);
        const fill = (n.nodeStyle?.fill && n.nodeStyle.fill !== 'transparent') ? n.nodeStyle.fill : '#ffffff';

        // Hide underlying canvas text while editing
        if (engineRef.current) {
          engineRef.current.editingNodeId = nodeId;
          engineRef.current.render();
        }

        setTextEditor({ 
          nodeId, 
          text: n.textContent || '', 
          x, y, width, height, 
          fontSize,
          fontFamily: n.nodeStyle?.fontFamily || 'Inter, system-ui, sans-serif',
          fontWeight: n.nodeStyle?.fontWeight || 400,
          textAlign: n.nodeStyle?.textAlign || 'left',
          fill
        });
      }
    };

    window.addEventListener('designer:contextmenu', handler);
    window.addEventListener('designer:startTextEdit', textEditHandler);
    return () => {
      window.removeEventListener('designer:contextmenu', handler);
      window.removeEventListener('designer:startTextEdit', textEditHandler);
    };
  }, []);

  // Re-render when active page changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.render();
    }
  }, [activePageId]);

  const closeContextMenu = useCallback(() => setContextMenu(null), []);

  const contextMenuItems = contextMenu?.nodeId
    ? [
        { label: 'Duplicate', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) {
            const cloned = sn.node.clone();
            cloned.id = generateId();
            cloned.name = `${sn.node.name}_copy`;
            cloned.position = { x: sn.node.position.x + 16, y: sn.node.position.y + 16 };
            commandManager.executeCommand(new DuplicateNodeCommand(sn.node, cloned));
            engineRef.current?.render();
          }
        }},
        { label: 'Delete', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) {
            commandManager.executeCommand(new DeleteNodeCommand(sn.node));
            engineRef.current?.render();
          }
        }},
        { label: 'Bring Forward', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new ArrangeCommand(sn.node.id, 'forward'));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Send Backward', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new ArrangeCommand(sn.node.id, 'backward'));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Bring to Front', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new ArrangeCommand(sn.node.id, 'front'));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Send to Back', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new ArrangeCommand(sn.node.id, 'back'));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Lock', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new LockCommand(sn.node, !sn.node.locked));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Hide', action: () => {
          const sn = sceneGraph.getNode(contextMenu.nodeId!);
          if (sn) commandManager.executeCommand(new VisibilityCommand(sn.node, !sn.node.visibility));
          engineRef.current?.render();
          closeContextMenu();
        }},
      ]
    : [
        { label: 'Select All', action: () => {
          sceneGraph.getAllNodes().forEach((sn) => selectionManager.selectNode(sn.node, true));
          engineRef.current?.render();
          closeContextMenu();
        }},
        { label: 'Paste', action: () => closeContextMenu() },
      ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build engine + interaction manager
    const engine = new CanvasEngine();
    engine.initialize(container);
    engineRef.current = engine;

    const manager = new DesignerInteractionManager(engine);
    const detach = manager.attach(container);

    // Re-render on viewport and selection changes
    const unsubs = [
      eventBus.on(SystemEventType.VIEWPORT_UPDATED, () => engine.render()),
      eventBus.on(SystemEventType.SELECTION_CHANGED, () => engine.render()),
      eventBus.on(SystemEventType.CANVAS_NODE_ADDED, () => engine.render()),
      eventBus.on(SystemEventType.CANVAS_NODE_REMOVED, () => engine.render()),
      eventBus.on(SystemEventType.CANVAS_NODE_UPDATED, () => engine.render()),
      eventBus.on(SystemEventType.TOOL_CHANGED, () => engine.render()),
      eventBus.on(SystemEventType.COMMAND_EXECUTED, () => engine.render()),
      eventBus.on(SystemEventType.COMMAND_UNDONE, () => engine.render()),
      eventBus.on(SystemEventType.COMMAND_REDONE, () => engine.render()),
      eventBus.on(SystemEventType.LAYER_REORDERED, () => engine.render()),
      eventBus.on(SystemEventType.NODE_GROUPED, () => engine.render()),
      eventBus.on(SystemEventType.NODE_UNGROUPED, () => engine.render()),
      eventBus.on(SystemEventType.NODE_VISIBILITY_CHANGED, () => engine.render()),
      eventBus.on(SystemEventType.NODE_LOCKED, () => engine.render()),
      eventBus.on(SystemEventType.INSPECTOR_CHANGED, () => engine.render()),
    ];

    const handleResize = () => {
      if (container && engineRef.current) {
        engineRef.current.resize(container.offsetWidth, container.offsetHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      unsubs.forEach(unsub => unsub());
      detach();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0e0f12] overflow-hidden relative select-none">
      {/* Konva Stage container */}
      <div ref={containerRef} tabIndex={0} className="w-full h-full outline-none" />

      {/* Inline Text Editor Overlay */}
      {textEditor && (
        <textarea
          autoFocus
          onFocus={(e) => e.target.select()}
          className="absolute z-40 bg-[#0e0f12]/90 border border-indigo-500 rounded outline-none resize-none overflow-hidden"
          style={{
            left: textEditor.x,
            top: textEditor.y,
            width: textEditor.width,
            height: textEditor.height,
            fontSize: `${textEditor.fontSize}px`,
            fontFamily: textEditor.fontFamily,
            fontWeight: textEditor.fontWeight,
            textAlign: textEditor.textAlign as any,
            color: textEditor.fill,
            padding: '2px 4px',
            margin: 0,
            lineHeight: 1.2,
          }}
          value={textEditor.text}
          onChange={(e) => setTextEditor({ ...textEditor, text: e.target.value })}
          onBlur={() => {
            const sn = sceneGraph.getNode(textEditor.nodeId);
            if (sn && sn.node.textContent !== textEditor.text) {
              const cmd = new UpdateNodePropertyCommand(textEditor.nodeId, { textContent: sn.node.textContent }, { textContent: textEditor.text });
              commandManager.executeCommand(cmd);
            }
            if (engineRef.current) {
              engineRef.current.editingNodeId = null;
              engineRef.current.render();
            }
            setTextEditor(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              if (engineRef.current) {
                engineRef.current.editingNodeId = null;
                engineRef.current.render();
              }
              setTextEditor(null);
            }
          }}
        />
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#14161b]/90 border border-[#232733] px-3 py-1 rounded text-[11px] font-mono text-indigo-400 pointer-events-none z-30 font-semibold">
        {Math.round(zoom * 100)}%
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenuItems}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
};

export default Canvas;
