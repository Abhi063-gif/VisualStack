import { BaseCommand } from '../../../core/commands/Command';
import { viewportManager } from '../viewport/ViewportManager';
import { selectionManager } from '../selection/SelectionManager';

export class PanCommand extends BaseCommand {
  private prevX: number;
  private prevY: number;
  private newX: number;
  private newY: number;

  constructor(prevX: number, prevY: number, newX: number, newY: number) {
    super('Pan Viewport');
    this.prevX = prevX;
    this.prevY = prevY;
    this.newX = newX;
    this.newY = newY;
  }

  public execute(): void {
    viewportManager.camera.setPosition(this.newX, this.newY);
  }

  public undo(): void {
    viewportManager.camera.setPosition(this.prevX, this.prevY);
  }
}

export class ZoomCommand extends BaseCommand {
  private prevZoom: number;
  private newZoom: number;

  constructor(prevZoom: number, newZoom: number) {
    super('Zoom Viewport');
    this.prevZoom = prevZoom;
    this.newZoom = newZoom;
  }

  public execute(): void {
    viewportManager.camera.setZoom(this.newZoom);
  }

  public undo(): void {
    viewportManager.camera.setZoom(this.prevZoom);
  }
}

export class SelectionCommand extends BaseCommand {
  private prevSelection: string[];
  private newSelection: string[];

  constructor(prevSelection: string[], newSelection: string[]) {
    super('Change Canvas Selection');
    this.prevSelection = prevSelection;
    this.newSelection = newSelection;
  }

  public execute(): void {
    selectionManager.selectedIds = [...this.newSelection];
  }

  public undo(): void {
    selectionManager.selectedIds = [...this.prevSelection];
  }
}

export class ViewportCommand extends BaseCommand {
  private prevCam: { x: number; y: number; zoom: number };
  private newCam: { x: number; y: number; zoom: number };

  constructor(
    prevCam: { x: number; y: number; zoom: number },
    newCam: { x: number; y: number; zoom: number }
  ) {
    super('Update Viewport Camera');
    this.prevCam = prevCam;
    this.newCam = newCam;
  }

  public execute(): void {
    viewportManager.camera.setPosition(this.newCam.x, this.newCam.y);
    viewportManager.camera.setZoom(this.newCam.zoom);
  }

  public undo(): void {
    viewportManager.camera.setPosition(this.prevCam.x, this.prevCam.y);
    viewportManager.camera.setZoom(this.prevCam.zoom);
  }
}
