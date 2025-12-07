import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const inputVariants = cva(
  `flex w-full rounded-2xl border bg-[var(--flexi-bg)] px-4 py-2
   text-sm text-[var(--flexi-fg)] placeholder:text-[var(--flexi-fg-muted)]
   transition-all duration-200
   focus:outline-none focus:ring-2 focus:ring-[var(--flexi-ring)] focus:ring-offset-2
   disabled:cursor-not-allowed disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'border-[var(--flexi-border)]',
        filled: 'border-transparent bg-[var(--flexi-bg-subtle)]',
        flushed: 'rounded-none border-x-0 border-t-0 border-b-2 px-0 focus:ring-0',
      },
      inputSize: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      error: {
        true: 'border-red-500 focus:ring-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
  helperText?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      error,
      leftElement,
      rightElement,
      helperText,
      label,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="flexi-input-wrapper w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--flexi-fg)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--flexi-fg-muted)]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant, inputSize, error, className }),
              leftElement && 'pl-10',
              rightElement && 'pr-10'
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--flexi-fg-muted)]">
              {rightElement}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-red-500' : 'text-[var(--flexi-fg-muted)]'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
