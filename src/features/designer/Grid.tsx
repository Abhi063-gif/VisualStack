import React from 'react';

export interface GridProps {
  width?: number;
  height?: number;
  size?: number;
}

export const Grid: React.FC<GridProps> = () => {
  return null; // Vector dot/line grid rendered inside Konva Layer in Canvas.tsx
};
