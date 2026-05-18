import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          {
            'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/20':
              variant === 'default',
            'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20':
              variant === 'destructive',
            'border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-200':
              variant === 'outline',
            'bg-neutral-800 text-neutral-100 hover:bg-neutral-700':
              variant === 'secondary',
            'hover:bg-neutral-800/50 text-neutral-300 hover:text-neutral-100':
              variant === 'ghost',
            'text-emerald-400 underline-offset-4 hover:underline':
              variant === 'link',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-lg px-8': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
