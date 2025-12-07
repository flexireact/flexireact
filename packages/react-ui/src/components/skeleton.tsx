import React from 'react';
import { cn } from '../utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variants = {
    default: 'rounded-2xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--flexi-bg-muted)]',
        variants[variant],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// Pre-built skeleton components
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4 p-6 rounded-2xl border border-[var(--flexi-border)]', className)}>
      <Skeleton height={200} />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24', className)} />;
}

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, SkeletonButton };
