'use client';

import React, { forwardRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../utils/cn';

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, size = 'md', id, ...props }, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).slice(2)}`;

  const sizes = {
    sm: { root: 'h-5 w-9', thumb: 'h-4 w-4 data-[state=checked]:translate-x-4' },
    md: { root: 'h-6 w-11', thumb: 'h-5 w-5 data-[state=checked]:translate-x-5' },
    lg: { root: 'h-7 w-14', thumb: 'h-6 w-6 data-[state=checked]:translate-x-7' },
  };

  return (
    <div className="flex items-center gap-2">
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          `peer inline-flex shrink-0 cursor-pointer items-center rounded-full
           border-2 border-transparent bg-secondary transition-colors
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C]/50 focus-visible:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50
           data-[state=checked]:bg-[#00FF9C]`,
          sizes[size].root,
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            `pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform`,
            sizes[size].thumb
          )}
        />
      </SwitchPrimitive.Root>
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm text-foreground cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export { Switch };
