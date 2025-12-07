'use client';

import React, { forwardRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '../utils/cn';

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
}

const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex items-center gap-2">
      <CheckboxPrimitive.Root
        ref={ref}
        id={checkboxId}
        className={cn(
          `peer h-5 w-5 shrink-0 rounded-md border-2 border-[var(--flexi-border)]
           bg-[var(--flexi-bg)] transition-all duration-200
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--flexi-ring)] focus-visible:ring-offset-2
           disabled:cursor-not-allowed disabled:opacity-50
           data-[state=checked]:border-[var(--flexi-primary)] data-[state=checked]:bg-[var(--flexi-primary)]`,
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--flexi-primary-fg)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className="text-sm text-[var(--flexi-fg)] cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          {label}
        </label>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
