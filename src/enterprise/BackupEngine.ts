export interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  sizeBytes: number;
  location: 'local' | 'cloud';
}

export class BackupEngine {
  private backups: BackupSnapshot[] = [
    { id: 'bak_1', name: 'AutoBackup_Daily_01', timestamp: new Date().toLocaleTimeString(), sizeBytes: 1048576, location: 'local' },
    { id: 'bak_2', name: 'CloudBackup_PreDeploy', timestamp: new Date().toLocaleTimeString(), sizeBytes: 2097152, location: 'cloud' },
  ];

  public getBackups(): BackupSnapshot[] {
    return [...this.backups];
  }

  public createBackup(name: string, location: 'local' | 'cloud' = 'local'): BackupSnapshot {
    const backup: BackupSnapshot = {
      id: `bak_${Date.now()}`,
      name,
      timestamp: new Date().toLocaleTimeString(),
      sizeBytes: 1572864,
      location,
    };
    this.backups.unshift(backup);
    return backup;
  }
}

export const backupEngine = new BackupEngine();
