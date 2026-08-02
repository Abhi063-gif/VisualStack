import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700',
        secondary: 'bg-[#1a1d24] text-gray-200 hover:bg-[#222631] border border-[#232733]',
        ghost: 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1d24]',
        danger: 'bg-rose-600 text-white hover:bg-rose-500',
        outline: 'border border-[#363c4e] text-gray-300 hover:bg-[#1f232d]',
      },
      size: {
        sm: 'h-7 px-2.5 rounded-sm',
        md: 'h-8 px-3 rounded-md',
        lg: 'h-10 px-4 rounded-md',
        icon: 'h-7 w-7 p-0 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
