import type { GeneratedFile } from '../CompilerContext';

export class IncrementalGenerator {
  private fileHashes: Map<string, string> = new Map();

  public processIncrementalFiles(files: GeneratedFile[]): GeneratedFile[] {
    const updatedFiles: GeneratedFile[] = [];

    for (const file of files) {
      const currentHash = this.computeHash(file.content);
      const previousHash = this.fileHashes.get(file.path);

      file.hash = currentHash;

      if (previousHash !== currentHash) {
        this.fileHashes.set(file.path, currentHash);
        updatedFiles.push(file);
      }
    }

    return files;
  }

  private computeHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash.toString(36);
  }
}

export const incrementalGenerator = new IncrementalGenerator();
