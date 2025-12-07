'use client';

import React, { forwardRef } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../utils/cn';

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showValue, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-[var(--flexi-bg-muted)]',
          sizes[size],
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            'h-full w-full flex-1 bg-[var(--flexi-primary)] transition-all duration-300 ease-out',
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[var(--flexi-fg-muted)] ml-2">
          {value}%
        </span>
      )}
    </div>
  );
});

Progress.displayName = 'Progress';

export { Progress };
