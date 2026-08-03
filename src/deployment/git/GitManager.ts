export interface GitFileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked' | 'staged';
  staged: boolean;
  additions: number;
  deletions: number;
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

export interface GitDiffLine {
  type: 'add' | 'delete' | 'context';
  lineNumberOld?: number;
  lineNumberNew?: number;
  content: string;
}

export interface GitDiffResult {
  filePath: string;
  lines: GitDiffLine[];
}

export class GitManager {
  private currentBranch = 'main';
  private remoteUrl = 'https://github.com/Abhi063-gif/VisualStack.git';
  
  private uncommittedFiles: GitFileStatus[] = [
    { path: 'src/features/designer/Canvas.tsx', status: 'modified', staged: true, additions: 14, deletions: 2 },
    { path: 'src/components/layout/AppLayout.tsx', status: 'modified', staged: true, additions: 28, deletions: 12 },
    { path: 'src/deployment/git/GitManager.ts', status: 'added', staged: false, additions: 110, deletions: 0 },
  ];

  private commitHistory: GitCommitItem[] = [
    {
      hash: '7167aa48192a7e4d82',
      shortHash: '7167aa4',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date().toISOString(),
      message: 'feat(module-08): Complete Phase 1 - Deployment Center Core & 18 Provider Connectors',
      branch: 'main',
    },
    {
      hash: '25ef8c1289a19e831',
      shortHash: '25ef8c1',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date(Date.now() - 1800000).toISOString(),
      message: 'feat(module-08): Complete Module 08 Deployment Engine architecture',
      branch: 'main',
    },
    {
      hash: 'ff65dbb8192a7e4d82',
      shortHash: 'ff65dbb',
      author: 'Antigravity AI',
      email: 'devops@visualstack.io',
      date: new Date(Date.now() - 3600000).toISOString(),
      message: 'fix(layout): Restore exact VisualStack Studio frontend layout structure',
      branch: 'main',
    },
  ];

  private branches: string[] = ['main', 'feature/module-08-devops', 'staging', 'production'];
  private stashes: Array<{ id: string; message: string; date: string }> = [
    { id: 'stash@{0}', message: 'WIP on main: Auto-save canvas state', date: new Date(Date.now() - 7200000).toISOString() },
  ];

  public getCurrentBranch(): string { return this.currentBranch; }
  public getRemoteUrl(): string { return this.remoteUrl; }
  public getUncommittedFiles(): GitFileStatus[] { return [...this.uncommittedFiles]; }
  public getCommitHistory(): GitCommitItem[] { return [...this.commitHistory]; }
  public getBranches(): string[] { return [...this.branches]; }
  public getStashes() { return [...this.stashes]; }

  public stageFile(path: string): void {
    const item = this.uncommittedFiles.find((f) => f.path === path);
    if (item) item.staged = true;
  }

  public unstageFile(path: string): void {
    const item = this.uncommittedFiles.find((f) => f.path === path);
    if (item) item.staged = false;
  }

  public stageAll(): void {
    this.uncommittedFiles.forEach((f) => (f.staged = true));
  }

  public unstageAll(): void {
    this.uncommittedFiles.forEach((f) => (f.staged = false));
  }

  public commit(message: string, isAmend = false): GitCommitItem {
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

    if (isAmend && this.commitHistory.length > 0) {
      this.commitHistory[0] = item;
    } else {
      this.commitHistory.unshift(item);
    }
    
    this.uncommittedFiles = this.uncommittedFiles.filter((f) => !f.staged);
    return item;
  }

  public push(_remote = 'origin', _branch = this.currentBranch): boolean {
    return true;
  }

  public pull(_remote = 'origin', _branch = this.currentBranch): boolean {
    return true;
  }

  public fetch(): boolean {
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

  public stash(message = `WIP on ${this.currentBranch}`): boolean {
    if (this.uncommittedFiles.length > 0) {
      this.stashes.unshift({
        id: `stash@{${this.stashes.length}}`,
        message,
        date: new Date().toISOString(),
      });
      this.uncommittedFiles = [];
      return true;
    }
    return false;
  }

  public popStash(): boolean {
    if (this.stashes.length > 0) {
      this.stashes.shift();
      return true;
    }
    return false;
  }

  public getDiff(filePath: string): GitDiffResult {
    return {
      filePath,
      lines: [
        { type: 'context', lineNumberOld: 1, lineNumberNew: 1, content: 'import React from "react";' },
        { type: 'delete', lineNumberOld: 2, content: '- const version = "1.0.0";' },
        { type: 'add', lineNumberNew: 2, content: '+ const version = "2.0.0-module-08";' },
        { type: 'context', lineNumberOld: 3, lineNumberNew: 3, content: 'export const App = () => {};' },
      ],
    };
  }
}

export const gitManager = new GitManager();
