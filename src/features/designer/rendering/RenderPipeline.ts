export const RenderPass = {
  BACKGROUND: 'BACKGROUND',
  GRID: 'GRID',
  CONTENT: 'CONTENT',
  OVERLAY: 'OVERLAY',
  UI: 'UI',
} as const;

export type RenderPass = (typeof RenderPass)[keyof typeof RenderPass];

export class RenderPipeline {
  private static instance: RenderPipeline;
  private passOrder: RenderPass[] = [
    RenderPass.BACKGROUND,
    RenderPass.GRID,
    RenderPass.CONTENT,
    RenderPass.OVERLAY,
    RenderPass.UI,
  ];

  private constructor() {}

  public static getInstance(): RenderPipeline {
    if (!RenderPipeline.instance) {
      RenderPipeline.instance = new RenderPipeline();
    }
    return RenderPipeline.instance;
  }

  public getPassOrder(): ReadonlyArray<RenderPass> {
    return this.passOrder;
  }
}

export const renderPipeline = RenderPipeline.getInstance();
