import { BaseTool } from './Tool';

export class SelectTool extends BaseTool {
  constructor() {
    super('select', 'Select Tool', 'default');
  }
}

export class HandTool extends BaseTool {
  constructor() {
    super('hand', 'Hand Tool', 'grab');
  }
}

export class FrameTool extends BaseTool {
  constructor() {
    super('frame', 'Frame Tool', 'crosshair');
  }
}

export class RectangleTool extends BaseTool {
  constructor() {
    super('rectangle', 'Rectangle Tool', 'crosshair');
  }
}

export class TextTool extends BaseTool {
  constructor() {
    super('text', 'Text Tool', 'text');
  }
}

export class GenericCreationTool extends BaseTool {
  constructor(id: string, name: string) {
    super(id, name, 'crosshair');
  }
}

export class ZoomTool extends BaseTool {
  constructor() {
    super('zoom', 'Zoom Tool', 'zoom-in');
  }
}
