export interface ProjectMeta {
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
}

export interface ComponentNodeMeta {
  id: string;
  name: string;
  type: string;
  parent: string | null;
  children: string[];
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  opacity: number;
  constraints: {
    horizontal: 'left' | 'right' | 'center' | 'stretch';
    vertical: 'top' | 'bottom' | 'center' | 'stretch';
  };
  style: Record<string, unknown>;
  events: Array<{ name: string; targetFlowId?: string }>;
  variables: Record<string, unknown>;
  bindings: Array<{ property: string; expression: string }>;
  animations: Array<{ trigger: string; type: string; config: Record<string, unknown> }>;
  visibility: boolean;
  responsive: {
    tablet?: Partial<ComponentNodeMeta>;
    mobile?: Partial<ComponentNodeMeta>;
  };
}

export interface PageMeta {
  id: string;
  name: string;
  path: string;
  rootComponentId: string;
}

export interface AssetMeta {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'font' | 'media';
  url: string;
  size: number;
}

export interface FrontendProjectModel {
  pages: PageMeta[];
  components: ComponentNodeMeta[];
  assets: AssetMeta[];
}

export interface BackendNodeMeta {
  id: string;
  type: string;
  category: 'Auth' | 'Data' | 'Integration' | 'ControlFlow' | 'Logic' | 'Output';
  label: string;
  position: { x: number; y: number };
  inputs: Array<{ id: string; name: string; dataType: string }>;
  outputs: Array<{ id: string; name: string; dataType: string }>;
  config: Record<string, unknown>;
}

export interface BackendConnectionMeta {
  id: string;
  sourceNodeId: string;
  sourceOutputId: string;
  targetNodeId: string;
  targetInputId: string;
}

export interface BackendProjectModel {
  nodes: BackendNodeMeta[];
  connections: BackendConnectionMeta[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  primaryKey?: boolean;
  nullable?: boolean;
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
}

export interface DatabaseProjectModel {
  tables: DatabaseTable[];
}

export interface DeployConfig {
  target: 'vercel' | 'netlify' | 'docker' | 'firebase' | 'railway' | 'render' | '';
  environment: Record<string, string>;
}

export interface VStackProjectFile {
  version: number;
  meta: ProjectMeta;
  frontend: FrontendProjectModel;
  backend: BackendProjectModel;
  database: DatabaseProjectModel;
  deploy: DeployConfig;
}
