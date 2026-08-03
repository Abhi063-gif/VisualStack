export type ExportTargetFormat = 'zip' | 'docker' | 'desktop' | 'web' | 'server';

export class ProjectExporter {
  public async exportProject(format: ExportTargetFormat): Promise<{ blobUrl: string; filename: string }> {
    const filename = `visualstack_export_${format}_${Date.now()}.${format === 'zip' ? 'zip' : 'tar.gz'}`;
    return {
      blobUrl: '#',
      filename,
    };
  }
}

export const projectExporter = new ProjectExporter();
