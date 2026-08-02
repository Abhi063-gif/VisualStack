export interface ComponentMetadata {
  id: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  preview?: string;
  keywords: string[];
  defaultWidth: number;
  defaultHeight: number;
  minimumWidth: number;
  minimumHeight: number;
  supportsChildren: boolean;
  supportsText: boolean;
  supportsImage: boolean;
  supportsLayout: boolean;
  supportsRotation: boolean;
  supportsEffects: boolean;
  supportedParentTypes?: string[];
  supportedChildTypes?: string[];
}
