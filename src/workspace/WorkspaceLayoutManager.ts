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

export class WorkspaceLayoutManager {
  private activeProfile: WorkspaceProfile = {
    id: 'default_dev',
    name: 'Fullstack Engineer Profile',
    leftPanelWidth: 280,
    rightPanelWidth: 320,
    bottomPanelHeight: 240,
    isLeftPanelOpen: true,
    isRightPanelOpen: true,
    isBottomPanelOpen: false,
  };

  public getActiveProfile(): WorkspaceProfile {
    return { ...this.activeProfile };
  }

  public updateProfile(patch: Partial<WorkspaceProfile>): WorkspaceProfile {
    this.activeProfile = { ...this.activeProfile, ...patch };
    return this.activeProfile;
  }
}

export const workspaceLayoutManager = new WorkspaceLayoutManager();
