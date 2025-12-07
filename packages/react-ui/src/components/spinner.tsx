import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const spinnerVariants = cva(
  'animate-spin',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-[var(--flexi-primary)]',
        muted: 'text-[var(--flexi-fg-muted)]',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

function Spinner({ className, size, variant, label = 'Loading...', ...props }: SpinnerProps) {
  return (
    <svg
      className={cn(spinnerVariants({ size, variant, className }))}
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Dots loader variant
function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-[var(--flexi-primary)] animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// Pulse loader variant
function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-10 w-10', className)}>
      <div className="absolute inset-0 rounded-full bg-[var(--flexi-primary)] opacity-75 animate-ping" />
      <div className="relative rounded-full h-10 w-10 bg-[var(--flexi-primary)]" />
    </div>
  );
}

export { Spinner, DotsLoader, PulseLoader, spinnerVariants };
