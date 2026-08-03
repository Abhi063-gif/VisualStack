export interface ReleaseVersion {
  version: string;
  releaseNotes: string;
  createdDate: string;
  downloadUrl: string;
}

export class ReleaseManager {
  private releases: ReleaseVersion[] = [];

  public getReleases(): ReleaseVersion[] {
    return [...this.releases];
  }

  public createRelease(version: string, releaseNotes: string): ReleaseVersion {
    const item: ReleaseVersion = {
      version,
      releaseNotes,
      createdDate: new Date().toISOString(),
      downloadUrl: '#',
    };
    this.releases.unshift(item);
    return item;
  }
}

export const releaseManager = new ReleaseManager();
