import { create } from 'zustand';
import { sceneGraph } from '../features/designer/scenegraph/SceneGraph';
import { selectionManager } from '../features/designer/selection/SelectionManager';
import type { DesignerNode } from '../features/designer/models/DesignerNode';

export interface SceneNodeSnapshot {
  id: string;
  name: string;
  type: string;
  parent: string | null;
  children: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  visibility: boolean;
  locked: boolean;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  opacity: number;
  textContent: string;
  src?: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  textAlign: string;
  margin: number;
  padding: number;
  layoutConfig?: {
    enabled: boolean;
    direction: 'row' | 'column';
    gap: number;
    padding: { top: number; right: number; bottom: number; left: number };
    justify: 'start' | 'center' | 'end' | 'space-between';
    align: 'start' | 'center' | 'end' | 'stretch';
    widthMode: 'fixed' | 'hug' | 'fill';
    heightMode: 'fixed' | 'hug' | 'fill';
  };
}

function toSnapshot(node: DesignerNode): SceneNodeSnapshot {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    parent: node.parent,
    children: [...node.children],
    position: { ...node.position },
    size: { ...node.size },
    rotation: node.rotation,
    visibility: node.visibility,
    locked: node.locked,
    fill: node.nodeStyle.fill,
    stroke: node.nodeStyle.stroke,
    strokeWidth: node.nodeStyle.strokeWidth,
    cornerRadius: node.nodeStyle.cornerRadius,
    opacity: node.opacity,
    textContent: node.textContent,
    src: (node as any).src,
    fontFamily: node.nodeStyle.fontFamily,
    fontSize: node.nodeStyle.fontSize,
    fontWeight: node.nodeStyle.fontWeight,
    textAlign: node.nodeStyle.textAlign,
    margin: node.nodeStyle.margin,
    padding: node.nodeStyle.padding,
    layoutConfig: (node as any).layoutConfig ? { ...(node as any).layoutConfig } : undefined,
  };
}

export type PageItemType = 'page' | 'directory';
export interface PageItem {
  id: string;
  name: string;
  type: PageItemType;
  parentId: string | null;
  expanded?: boolean;
}

interface SceneState {
  nodes: SceneNodeSnapshot[];
  version: number;
  pages: PageItem[];
  activePageId: string | null;
  designerNodesByPage: Record<string, DesignerNode[]>;
  
  syncFromSceneGraph: () => void;
  upsertNode: (node: DesignerNode) => void;
  removeNode: (id: string) => void;
  updateNodeProperty: (id: string, patch: Partial<SceneNodeSnapshot>) => void;
  getNodeById: (id: string) => SceneNodeSnapshot | undefined;
  
  setPages: (pages: PageItem[]) => void;
  setActivePageId: (id: string | null) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  nodes: [],
  version: 0,
  pages: [],
  activePageId: null,
  designerNodesByPage: {},

  setPages: (pages) => set({ pages }),
  setActivePageId: (id) => {
    set((state) => {
      if (state.activePageId === id) return state;
      
      const currentDesignerNodes = sceneGraph.getAllNodes().map(n => n.node);
      const nextDesignerNodesByPage = { ...state.designerNodesByPage };
      
      if (state.activePageId) {
        nextDesignerNodesByPage[state.activePageId] = currentDesignerNodes;
      }
      
      sceneGraph.clear();
      
      if (id) {
        const nextNodes = nextDesignerNodesByPage[id] || [];
        nextNodes.forEach(node => sceneGraph.addNode(node));
      }
      
      const allNodes = sceneGraph.getAllNodes().map((sn) => toSnapshot(sn.node));
      
      // Also need to clear selection
      selectionManager.clearSelection();

      return {
        activePageId: id,
        designerNodesByPage: nextDesignerNodesByPage,
        nodes: allNodes,
        version: state.version + 1
      };
    });
  },

  syncFromSceneGraph: () => {
    const allNodes = sceneGraph.getAllNodes().map((sn) => toSnapshot(sn.node));
    set({ nodes: allNodes, version: get().version + 1 });
  },

  upsertNode: (node: DesignerNode) => {
    const snapshot = toSnapshot(node);
    set((state) => {
      const existing = state.nodes.findIndex((n) => n.id === node.id);
      if (existing >= 0) {
        const updated = [...state.nodes];
        updated[existing] = snapshot;
        return { nodes: updated, version: state.version + 1 };
      }
      return { nodes: [...state.nodes, snapshot], version: state.version + 1 };
    });
  },

  removeNode: (id: string) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      version: state.version + 1,
    }));
  },

  updateNodeProperty: (id: string, patch: Partial<SceneNodeSnapshot>) => {
    set((state) => {
      const nodes = state.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
      return { nodes, version: state.version + 1 };
    });
    // Also update the live DesignerNode in the SceneGraph
    const sceneNode = sceneGraph.getNode(id);
    if (sceneNode) {
      const node = sceneNode.node;
      if (patch.position !== undefined) node.position = patch.position;
      if (patch.size !== undefined) node.size = patch.size;
      if (patch.rotation !== undefined) node.rotation = patch.rotation;
      if (patch.opacity !== undefined) {
        node.opacity = patch.opacity;
        node.nodeStyle.opacity = patch.opacity;
      }
      if (patch.visibility !== undefined) node.visibility = patch.visibility;
      if (patch.locked !== undefined) node.locked = patch.locked;
      if (patch.fill !== undefined) node.nodeStyle.fill = patch.fill;
      if (patch.stroke !== undefined) node.nodeStyle.stroke = patch.stroke;
      if (patch.strokeWidth !== undefined) node.nodeStyle.strokeWidth = patch.strokeWidth;
      if (patch.cornerRadius !== undefined) node.nodeStyle.cornerRadius = patch.cornerRadius;
      if (patch.textContent !== undefined) node.textContent = patch.textContent;
      if (patch.name !== undefined) node.name = patch.name;
      if ((patch as any).src !== undefined) (node as any).src = (patch as any).src;
      if (patch.fontFamily !== undefined) node.nodeStyle.fontFamily = patch.fontFamily;
      if (patch.fontSize !== undefined) node.nodeStyle.fontSize = patch.fontSize;
      if (patch.fontWeight !== undefined) node.nodeStyle.fontWeight = patch.fontWeight;
      if (patch.textAlign !== undefined) node.nodeStyle.textAlign = patch.textAlign;
      if (patch.margin !== undefined) node.nodeStyle.margin = patch.margin;
      if (patch.padding !== undefined) node.nodeStyle.padding = patch.padding;
      if ('layoutConfig' in patch) {
        (node as any).layoutConfig = (patch as any).layoutConfig 
          ? { ...((node as any).layoutConfig || {}), ...(patch as any).layoutConfig }
          : undefined;
      }
    }
  },

  getNodeById: (id: string) => {
    return get().nodes.find((n) => n.id === id);
  },
}));
