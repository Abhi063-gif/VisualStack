import React from 'react';
import { cn } from '../../utils/cn';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-7 w-full rounded-sm border border-[#232733] bg-[#0e0f12] px-2.5 py-1 text-xs text-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#14161b] text-gray-200">
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Dropdown.displayName = 'Dropdown';
