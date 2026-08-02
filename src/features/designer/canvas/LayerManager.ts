import Konva from 'konva';

export class LayerManager {
  public backgroundLayer: Konva.Layer;
  public gridLayer: Konva.Layer;
  public componentLayer: Konva.Layer;
  public selectionLayer: Konva.Layer;
  public guideLayer: Konva.Layer;
  public uiLayer: Konva.Layer;
  public debugLayer: Konva.Layer;

  constructor(stage: Konva.Stage) {
    this.backgroundLayer = new Konva.Layer();
    this.gridLayer = new Konva.Layer();
    this.componentLayer = new Konva.Layer();
    this.selectionLayer = new Konva.Layer();
    this.guideLayer = new Konva.Layer();
    this.uiLayer = new Konva.Layer();
    this.debugLayer = new Konva.Layer();

    stage.add(this.backgroundLayer);
    stage.add(this.gridLayer);
    stage.add(this.componentLayer);
    stage.add(this.selectionLayer);
    stage.add(this.guideLayer);
    stage.add(this.uiLayer);
    stage.add(this.debugLayer);
  }

  public batchDraw(): void {
    this.gridLayer.batchDraw();
    this.componentLayer.batchDraw();
    this.selectionLayer.batchDraw();
    this.uiLayer.batchDraw();
  }

  public clearOverlayLayers(): void {
    this.selectionLayer.destroyChildren();
    this.uiLayer.destroyChildren();
    this.guideLayer.destroyChildren();
  }
}
