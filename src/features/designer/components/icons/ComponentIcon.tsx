import React from 'react';
import * as LucideIcons from 'lucide-react';

interface ComponentIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const ComponentIcon: React.FC<ComponentIconProps> = ({ name, size = 16, className }) => {
  // Convert kebab-case to PascalCase (e.g., mouse-pointer-click -> MousePointerClick)
  const pascalName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  
  const IconComponent = (LucideIcons as any)[pascalName] || LucideIcons.Square;

  return <IconComponent size={size} className={className} />;
};
