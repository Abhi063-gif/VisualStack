import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Layers, Image as ImageIcon, FileCode, Component, Eye, EyeOff, Lock, Unlock, ChevronRight, ChevronDown, Square, Type as TypeIcon, Frame as FrameIcon, Folder, Plus, Search, Upload, X, Link } from 'lucide-react';
import { useSceneStore, type PageItem } from '../../stores/SceneStore';
import { useSelectionStore } from '../../stores/SelectionStore';
import { commandManager } from '../../core/commands/CommandManager';
import { ReorderNodeCommand } from '../../features/designer/commands/NodeCommands';
import { VisibilityCommand, LockCommand, RenameCommand } from '../../features/designer/commands/VisibilityCommands';
import { selectionManager } from '../../features/designer/selection/SelectionManager';
import { sceneGraph } from '../../features/designer/scenegraph/SceneGraph';
import { eventBus } from '../../core/events/EventBus';
import { SystemEventType } from '../../core/events/EventTypes';
import { cn } from '../../utils/cn';
import { componentRegistry } from '../../features/designer/components/registry/ComponentRegistry';
import { COMPONENT_CATEGORIES } from '../../features/designer/components/categories/ComponentCategory';
import { ComponentIcon } from '../../features/designer/components/icons/ComponentIcon';

export type SidebarTab = 'layers' | 'assets' | 'pages' | 'components' | 'variables' | 'icons';

// ── Icon catalogue ───────────────────────────────────────────────────────────
const ICON_NAMES: { name: string; category: string; svgPath: string }[] = [
  // UI Actions
  { name: 'Home', category: 'UI', svgPath: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { name: 'Search', category: 'UI', svgPath: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>' },
  { name: 'Settings', category: 'UI', svgPath: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>' },
  { name: 'User', category: 'UI', svgPath: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { name: 'Bell', category: 'UI', svgPath: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>' },
  { name: 'Mail', category: 'UI', svgPath: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>' },
  { name: 'Heart', category: 'UI', svgPath: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>' },
  { name: 'Star', category: 'UI', svgPath: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { name: 'Bookmark', category: 'UI', svgPath: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>' },
  { name: 'Share', category: 'UI', svgPath: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>' },
  { name: 'Plus', category: 'UI', svgPath: '<path d="M5 12h14"/><path d="M12 5v14"/>' },
  { name: 'Minus', category: 'UI', svgPath: '<path d="M5 12h14"/>' },
  { name: 'X', category: 'UI', svgPath: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>' },
  { name: 'Check', category: 'UI', svgPath: '<path d="M20 6 9 17l-5-5"/>' },
  { name: 'Edit', category: 'UI', svgPath: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
  { name: 'Trash', category: 'UI', svgPath: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>' },
  { name: 'Copy', category: 'UI', svgPath: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>' },
  { name: 'Download', category: 'UI', svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>' },
  { name: 'Upload', category: 'UI', svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>' },
  { name: 'Menu', category: 'UI', svgPath: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>' },
  { name: 'MoreHorizontal', category: 'UI', svgPath: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>' },
  { name: 'MoreVertical', category: 'UI', svgPath: '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>' },
  { name: 'Filter', category: 'UI', svgPath: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>' },
  { name: 'Sliders', category: 'UI', svgPath: '<line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="6" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="4" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="8" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="12" y2="12"/><line x1="17" x2="23" y1="16" y2="16"/>' },
  // Arrows
  { name: 'ArrowRight', category: 'Arrows', svgPath: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>' },
  { name: 'ArrowLeft', category: 'Arrows', svgPath: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>' },
  { name: 'ArrowUp', category: 'Arrows', svgPath: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>' },
  { name: 'ArrowDown', category: 'Arrows', svgPath: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>' },
  { name: 'ChevronRight', category: 'Arrows', svgPath: '<path d="m9 18 6-6-6-6"/>' },
  { name: 'ChevronLeft', category: 'Arrows', svgPath: '<path d="m15 18-6-6 6-6"/>' },
  { name: 'ChevronUp', category: 'Arrows', svgPath: '<path d="m18 15-6-6-6 6"/>' },
  { name: 'ChevronDown', category: 'Arrows', svgPath: '<path d="m6 9 6 6 6-6"/>' },
  { name: 'ChevronsRight', category: 'Arrows', svgPath: '<path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/>' },
  { name: 'CornerDownRight', category: 'Arrows', svgPath: '<polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/>' },
  { name: 'RefreshCw', category: 'Arrows', svgPath: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>' },
  { name: 'RotateCcw', category: 'Arrows', svgPath: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>' },
  { name: 'ExternalLink', category: 'Arrows', svgPath: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>' },
  // Media
  { name: 'Play', category: 'Media', svgPath: '<polygon points="5 3 19 12 5 21 5 3"/>' },
  { name: 'Pause', category: 'Media', svgPath: '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>' },
  { name: 'Stop', category: 'Media', svgPath: '<rect width="14" height="14" x="5" y="5" rx="2" ry="2"/>' },
  { name: 'SkipForward', category: 'Media', svgPath: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>' },
  { name: 'Volume2', category: 'Media', svgPath: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>' },
  { name: 'Mic', category: 'Media', svgPath: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>' },
  { name: 'Camera', category: 'Media', svgPath: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>' },
  { name: 'Film', category: 'Media', svgPath: '<rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="17" x2="22" y1="7" y2="7"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="2" x2="7" y1="17" y2="17"/>' },
  { name: 'Headphones', category: 'Media', svgPath: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>' },
  // Communication
  { name: 'MessageCircle', category: 'Communication', svgPath: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>' },
  { name: 'MessageSquare', category: 'Communication', svgPath: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  { name: 'Phone', category: 'Communication', svgPath: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' },
  { name: 'Send', category: 'Communication', svgPath: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>' },
  { name: 'AtSign', category: 'Communication', svgPath: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>' },
  { name: 'Globe', category: 'Communication', svgPath: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>' },
  { name: 'Link', category: 'Communication', svgPath: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' },
  // Commerce
  { name: 'ShoppingCart', category: 'Commerce', svgPath: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>' },
  { name: 'ShoppingBag', category: 'Commerce', svgPath: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  { name: 'CreditCard', category: 'Commerce', svgPath: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>' },
  { name: 'Tag', category: 'Commerce', svgPath: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>' },
  { name: 'Package', category: 'Commerce', svgPath: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/><path d="m7.5 4.27 9 5.15"/>' },
  // Data & Analytics
  { name: 'BarChart', category: 'Data', svgPath: '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>' },
  { name: 'LineChart', category: 'Data', svgPath: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>' },
  { name: 'PieChart', category: 'Data', svgPath: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>' },
  { name: 'TrendingUp', category: 'Data', svgPath: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' },
  { name: 'TrendingDown', category: 'Data', svgPath: '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>' },
  { name: 'Activity', category: 'Data', svgPath: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  { name: 'Database', category: 'Data', svgPath: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>' },
  { name: 'Server', category: 'Data', svgPath: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>' },
  // Navigation
  { name: 'Map', category: 'Navigation', svgPath: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>' },
  { name: 'MapPin', category: 'Navigation', svgPath: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>' },
  { name: 'Navigation', category: 'Navigation', svgPath: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>' },
  { name: 'Compass', category: 'Navigation', svgPath: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>' },
  // Files
  { name: 'File', category: 'Files', svgPath: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>' },
  { name: 'Folder', category: 'Files', svgPath: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>' },
  { name: 'Image', category: 'Files', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>' },
  { name: 'FileText', category: 'Files', svgPath: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>' },
  { name: 'Code', category: 'Files', svgPath: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>' },
  // Layout
  { name: 'Layout', category: 'Layout', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/>' },
  { name: 'Grid', category: 'Layout', svgPath: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>' },
  { name: 'Columns', category: 'Layout', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/>' },
  { name: 'Rows', category: 'Layout', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="12" y2="12"/>' },
  { name: 'Sidebar', category: 'Layout', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/>' },
  { name: 'PanelLeft', category: 'Layout', svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/>' },
  // Security
  { name: 'Shield', category: 'Security', svgPath: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>' },
  { name: 'Lock', category: 'Security', svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  { name: 'Unlock', category: 'Security', svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>' },
  { name: 'Eye', category: 'Security', svgPath: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>' },
  { name: 'EyeOff', category: 'Security', svgPath: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>' },
  // Weather & Nature
  { name: 'Sun', category: 'Nature', svgPath: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>' },
  { name: 'Moon', category: 'Nature', svgPath: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>' },
  { name: 'Cloud', category: 'Nature', svgPath: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>' },
  { name: 'Zap', category: 'Nature', svgPath: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>' },
  // AI & Tech
  { name: 'Cpu', category: 'Tech', svgPath: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>' },
  { name: 'Wifi', category: 'Tech', svgPath: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>' },
  { name: 'Bluetooth', category: 'Tech', svgPath: '<path d="m7 7 10 10-5 5V2l5 5L7 17"/>' },
  { name: 'Battery', category: 'Tech', svgPath: '<rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><line x1="22" x2="22" y1="11" y2="13"/>' },
  { name: 'Smartphone', category: 'Tech', svgPath: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>' },
  { name: 'Monitor', category: 'Tech', svgPath: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>' },
  { name: 'Keyboard', category: 'Tech', svgPath: '<rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/>' },
  { name: 'HardDrive', category: 'Tech', svgPath: '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>' },
];

const ICON_CATEGORIES = [...new Set(ICON_NAMES.map(i => i.category))];

function NodeTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'Frame': return <FrameIcon size={11} className="text-sky-400 shrink-0" />;
    case 'Shape': return <Square size={11} className="text-indigo-400 shrink-0" />;
    case 'Text':  return <TypeIcon size={11} className="text-amber-400 shrink-0" />;
    case 'Image': return <ImageIcon size={11} className="text-emerald-400 shrink-0" />;
    case 'Component': return <Component size={11} className="text-violet-400 shrink-0" />;
    default: return <Square size={11} className="text-gray-400 shrink-0" />;
  }
}

interface LayerRowProps {
  nodeId: string;
  depth: number;
}

const LayerRow: React.FC<LayerRowProps> = ({ nodeId, depth }) => {
  const nodes = useSceneStore((s) => s.nodes);
  const { selectedComponentIds } = useSelectionStore();
  const node = nodes.find((n) => n.id === nodeId);
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node?.name || '');
  const [dropIndicator, setDropIndicator] = useState<'before' | 'after' | 'inside' | null>(null);

  if (!node) return null;
  const isSelected = selectedComponentIds.includes(nodeId);

  const handleSelect = () => {
    const sceneNode = sceneGraph.getNode(nodeId);
    if (sceneNode) selectionManager.selectNode(sceneNode.node, false);
    eventBus.emit(SystemEventType.LAYER_SELECTED, { layerId: nodeId });
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sceneNode = sceneGraph.getNode(nodeId);
    if (sceneNode) {
      commandManager.executeCommand(new VisibilityCommand(sceneNode.node, !node.visibility));
    }
  };

  const toggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sceneNode = sceneGraph.getNode(nodeId);
    if (sceneNode) {
      commandManager.executeCommand(new LockCommand(sceneNode.node, !node.locked));
    }
  };

  const hasChildren = node.children.length > 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', nodeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    
    const canNest = node?.type === 'Group' || node?.type === 'Frame';
    
    if (canNest) {
      if (relativeY < rect.height * 0.25) {
        setDropIndicator('before');
      } else if (relativeY > rect.height * 0.75) {
        setDropIndicator('after');
      } else {
        setDropIndicator('inside');
      }
    } else {
      setDropIndicator(relativeY < rect.height / 2 ? 'before' : 'after');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDropIndicator(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndicator(null);
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== nodeId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const canNest = node?.type === 'Group' || node?.type === 'Frame';
      let position: 'before' | 'after' | 'inside';
      
      if (canNest) {
        if (relativeY < rect.height * 0.25) position = 'before';
        else if (relativeY > rect.height * 0.75) position = 'after';
        else position = 'inside';
      } else {
        position = relativeY < rect.height / 2 ? 'before' : 'after';
      }
      
      commandManager.executeCommand(new ReorderNodeCommand(draggedId, nodeId, position));
    }
  };

  const handleMouseEnter = () => {
    eventBus.emit(SystemEventType.LAYER_HOVERED, { layerId: nodeId });
  };
  
  const handleMouseLeave = () => {
    eventBus.emit(SystemEventType.LAYER_HOVERED, { layerId: null });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(node.name);
  };

  const commitEdit = () => {
    setIsEditing(false);
    if (editName.trim() && editName !== node.name) {
      const sceneNode = sceneGraph.getNode(nodeId);
      if (sceneNode) {
        commandManager.executeCommand(new RenameCommand(sceneNode.node, editName.trim()));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(node.name);
    }
  };

  return (
    <div className="relative">
      {dropIndicator === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 z-10 pointer-events-none" />
      )}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ paddingLeft: 8 + depth * 12 }}
        onClick={handleSelect}
        className={cn(
          'flex items-center justify-between py-1 pr-2 rounded cursor-pointer group text-[11px] relative',
          isSelected ? 'bg-indigo-600/30 text-indigo-300' : 'hover:bg-[#1f232d] text-gray-300',
          dropIndicator === 'inside' && 'ring-1 ring-inset ring-indigo-500 bg-indigo-500/10'
        )}
      >
        <div className="flex items-center gap-1.5 overflow-hidden min-w-0">
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="text-gray-500 hover:text-gray-200 shrink-0"
            >
              {expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
          ) : (
            <span className="w-[11px] shrink-0" />
          )}
          <NodeTypeIcon type={node.type} />
          {isEditing ? (
            <input
              autoFocus
              className="bg-[#14161b] text-white px-1 py-0.5 rounded outline-none border border-indigo-500 w-full text-[11px]"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              className={cn('truncate', !node.visibility && 'opacity-40')} 
              onDoubleClick={handleDoubleClick}
            >
              {node.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={toggleVisibility} className="text-gray-400 hover:text-gray-200">
            {node.visibility ? <Eye size={11} /> : <EyeOff size={11} className="text-rose-400" />}
          </button>
          <button onClick={toggleLock} className="text-gray-400 hover:text-gray-200">
            {node.locked ? <Lock size={11} className="text-amber-400" /> : <Unlock size={11} />}
          </button>
        </div>
      </div>

      {dropIndicator === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 z-10 pointer-events-none" />
      )}

      {expanded && hasChildren && node.children.map((childId) => (
        <LayerRow key={childId} nodeId={childId} depth={depth + 1} />
      ))}
    </div>
  );
};

export const ToolboxPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('layers');
  const nodes = useSceneStore((s) => s.nodes);

  // Get root nodes in correct z-index order from SceneGraph
  const rootNodes = sceneGraph.getRootNodes()
    .map(sn => nodes.find(n => n.id === sn.node.id))
    .filter(Boolean) as any[];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as SidebarTab);
    eventBus.emit(SystemEventType.SIDEBAR_TAB_CHANGED, { tabId });
  };

  const tabs: { id: SidebarTab; label: string; }[] = [
    { id: 'pages', label: 'Pages' },
    { id: 'layers', label: 'Layers' },
    { id: 'components', label: 'Components' },
    { id: 'icons', label: 'Icons' },
    { id: 'assets', label: 'Assets' },
  ];

  const pages = useSceneStore((s) => s.pages);
  const activePageId = useSceneStore((s) => s.activePageId);
  const setPages = useSceneStore((s) => s.setPages);
  const setActivePage = useSceneStore((s) => s.setActivePageId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const commitEdit = () => {
    if (editingId) {
      setPages(pages.map(p => p.id === editingId ? { ...p, name: editName || 'Untitled' } : p));
      setEditingId(null);
    }
  };

  const handleAddPage = (parentId: string | null = null) => {
    const newId = Math.random().toString(36).substring(7);
    setPages([...pages, { id: newId, name: 'New Page', type: 'page', parentId }]);
    setActivePage(newId);
    setEditingId(newId);
    setEditName('New Page');
  };

  const handleAddDirectory = () => {
    const newId = Math.random().toString(36).substring(7);
    setPages([...pages, { id: newId, name: 'New Directory', type: 'directory', parentId: null, expanded: true }]);
    setActivePage(newId);
    setEditingId(newId);
    setEditName('New Directory');
  };

  const handleAddFile = () => {
    const active = pages.find(p => p.id === activePageId);
    if (active && active.type === 'directory') {
      handleAddPage(active.id);
    } else {
      handleAddPage(active?.parentId || null);
    }
  };

  const toggleDir = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPages(pages.map(p => p.id === id ? { ...p, expanded: !p.expanded } : p));
  };

  const renderPageItem = (p: PageItem, depth: number) => {
    const isEditing = editingId === p.id;
    return (
      <div key={p.id}>
        <div
          onClick={() => setActivePage(p.id)}
          onDoubleClick={() => { setEditingId(p.id); setEditName(p.name); }}
          style={{ paddingLeft: 8 + depth * 12 }}
          className={cn(
            'flex items-center gap-2 pr-2 py-1.5 rounded cursor-pointer text-[11px] transition-colors group',
            activePageId === p.id ? 'bg-[#232733] text-gray-200' : 'text-gray-400 hover:bg-[#1f232d] hover:text-gray-300'
          )}
        >
          {p.type === 'directory' ? (
            <button onClick={(e) => toggleDir(p.id, e)} className="text-gray-500 hover:text-gray-200 shrink-0">
              {p.expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
          ) : (
            <span className="w-[11px] shrink-0" />
          )}
          {p.type === 'directory' ? <Folder size={13} className="shrink-0" /> : <FileCode size={13} className="shrink-0" />}
          
          {isEditing ? (
            <input 
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={e => e.key === 'Enter' && commitEdit()}
              className="bg-[#0e0f12] text-white px-1 outline-none border border-indigo-500 rounded w-full"
            />
          ) : (
            <span className="truncate">{p.name}</span>
          )}
        </div>
        {p.type === 'directory' && p.expanded && pages.filter(child => child.parentId === p.id).map(child => renderPageItem(child, depth + 1))}
      </div>
    );
  };

  const handleComponentDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/x-visualstack-component', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // ── Icon browser state ────────────────────────────────────────────────────
  const [iconSearch, setIconSearch] = useState('');
  const [iconCategory, setIconCategory] = useState('All');
  const filteredIcons = useMemo(() => {
    return ICON_NAMES.filter(icon => {
      const matchesSearch = icon.name.toLowerCase().includes(iconSearch.toLowerCase());
      const matchesCategory = iconCategory === 'All' || icon.category === iconCategory;
      return matchesSearch && matchesCategory;
    });
  }, [iconSearch, iconCategory]);

  const handleIconDragStart = useCallback((e: React.DragEvent, icon: { name: string; svgPath: string }) => {
    e.dataTransfer.setData('application/x-visualstack-icon', JSON.stringify(icon));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // ── Asset image browser state ─────────────────────────────────────────────
  const [assets, setAssets] = useState<{ id: string; name: string; src: string }[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addAssetFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setAssets(prev => [...prev, { id: crypto.randomUUID(), name: file.name, src }]);
    };
    reader.readAsDataURL(file);
  }, []);

  const addAssetFromUrl = useCallback(() => {
    const url = urlInput.trim();
    if (!url) return;
    const name = url.split('/').pop()?.split('?')[0] || 'image';
    setAssets(prev => [...prev, { id: crypto.randomUUID(), name, src: url }]);
    setUrlInput('');
  }, [urlInput]);

  const removeAsset = useCallback((id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleAssetDragStart = useCallback((e: React.DragEvent, src: string, name: string) => {
    e.dataTransfer.setData('application/x-visualstack-image', JSON.stringify({ src, name }));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  return (
    <div className="h-full bg-[#14161b] text-gray-300 flex flex-col overflow-hidden select-none border-r border-[#232733]">
      {/* Tab Bar */}
      <div className="flex border-b border-[#232733] bg-[#0e0f12] px-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className={cn(
              'px-4 py-3 text-[11px] font-medium transition-colors border-b-2',
              activeTab === t.id ? 'text-gray-100 border-indigo-500' : 'text-gray-500 border-transparent hover:text-gray-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {activeTab === 'layers' && (
          <div className="flex flex-col h-full">
            {/* Layers Section */}
            <div className="p-2 flex-1 overflow-y-auto">
              <div className="text-[11px] font-semibold text-gray-300 mb-2 px-1">Desktop - 1440</div>
              {rootNodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-center text-[11px] px-4">
                  <Layers size={24} className="mb-2 opacity-30" />
                  <p>No layers yet.</p>
                  <p className="mt-1">Use the toolbar to draw shapes.</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {rootNodes.map((n) => (
                    <LayerRow key={n.id} nodeId={n.id} depth={0} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-3 p-1">
            <div>
              <h5 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Images</h5>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-14 rounded bg-[#0e0f12] border border-[#232733] flex items-center justify-center text-[10px] text-gray-500 hover:border-indigo-500 cursor-pointer transition-colors">
                  hero_bg.png
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="flex flex-col h-full">
            <div className="p-2 flex-1 overflow-y-auto space-y-0.5">
              {pages.length === 0 ? (
                <div className="text-gray-600 text-center text-[10px] py-4">No pages yet</div>
              ) : (
                pages.filter(p => !p.parentId).map(p => renderPageItem(p, 0))
              )}
            </div>
            
            {/* Bottom Toolbar */}
            <div className="p-2 border-t border-[#232733] flex items-center gap-2 bg-[#0e0f12] shrink-0">
              <button onClick={() => handleAddPage(null)} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1f232d] rounded transition-colors" title="Add Root Page">
                <Plus size={14} />
              </button>
              <div className="w-px h-3 bg-[#2d3142]" />
              <button onClick={handleAddDirectory} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1f232d] rounded transition-colors" title="New Folder">
                <Folder size={14} />
              </button>
              <button onClick={handleAddFile} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-[#1f232d] rounded transition-colors" title="New Page under active folder">
                <FileCode size={14} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="flex flex-col space-y-4 p-2">
            {Object.values(COMPONENT_CATEGORIES)
              .sort((a, b) => a.priority - b.priority)
              .map((category) => {
                const categoryComponents = componentRegistry.getByCategory(category.id);
                if (categoryComponents.length === 0) return null;

                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 mb-2 px-1 text-gray-400">
                      <ComponentIcon name={category.icon} size={12} />
                      <h5 className="text-[10px] font-semibold uppercase tracking-wider">{category.title}</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryComponents.map((comp) => (
                        <div
                          key={comp.id}
                          draggable
                          onDragStart={(e) => handleComponentDragStart(e, comp.id)}
                          className="p-2 rounded bg-[#0e0f12] border border-[#232733] text-gray-300 hover:border-indigo-500 cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 transition-colors group"
                          title={comp.description}
                        >
                          <ComponentIcon name={comp.icon} size={16} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
                          <span className="text-[10px] text-center w-full truncate">{comp.displayName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-2 p-1 text-[11px]">
            <div className="flex items-center justify-between p-1.5 bg-[#0e0f12] rounded border border-[#232733]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                accent-primary
              </span>
              <span className="font-mono text-gray-500">#6366f1</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-[#0e0f12] rounded border border-[#232733]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#14161b] border border-[#363c4e] inline-block" />
                bg-primary
              </span>
              <span className="font-mono text-gray-500">#14161b</span>
            </div>
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-2 space-y-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-[#0e0f12] border border-[#232733] rounded px-2 py-1.5">
                <Search size={11} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={iconSearch}
                  onChange={e => setIconSearch(e.target.value)}
                  className="bg-transparent text-[11px] text-gray-300 outline-none flex-1 placeholder-gray-600"
                />
                {iconSearch && (
                  <button onClick={() => setIconSearch('')} className="text-gray-500 hover:text-gray-300">
                    <X size={10} />
                  </button>
                )}
              </div>
              {/* Category filter */}
              <div className="flex flex-wrap gap-1">
                {['All', ...ICON_CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setIconCategory(cat)}
                    className={cn(
                      'text-[9px] px-1.5 py-0.5 rounded-full transition-colors',
                      iconCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1f232d] text-gray-400 hover:text-gray-200'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredIcons.length === 0 ? (
                <div className="text-[11px] text-gray-600 text-center py-8">No icons found</div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  {filteredIcons.map(icon => (
                    <div
                      key={icon.name}
                      draggable
                      onDragStart={e => handleIconDragStart(e, icon)}
                      title={icon.name}
                      className="aspect-square rounded bg-[#0e0f12] border border-[#232733] flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing hover:border-indigo-500 hover:bg-[#1a1b2e] transition-colors group p-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors"
                        dangerouslySetInnerHTML={{ __html: icon.svgPath }}
                      />
                      <span className="text-[8px] text-gray-600 group-hover:text-gray-400 truncate w-full text-center">{icon.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="p-2 space-y-2 shrink-0 border-b border-[#232733]">
              <div className="flex gap-1.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] rounded transition-colors flex-1 justify-center"
                >
                  <Upload size={11} /> Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => { Array.from(e.target.files || []).forEach(addAssetFromFile); e.target.value = ''; }}
                />
              </div>
              <div className="flex gap-1.5">
                <div className="flex items-center gap-1.5 flex-1 bg-[#0e0f12] border border-[#232733] rounded px-2 py-1.5">
                  <Link size={10} className="text-gray-500 shrink-0" />
                  <input
                    type="text"
                    placeholder="Paste image URL..."
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addAssetFromUrl()}
                    className="bg-transparent text-[11px] text-gray-300 outline-none flex-1 placeholder-gray-600"
                  />
                </div>
                <button
                  onClick={addAssetFromUrl}
                  className="px-2 py-1.5 bg-[#1f232d] hover:bg-[#2a3045] text-gray-300 text-[11px] rounded transition-colors border border-[#232733]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Asset grid */}
            <div className="flex-1 overflow-y-auto p-2">
              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-600 text-center text-[11px] px-4">
                  <ImageIcon size={24} className="mb-2 opacity-30" />
                  <p>No images yet.</p>
                  <p className="mt-1">Upload an image or paste a URL above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {assets.map(asset => (
                    <div
                      key={asset.id}
                      draggable
                      onDragStart={e => handleAssetDragStart(e, asset.src, asset.name)}
                      className="relative group rounded overflow-hidden border border-[#232733] hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-colors aspect-square bg-[#0e0f12]"
                    >
                      <img
                        src={asset.src}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = ''; }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                        <span className="text-[9px] text-white truncate flex-1 mr-1">{asset.name}</span>
                        <button
                          onClick={e => { e.stopPropagation(); removeAsset(asset.id); }}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'variables' && (
          <div className="space-y-2 p-1 text-[11px]">
            <div className="flex items-center justify-between p-1.5 bg-[#0e0f12] rounded border border-[#232733]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                accent-primary
              </span>
              <span className="font-mono text-gray-500">#6366f1</span>
            </div>
            <div className="flex items-center justify-between p-1.5 bg-[#0e0f12] rounded border border-[#232733]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#14161b] border border-[#363c4e] inline-block" />
                bg-primary
              </span>
              <span className="font-mono text-gray-500">#14161b</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
