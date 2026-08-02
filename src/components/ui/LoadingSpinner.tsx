import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 20, className }) => (
  <div className="flex items-center justify-center p-4">
    <Loader2 size={size} className={cn('animate-spin text-indigo-500', className)} />
  </div>
);

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 select-none h-full">
    {icon && <div className="mb-3 text-gray-500">{icon}</div>}
    <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
    {description && <p className="mt-1 text-xs text-gray-500 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
