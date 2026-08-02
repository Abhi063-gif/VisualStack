import React from 'react';
import {
  MousePointer,
  Frame,
  Square,
  Circle,
  Minus,
  MoveUpRight,
  Type,
  Image as ImageIcon,
  SquareCode,
  FormInput,
  Box,
  Rows3,
  Component as ComponentIcon,
  Smile,
  Hand,
  ZoomIn,
} from 'lucide-react';
import { useCanvasStore } from '../../stores/CanvasStore';
import { toolManager } from '../../features/designer/tools/ToolManager';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { cn } from '../../utils/cn';

export interface ToolItem {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
}

export const ToolsBar: React.FC = () => {
  const { activeToolId } = useCanvasStore();

  const tools: ToolItem[] = [
    { id: 'select', label: 'Move Tool', shortcut: 'V', icon: <MousePointer size={16} /> },
    { id: 'frame', label: 'Frame Tool', shortcut: 'F', icon: <Frame size={16} /> },
    { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: <Square size={16} /> },
    { id: 'ellipse', label: 'Ellipse', shortcut: 'O', icon: <Circle size={16} /> },
    { id: 'line', label: 'Line', shortcut: 'L', icon: <Minus size={16} /> },
    { id: 'arrow', label: 'Arrow', shortcut: '', icon: <MoveUpRight size={16} /> },
    { id: 'text', label: 'Text Tool', shortcut: 'T', icon: <Type size={16} /> },
    { id: 'image', label: 'Image', shortcut: '', icon: <ImageIcon size={16} /> },
    { id: 'button', label: 'Button Component', shortcut: '', icon: <SquareCode size={16} /> },
    { id: 'input', label: 'Input Form', shortcut: '', icon: <FormInput size={16} /> },
    { id: 'container', label: 'Container', shortcut: '', icon: <Box size={16} /> },
    { id: 'stack', label: 'Stack Layout', shortcut: '', icon: <Rows3 size={16} /> },
    { id: 'component', label: 'Component', shortcut: '', icon: <ComponentIcon size={16} /> },
    { id: 'icon', label: 'Icon Asset', shortcut: '', icon: <Smile size={16} /> },
    { id: 'hand', label: 'Hand Tool', shortcut: 'H', icon: <Hand size={16} /> },
    { id: 'zoom', label: 'Zoom Tool', shortcut: 'Z', icon: <ZoomIn size={16} /> },
  ];

  const handleSelectTool = (id: string, name: string) => {
    toolManager.setActiveTool(id);
    eventBus.emit(SystemEventType.TOOL_CHANGED, { toolId: id, name });
  };

  // Keyboard shortcut bindings
  useKeyboardShortcut('v', () => handleSelectTool('select', 'Move Tool'));
  useKeyboardShortcut('f', () => handleSelectTool('frame', 'Frame Tool'));
  useKeyboardShortcut('r', () => handleSelectTool('rectangle', 'Rectangle'));
  useKeyboardShortcut('o', () => handleSelectTool('ellipse', 'Ellipse'));
  useKeyboardShortcut('l', () => handleSelectTool('line', 'Line'));
  useKeyboardShortcut('t', () => handleSelectTool('text', 'Text Tool'));
  useKeyboardShortcut('h', () => handleSelectTool('hand', 'Hand Tool'));
  useKeyboardShortcut('z', () => handleSelectTool('zoom', 'Zoom Tool'));

  return (
    <div className="w-[200px] bg-[#14161b] border-r border-[#232733] flex flex-col py-3 px-2 gap-0.5 select-none z-10 overflow-y-auto">
      {tools.map((tool) => {
        const isActive = activeToolId === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => handleSelectTool(tool.id, tool.label)}
            title={`${tool.label} ${tool.shortcut ? `(${tool.shortcut})` : ''}`}
            className={cn(
              'w-full h-8 flex items-center justify-between px-2 rounded-md transition-colors cursor-pointer',
              isActive
                ? 'bg-indigo-600/20 text-indigo-400 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1f232d]'
            )}
          >
            <div className="flex items-center gap-3">
              <span className={isActive ? 'text-indigo-400' : 'text-gray-400'}>{tool.icon}</span>
              <span className="text-[12px]">{tool.label}</span>
            </div>
            {tool.shortcut && (
              <span className="text-[10px] text-gray-500 font-mono">{tool.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
