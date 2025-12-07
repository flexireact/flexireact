import React, { forwardRef, ImgHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const avatarVariants = cva(
  `relative inline-flex shrink-0 overflow-hidden rounded-full bg-[var(--flexi-bg-subtle)]`,
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
      ring: {
        true: 'ring-2 ring-[var(--flexi-primary)] ring-offset-2 ring-offset-[var(--flexi-bg)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, size, ring, src, alt, fallback, status, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };

    return (
      <span ref={ref} className={cn(avatarVariants({ size, ring, className }), 'relative')}>
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setHasError(true)}
            {...props}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-[var(--flexi-primary)]/20 text-[var(--flexi-primary)] font-medium">
            {fallback ? getInitials(fallback) : '?'}
          </span>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--flexi-bg)]',
              statusColors[status]
            )}
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  className?: string;
}

function AvatarGroup({ children, max = 4, className }: AvatarGroupProps) {
  const avatars = React.Children.toArray(children);
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-3', className)}>
      {visible}
      {remaining > 0 && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--flexi-bg-subtle)] text-sm font-medium text-[var(--flexi-fg)] ring-2 ring-[var(--flexi-bg)]">
          +{remaining}
        </span>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup, avatarVariants };
