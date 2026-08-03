export interface ReleaseVersion {
  version: string;
  releaseNotes: string;
  createdDate: string;
  downloadUrl: string;
}

export class ReleaseManager {
  private releases: ReleaseVersion[] = [
    {
      version: 'v1.0.0',
      releaseNotes: 'First stable production release powered by VisualStack Studio.',
      createdDate: new Date().toISOString(),
      downloadUrl: '#',
    },
  ];

  public getReleases(): ReleaseVersion[] {
    return [...this.releases];
  }
}

export const releaseManager = new ReleaseManager();
