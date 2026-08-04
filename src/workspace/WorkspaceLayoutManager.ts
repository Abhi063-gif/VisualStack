export interface WorkspaceProfile {
  id: string;
  name: string;
  leftPanelWidth: number;
  rightPanelWidth: number;
  bottomPanelHeight: number;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isBottomPanelOpen: boolean;
}

export const WORKSPACE_PRESETS: WorkspaceProfile[] = [
  {
    id: 'default_fullstack',
    name: 'Fullstack Engineer Preset',
    leftPanelWidth: 280,
    rightPanelWidth: 320,
    bottomPanelHeight: 240,
    isLeftPanelOpen: true,
    isRightPanelOpen: true,
    isBottomPanelOpen: false,
  },
  {
    id: 'designer_focus',
    name: 'Canvas Designer Focus',
    leftPanelWidth: 240,
    rightPanelWidth: 260,
    bottomPanelHeight: 0,
    isLeftPanelOpen: true,
    isRightPanelOpen: true,
    isBottomPanelOpen: false,
  },
  {
    id: 'backend_focus',
    name: 'Backend Workflow Focus',
    leftPanelWidth: 300,
    rightPanelWidth: 340,
    bottomPanelHeight: 280,
    isLeftPanelOpen: true,
    isRightPanelOpen: true,
    isBottomPanelOpen: true,
  },
  {
    id: 'split_monaco',
    name: 'Split Monaco Code View',
    leftPanelWidth: 200,
    rightPanelWidth: 400,
    bottomPanelHeight: 300,
    isLeftPanelOpen: true,
    isRightPanelOpen: true,
    isBottomPanelOpen: true,
  },
];

export class WorkspaceLayoutManager {
  private activeProfile: WorkspaceProfile = { ...WORKSPACE_PRESETS[0] };
  private listeners: Set<() => void> = new Set();

  public getActiveProfile(): WorkspaceProfile {
    return { ...this.activeProfile };
  }

  public applyPreset(presetId: string): WorkspaceProfile {
    const preset = WORKSPACE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      this.activeProfile = { ...preset };
      this.listeners.forEach((fn) => fn());
    }
    return { ...this.activeProfile };
  }

  public updateProfile(patch: Partial<WorkspaceProfile>): WorkspaceProfile {
    this.activeProfile = { ...this.activeProfile, ...patch };
    this.listeners.forEach((fn) => fn());
    return { ...this.activeProfile };
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const workspaceLayoutManager = new WorkspaceLayoutManager();
