export interface AlignmentGuide {
  id: string;
  type: 'horizontal' | 'vertical';
  position: number;
  label?: string;
}

export class GuideManager {
  private static instance: GuideManager;
  private guides: AlignmentGuide[] = [];

  private constructor() {}

  public static getInstance(): GuideManager {
    if (!GuideManager.instance) {
      GuideManager.instance = new GuideManager();
    }
    return GuideManager.instance;
  }

  public addGuide(guide: AlignmentGuide): void {
    this.guides.push(guide);
  }

  public clearGuides(): void {
    this.guides = [];
  }

  public getGuides(): ReadonlyArray<AlignmentGuide> {
    return this.guides;
  }
}

export const guideManager = GuideManager.getInstance();
