import type { Camera } from '../viewport/Camera';
import { CANVAS_CONSTANTS } from '../../../constants/CanvasConstants';

export interface GridLineSpec {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isMajor: boolean;
  opacity: number;
}

export class GridRenderer {
  public static calculateGridLines(
    camera: Camera,
    stageWidth: number,
    stageHeight: number
  ): GridLineSpec[] {
    const lines: GridLineSpec[] = [];
    const baseGridSize = CANVAS_CONSTANTS.GRID_SIZE; // 16px

    // Adaptive step sizing depending on zoom level
    let step = baseGridSize;
    if (camera.zoom < 0.3) {
      step = baseGridSize * 8; // 128px
    } else if (camera.zoom < 0.6) {
      step = baseGridSize * 4; // 64px
    } else if (camera.zoom < 1.2) {
      step = baseGridSize * 2; // 32px
    }

    const startX = Math.floor((-camera.x / camera.zoom) / step) * step;
    const startY = Math.floor((-camera.y / camera.zoom) / step) * step;
    const endX = startX + Math.ceil(stageWidth / (camera.zoom * step)) * step + step * 2;
    const endY = startY + Math.ceil(stageHeight / (camera.zoom * step)) * step + step * 2;

    const opacity = Math.min(Math.max((camera.zoom - 0.15) * 2, 0.2), 1.0);

    for (let x = startX; x <= endX; x += step) {
      const isMajor = Math.abs(x % (step * 4)) < 0.001;
      lines.push({
        x1: x * camera.zoom + camera.x,
        y1: 0,
        x2: x * camera.zoom + camera.x,
        y2: stageHeight,
        isMajor,
        opacity: isMajor ? 0.6 : opacity * 0.35,
      });
    }

    for (let y = startY; y <= endY; y += step) {
      const isMajor = Math.abs(y % (step * 4)) < 0.001;
      lines.push({
        x1: 0,
        y1: y * camera.zoom + camera.y,
        x2: stageWidth,
        y2: y * camera.zoom + camera.y,
        isMajor,
        opacity: isMajor ? 0.6 : opacity * 0.35,
      });
    }

    return lines;
  }
}
