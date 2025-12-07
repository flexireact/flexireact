import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const textareaVariants = cva(
  `flex w-full rounded-2xl border bg-[var(--flexi-bg)] px-4 py-3
   text-sm text-[var(--flexi-fg)] placeholder:text-[var(--flexi-fg-muted)]
   transition-all duration-200 resize-none
   focus:outline-none focus:ring-2 focus:ring-[var(--flexi-ring)] focus:ring-offset-2
   disabled:cursor-not-allowed disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: 'border-[var(--flexi-border)]',
        filled: 'border-transparent bg-[var(--flexi-bg-subtle)]',
      },
      error: {
        true: 'border-red-500 focus:ring-red-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, label, helperText, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`;

    return (
      <div className="flexi-textarea-wrapper w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--flexi-fg)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(textareaVariants({ variant, error, className }))}
          {...props}
        />
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

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
