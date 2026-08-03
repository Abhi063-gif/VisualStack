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
  private uncommittedFiles: GitFileStatus[] = [];
  private commitHistory: GitCommitItem[] = [];
  private branches: string[] = ['main'];
  private stashes: Array<{ id: string; message: string; date: string }> = [];

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

  public addFileChange(path: string, status: GitFileStatus['status'], additions = 0, deletions = 0): void {
    const existing = this.uncommittedFiles.find((f) => f.path === path);
    if (existing) {
      existing.status = status;
      existing.additions += additions;
      existing.deletions += deletions;
    } else {
      this.uncommittedFiles.push({ path, status, staged: false, additions, deletions });
    }
  }

  public commit(message: string, isAmend = false): GitCommitItem {
    const hash = Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
    const item: GitCommitItem = {
      hash,
      shortHash: hash.slice(0, 7),
      author: 'Developer',
      email: 'dev@visualstack.io',
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
        { type: 'context', lineNumberOld: 1, lineNumberNew: 1, content: `// File: ${filePath}` },
        { type: 'add', lineNumberNew: 2, content: '+ // Modified in VisualStack Studio' },
      ],
    };
  }
}

export const gitManager = new GitManager();
