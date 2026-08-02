import React, { useEffect, useRef } from 'react';
import { useContextMenuStore } from '../../../../stores/ContextMenuStore';
import { clipboardManager } from '../../services/ClipboardManager';
import { commandManager } from '../../../../core/commands/CommandManager';
import { ArrangeCommand } from '../../commands/ArrangeCommand';
import { GroupCommand, UngroupCommand } from '../../commands/GroupCommands';
import { MakeComponentCommand, DetachInstanceCommand } from '../../commands/ComponentCommands';
import { useSelectionStore } from '../../../../stores/SelectionStore';
import { sceneGraph } from '../../scenegraph/SceneGraph';
import type { DesignerNode } from '../../models/DesignerNode';

export const ContextMenu: React.FC = () => {
  const { x, y, isVisible, hide } = useContextMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hide();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, hide]);

  const { selectedComponentIds } = useSelectionStore();
  
  if (!isVisible) return null;

  const handleAction = (action: () => void) => {
    action();
    hide();
  };

  const hasSelection = selectedComponentIds.length > 0;
  const isSingleSelection = selectedComponentIds.length === 1;
  
  const selectedNodes = selectedComponentIds
    .map(id => sceneGraph.getNode(id)?.node)
    .filter(Boolean) as DesignerNode[];
    
  const hasGroups = selectedNodes.some(n => n.type === 'Group');
  const canGroup = selectedNodes.length > 1;
  const isComponentInstance = isSingleSelection && selectedNodes[0]?.type === 'ComponentInstance';
  const canMakeComponent = isSingleSelection && !isComponentInstance;

  const menuItemClass = (disabled: boolean) =>
    `px-4 py-1.5 text-[13px] cursor-pointer transition-colors ${
      disabled
        ? 'opacity-40 pointer-events-none text-[#8a8a9a]'
        : 'text-[#CCCCCC] hover:bg-[#094771] hover:text-white'
    }`;

  const divider = <div className="h-px bg-[#3E3E42] my-1 mx-2" />;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-[#1e1e2e] border border-[#3E3E42] rounded-lg shadow-2xl overflow-hidden py-1.5 min-w-[210px]"
      style={{ left: x, top: y }}
    >
      {/* Clipboard */}
      <div className={menuItemClass(!hasSelection)} onClick={() => handleAction(() => clipboardManager.copy())}>
        Copy <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+C</span>
      </div>
      <div className={menuItemClass(false)} onClick={() => handleAction(() => clipboardManager.paste())}>
        Paste <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+V</span>
      </div>
      <div className={menuItemClass(!hasSelection)} onClick={() => handleAction(() => clipboardManager.duplicate())}>
        Duplicate <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+D</span>
      </div>
      <div className={menuItemClass(!hasSelection)} onClick={() => handleAction(() => clipboardManager.delete())}>
        Delete <span className="float-right opacity-40 text-xs mt-0.5">Del</span>
      </div>

      {divider}

      {/* Z-order */}
      <div className={menuItemClass(!hasSelection)} onClick={() => handleAction(() => {
        commandManager.executeCommand(new ArrangeCommand(selectedComponentIds, 'front'));
      })}>
        Bring to Front <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+]</span>
      </div>
      <div className={menuItemClass(!hasSelection)} onClick={() => handleAction(() => {
        commandManager.executeCommand(new ArrangeCommand(selectedComponentIds, 'back'));
      })}>
        Send to Back <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+[</span>
      </div>

      {divider}

      {/* Grouping */}
      <div className={menuItemClass(!canGroup)} onClick={() => handleAction(() => {
        commandManager.executeCommand(new GroupCommand(selectedNodes));
      })}>
        Group <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+G</span>
      </div>
      <div className={menuItemClass(!hasGroups)} onClick={() => handleAction(() => {
        for (const g of selectedNodes.filter(n => n.type === 'Group')) {
          commandManager.executeCommand(new UngroupCommand(g));
        }
      })}>
        Ungroup <span className="float-right opacity-40 text-xs mt-0.5">Ctrl+Shift+G</span>
      </div>

      {divider}

      {/* Component System */}
      <div
        className={menuItemClass(!canMakeComponent)}
        onClick={() => handleAction(() => {
          commandManager.executeCommand(new MakeComponentCommand(selectedComponentIds[0]));
        })}
      >
        <span className="text-violet-400">◇</span> Make Component
      </div>
      {isComponentInstance && (
        <div
          className={menuItemClass(false)}
          onClick={() => handleAction(() => {
            commandManager.executeCommand(new DetachInstanceCommand(selectedComponentIds[0]));
          })}
        >
          <span className="text-amber-400">↗</span> Detach Instance
        </div>
      )}
    </div>
  );
};
