import { CodeGenerator, type CodeExportMode } from './CodeGenerator';
import { useSceneStore } from '../../../stores/SceneStore';

export class ExportService {
  /** Copy current canvas generated code to clipboard */
  public static async copyJSXToClipboard(mode: CodeExportMode = 'react-tailwind'): Promise<boolean> {
    try {
      const code = CodeGenerator.generateCode(mode);
      await navigator.clipboard.writeText(code);
      return true;
    } catch (e) {
      console.error('Failed to copy code to clipboard', e);
      return false;
    }
  }

  /** Download generated code file */
  public static downloadJSXFile(filename = 'CanvasComponent.jsx', mode: CodeExportMode = 'react-tailwind'): void {
    const code = CodeGenerator.generateCode(mode);
    const mimeType = mode === 'html-css' ? 'text/html;charset=utf-8' : 'text/jsx;charset=utf-8';
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /** Export project schema as .vstack JSON file */
  public static downloadProjectVStack(): void {
    const nodes = useSceneStore.getState().nodes;
    const pages = useSceneStore.getState().pages;
    const schema = {
      version: 1,
      meta: {
        name: 'VisualStack Application',
        exportedAt: new Date().toISOString(),
      },
      pages,
      nodes,
    };

    const jsonStr = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'project.vstack';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
