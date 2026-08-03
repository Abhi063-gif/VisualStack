import type { GeneratedFile } from '../CompilerContext';

export interface AssetInfo {
  id: string;
  name: string;
  type: 'image' | 'icon' | 'font' | 'svg' | 'video' | 'audio';
  path: string;
  sizeBytes?: number;
}

export class AssetPipeline {
  private assets: AssetInfo[] = [];

  public registerAsset(asset: AssetInfo): void {
    this.assets.push(asset);
  }

  public exportAssetFiles(): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Export asset index file
    files.push({
      path: 'public/assets/manifest.json',
      type: 'json',
      content: JSON.stringify(
        {
          totalAssets: this.assets.length,
          assets: this.assets,
        },
        null,
        2
      ),
    });

    return files;
  }
}

export const assetPipeline = new AssetPipeline();
