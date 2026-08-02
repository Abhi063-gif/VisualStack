export class SelectionRenderer {
  public static getSelectionBoxStyle() {
    return {
      fill: 'rgba(99, 102, 241, 0.12)', // Figma style indigo/blue translucent fill
      stroke: '#6366f1',
      strokeWidth: 1,
      dash: [],
    };
  }
}

export class HandleRenderer {
  public static getHandleStyle(isRotation = false) {
    return {
      fill: '#ffffff',
      stroke: '#6366f1',
      strokeWidth: 1.5,
      radius: isRotation ? 4 : 3.5,
    };
  }
}

export class GuideRenderer {
  public static getGuideStyle() {
    return {
      stroke: '#ec4899', // Magenta alignment guide color
      strokeWidth: 1,
      dash: [4, 4],
    };
  }
}

export class OverlayRenderer {
  public static getOutlineStyle() {
    return {
      stroke: '#6366f1',
      strokeWidth: 1.5,
    };
  }
}
