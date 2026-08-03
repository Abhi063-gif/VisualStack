export interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'staged';
  staged: boolean;
}

export interface GitCommitItem {
  hash: string;
  shortHash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  branch: string;
}

export class GitManager {
  private currentBranch = 'main';
  private remoteUrl = 'https://github.com/Abhi063-gif/VisualStack.git';
  private uncommittedFiles: GitFileStatus[] = [
    { path: 'src/features/designer/Canvas.tsx', status: 'modified', staged: true },
    { path: 'src/components/layout/AppLayout.tsx', status: 'modified', staged: true },
  ];

  private commitHistory: GitCommitItem[] = [
    {
      hash: 'ff65dbb8192a7e4d82',
      shortHash: 'ff65dbb',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date().toISOString(),
      message: 'fix(layout): Restore exact VisualStack Studio frontend layout structure',
      branch: 'main',
    },
    {
      hash: 'd5573f7892b1a5e12',
      shortHash: 'd5573f7',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date(Date.now() - 3600000).toISOString(),
      message: 'fix(canvas): Auto-initialize default Desktop artboard frame',
      branch: 'main',
    },
    {
      hash: '28ba894109c12a781',
      shortHash: '28ba894',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date(Date.now() - 7200000).toISOString(),
      message: 'feat(module-07): Complete Module 07 - Local Runtime & Preview Environment',
      branch: 'main',
    },
  ];

  private branches: string[] = ['main', 'feature/module-08-devops', 'staging', 'production'];
  private stashes: string[] = [];

  public getCurrentBranch(): string {
    return this.currentBranch;
  }

  public getRemoteUrl(): string {
    return this.remoteUrl;
  }

  public getUncommittedFiles(): GitFileStatus[] {
    return [...this.uncommittedFiles];
  }

  public getCommitHistory(): GitCommitItem[] {
    return [...this.commitHistory];
  }

  public getBranches(): string[] {
    return [...this.branches];
  }

  public getStashes(): string[] {
    return [...this.stashes];
  }

  public commit(message: string): GitCommitItem {
    const hash = Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
    const item: GitCommitItem = {
      hash,
      shortHash: hash.slice(0, 7),
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date().toISOString(),
      message,
      branch: this.currentBranch,
    };
    this.commitHistory.unshift(item);
    this.uncommittedFiles = [];
    return item;
  }

  public push(): boolean {
    return true;
  }

  public pull(): boolean {
    return true;
  }

  public createBranch(branchName: string): boolean {
    if (!this.branches.includes(branchName)) {
      this.branches.push(branchName);
      this.currentBranch = branchName;
      return true;
    }
    return false;
  }

  public checkoutBranch(branchName: string): boolean {
    if (this.branches.includes(branchName)) {
      this.currentBranch = branchName;
      return true;
    }
    return false;
  }

  public stash(): boolean {
    if (this.uncommittedFiles.length > 0) {
      this.stashes.push(`WIP on ${this.currentBranch}: ${new Date().toLocaleTimeString()}`);
      this.uncommittedFiles = [];
      return true;
    }
    return false;
  }
}

export const gitManager = new GitManager();
