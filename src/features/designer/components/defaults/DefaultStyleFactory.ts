import type { NodeStyle } from '../../nodes/base/BaseDesignerNode';
import { DEFAULT_STYLE } from '../../nodes/base/BaseDesignerNode';

export class DefaultStyleFactory {
  public static getStyle(type: string): Partial<NodeStyle> {
    switch (type) {
      case 'Rectangle':
        return {
          ...DEFAULT_STYLE,
          fill: '#6366F1',
          cornerRadius: 12,
          strokeWidth: 0,
          shadow: true,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 10,
        };
      case 'Circle':
      case 'Ellipse':
        return {
          ...DEFAULT_STYLE,
          fill: '#6366F1',
          strokeWidth: 0,
        };
      case 'Line':
      case 'Arrow':
        return {
          ...DEFAULT_STYLE,
          strokeWidth: 2,
          stroke: '#E4E4E7', // standard visible color
          fill: 'transparent',
        };
      case 'Button':
        return {
          ...DEFAULT_STYLE,
          padding: 16,
          cornerRadius: 10,
          fontFamily: 'Inter',
          fontWeight: 600,
          fill: '#6366F1', // background
          strokeWidth: 0,
          textAlign: 'center',
        };
      case 'Text':
      case 'Heading':
      case 'Paragraph':
        return {
          ...DEFAULT_STYLE,
          fontFamily: 'Inter',
          fontSize: type === 'Heading' ? 24 : 16,
          fontWeight: type === 'Heading' ? 700 : 400,
          fill: '#E4E4E7', // text color
          strokeWidth: 0,
        };
      case 'Container':
      case 'Frame':
      case 'Section':
        return {
          ...DEFAULT_STYLE,
          fill: 'transparent',
          strokeWidth: 0,
        };
      case 'Card':
        return {
          ...DEFAULT_STYLE,
          cornerRadius: 16,
          shadow: true,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 20,
          fill: '#18181B',
          strokeWidth: 0,
        };
      default:
        return { ...DEFAULT_STYLE };
    }
  }
}
